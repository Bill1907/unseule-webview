import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "./client";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={(to) => router.navigate({ to })}
      replace={(to) => router.navigate({ to, replace: true })}
      onSessionChange={() => router.invalidate()}
      social={{ providers: ["google", "apple"] }}
      redirectTo="/"
    >
      {children}
    </NeonAuthUIProvider>
  );
}
