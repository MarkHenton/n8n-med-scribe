-- 1) Roles enum and table
create type if not exists public.app_role as enum ('admin', 'subscriber');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role),
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

-- Allow users to read their own roles
create policy if not exists "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid());

-- Only admins can manage roles (we'll rely on SQL console for initial seeding)
create policy if not exists "Admins can insert roles"
  on public.user_roles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update roles"
  on public.user_roles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete roles"
  on public.user_roles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 2) has_role helper function
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 3) Profiles table (no trigger on auth schema)
create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy if not exists "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy if not exists "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid());

-- Admin full access
create policy if not exists "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can upsert profiles"
  on public.profiles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin') or id = auth.uid());

-- 4) Documents table to track uploaded materials by type
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, -- ex: audio_resumo, mapa_mental, rel_documento_resumo, rel_guia_estudo, rel_faq, rel_linha_tempo
  title text,
  description text,
  file_path text not null, -- storage path within 'documents' bucket, e.g., `${user_id}/file.ext`
  mime_type text,
  size_bytes integer,
  language text not null default 'pt-BR',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_user on public.documents(user_id);
create index if not exists idx_documents_type on public.documents(type);

alter table public.documents enable row level security;

-- Users can read only their own documents
create policy if not exists "Users can read own documents"
  on public.documents
  for select
  to authenticated
  using (user_id = auth.uid());

-- Only admins can manage documents (insert/update/delete)
create policy if not exists "Admins can insert documents"
  on public.documents
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can update documents"
  on public.documents
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can delete documents"
  on public.documents
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 5) Updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_documents_updated_at
before update on public.documents
for each row execute function public.update_updated_at_column();

create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

-- 6) Storage bucket for documents (private)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Storage policies
-- Admin full access to documents bucket
create policy if not exists "Admin read objects in documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin')
  );

create policy if not exists "Admin insert objects in documents"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin')
  );

create policy if not exists "Admin update objects in documents"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin')
  );

create policy if not exists "Admin delete objects in documents"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin')
  );

-- Users can read only their own files (path prefix user_id/)
create policy if not exists "Users can read own objects in documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 7) Subscribers table for Stripe integration (status mirrored)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  stripe_customer_id text,
  subscribed boolean not null default false,
  subscription_tier text,
  subscription_end timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

create policy if not exists "select_own_subscription"
  on public.subscribers
  for select
  to authenticated
  using (user_id = auth.uid() or email = auth.email());

create policy if not exists "update_subscription_by_functions"
  on public.subscribers
  for update
  to authenticated
  using (true);

create policy if not exists "insert_subscription_by_functions"
  on public.subscribers
  for insert
  to authenticated
  with check (true);
