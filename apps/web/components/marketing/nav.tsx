import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

export async function MarketingNav() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <span className="hidden font-display text-base small-caps text-foreground/70 sm:inline">
            Est. MMXXVI
          </span>
        </div>

        <div className="flex items-center gap-7">
          <Link
            href="#how-it-works"
            className="hidden text-sm small-caps text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            How it Works
          </Link>
          <Link
            href="#privacy"
            className="hidden text-sm small-caps text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            Privacy
          </Link>
          <Link
            href="#faq"
            className="hidden text-sm small-caps text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            FAQ
          </Link>
          {signedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm small-caps text-foreground/70 transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden text-sm small-caps text-foreground/70 transition-colors hover:text-foreground sm:inline"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-display text-sm text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Install Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
