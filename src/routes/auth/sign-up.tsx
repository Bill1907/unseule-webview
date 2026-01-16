import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>
        <RedirectToOnboarding navigate={navigate} />
      </SignedIn>
      <SignedOut>
        <main className="flex-1 flex items-center justify-center p-4">
          <SignUp
            routing="path"
            path="/auth/sign-up"
            signInUrl="/auth/sign-in"
            forceRedirectUrl="/onboarding"
          />
        </main>
      </SignedOut>
    </>
  );
}

function RedirectToOnboarding({
  navigate,
}: {
  navigate: ReturnType<typeof useNavigate>;
}) {
  useEffect(() => {
    navigate({ to: "/onboarding" });
  }, [navigate]);
  return null;
}
