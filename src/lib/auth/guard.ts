import { redirect } from "@tanstack/react-router";
import { authClient } from "./client";

export async function requireAuth() {
  const session = await authClient.getSession();
  if (!session.data) {
    throw redirect({ to: "/auth/sign-in" });
  }
  return session.data;
}

export async function requireGuest() {
  const session = await authClient.getSession();
  if (session.data) {
    throw redirect({ to: "/account" });
  }
}
