import { createFileRoute } from "@tanstack/react-router";
import { AccountView } from "@neondatabase/auth/react";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/account/")({
  beforeLoad: requireAuth,
  component: AccountPage,
});

function AccountPage() {
  return (
    <main className="flex-1 p-4">
      <AccountView path="settings" />
    </main>
  );
}
