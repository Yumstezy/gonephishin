import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function FooterSection() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-12 md:flex-row md:items-center">
        <Logo size={26} />
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-muted-foreground">
          <Link
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#privacy"
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
          <Link
            href="/sign-in"
            className="transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <a
            href="mailto:hello@gonephishin.com"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gone Phishin&apos;
        </p>
      </div>
    </footer>
  );
}
