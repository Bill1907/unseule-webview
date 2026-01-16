import { ClerkProvider } from "@clerk/clerk-react";
import { useRouter } from "@tanstack/react-router";
import { koKR } from "@clerk/localizations";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY가 설정되지 않았습니다");
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/auth/sign-in"
      localization={koKR}
      routerPush={(to) => router.navigate({ to })}
      routerReplace={(to) => router.navigate({ to, replace: true })}
    >
      {children}
    </ClerkProvider>
  );
}
