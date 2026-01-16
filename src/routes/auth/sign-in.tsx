import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>
        <RedirectToAccount navigate={navigate} />
      </SignedIn>
      <SignedOut>
        <main className="flex-1 flex items-center justify-center p-4">
          <SignIn
            routing="path"
            path="/auth/sign-in"
            signUpUrl="/auth/sign-up"
            forceRedirectUrl="/account"
          />
        </main>
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
