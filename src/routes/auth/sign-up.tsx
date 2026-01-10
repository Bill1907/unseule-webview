import { createFileRoute } from "@tanstack/react-router";
import { AuthView } from "@neondatabase/auth/react";
import { requireGuest } from "@/lib/auth";

export const Route = createFileRoute("/auth/sign-up")({
  beforeLoad: requireGuest,
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <AuthView path="sign-up" />
    </main>
  );
}
