import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";

export async function MarketingNav() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <nav className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo size={30} />
        <div className="flex items-center gap-8">
          <Link
            href="#features"
            className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            Features
          </Link>
          <Link
            href="#privacy"
            className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            Privacy
          </Link>
          <Link
            href="#faq"
            className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            FAQ
          </Link>
          {signedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Install free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
