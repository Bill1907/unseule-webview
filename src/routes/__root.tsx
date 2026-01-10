import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthProvider } from "@/lib/auth";

const RootLayout = () => (
  <AuthProvider>
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-md min-h-screen flex flex-col">
        <Outlet />
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
