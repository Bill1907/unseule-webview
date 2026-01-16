import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>
        <RedirectToAccount navigate={navigate} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function RedirectToAccount({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
  useEffect(() => {
    navigate({ to: "/account" });
  }, [navigate]);
  return null;
}
