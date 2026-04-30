import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

export async function MarketingNav() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo size={28} />
        <div className="flex items-center gap-7">
          <Link
            href="#features"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Features
          </Link>
          <Link
            href="#privacy"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Privacy
          </Link>
          <Link
            href="#faq"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            FAQ
          </Link>
          {signedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Install
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
