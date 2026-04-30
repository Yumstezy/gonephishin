import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  // Same fix as sign-up: if there's an active session, redirect instead
  // of letting Clerk render an empty widget.
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#38bdf8",
            borderRadius: "0.5rem",
          },
        }}
      />
    </div>
  );
}
