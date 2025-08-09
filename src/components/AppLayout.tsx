import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-12 items-center border-b bg-background">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <span className="text-sm font-medium">Medical App</span>
            </div>
          </header>

          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
