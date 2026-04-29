import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#0369a1",
            borderRadius: "0.5rem",
          },
        }}
      />
    </div>
  );
}
