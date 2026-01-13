import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({ to: "/account" });
    } else {
      throw redirect({ to: "/auth/sign-in" });
    }
  },
  component: Index,
});

function Index() {
  return null;
}
