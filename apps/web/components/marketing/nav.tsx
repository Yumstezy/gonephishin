import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export async function MarketingNav() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Logo size={32} />
        <div className="flex items-center gap-4">
          <Link
            href="#how-it-works"
            className="text-sm text-foreground/80 hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="#faq"
            className="text-sm text-foreground/80 hover:text-foreground"
          >
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
                className="text-sm text-foreground/80 hover:text-foreground"
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
