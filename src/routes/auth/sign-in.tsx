import { createFileRoute } from "@tanstack/react-router";
import { AuthView } from "@neondatabase/auth/react";
import { requireGuest } from "@/lib/auth";

export const Route = createFileRoute("/auth/sign-in")({
  beforeLoad: requireGuest,
  component: SignInPage,
});

function SignInPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <AuthView path="sign-in" />
    </main>
  );
}
