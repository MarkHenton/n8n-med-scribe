-- 0) Helper: roles enum and has_role function first
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'subscriber');
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

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

-- 1) user_roles table + RLS
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role),
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can insert roles"
  on public.user_roles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can update roles"
  on public.user_roles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can delete roles"
  on public.user_roles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 2) profiles table
create table if not exists public.profiles (
  id uuid primary key,
  email text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid());

create policy "Admins can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can upsert profiles"
  on public.profiles
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'::public.app_role) or id = auth.uid());

-- 3) documents table
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text,
  description text,
  file_path text not null,
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

create policy "Users can read own documents"
  on public.documents
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can insert documents"
  on public.documents
  for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can update documents"
  on public.documents
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can delete documents"
  on public.documents
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4) update triggers
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

-- 5) storage bucket and policies
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "Admin read objects in documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin'::public.app_role)
  );

create policy "Admin insert objects in documents"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin'::public.app_role)
  );

create policy "Admin update objects in documents"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin'::public.app_role)
  );

create policy "Admin delete objects in documents"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'documents' and public.has_role(auth.uid(), 'admin'::public.app_role)
  );

create policy "Users can read own objects in documents"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'documents' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- 6) subscribers
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

create policy "select_own_subscription"
  on public.subscribers
  for select
  to authenticated
  using (user_id = auth.uid() or email = auth.email());

create policy "update_subscription_by_functions"
  on public.subscribers
  for update
  to authenticated
  using (true);

create policy "insert_subscription_by_functions"
  on public.subscribers
  for insert
  to authenticated
  with check (true);
