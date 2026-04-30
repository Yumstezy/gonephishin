import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export async function MarketingNav() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <nav className="absolute left-0 right-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo size={32} />
        <div className="flex items-center gap-4">
          <Link
            href="#how-it-works"
            className="text-sm text-white hover:underline"
          >
            How it works
          </Link>
          <Link href="#faq" className="text-sm text-white hover:underline">
            FAQ
          </Link>
          {signedIn ? (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-white hover:underline"
              >
                Sign in
              </Link>
              <Button asChild size="sm">
                <Link href="/sign-up">Install free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
