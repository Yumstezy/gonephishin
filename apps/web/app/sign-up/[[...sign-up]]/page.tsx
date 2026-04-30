import { auth } from "@clerk/nextjs/server";
import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  // Already signed in → don't render an empty page; send them to the
  // dashboard. This is the cause of the "huge dark empty area" you'd see
  // below the nav otherwise — Clerk's widget renders nothing when a
  // session is active.
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
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
