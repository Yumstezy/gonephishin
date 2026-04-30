import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
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
