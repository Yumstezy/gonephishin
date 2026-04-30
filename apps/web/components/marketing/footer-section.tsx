import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function FooterSection() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
          <div>
            <Logo size={32} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A safer, calmer inbox for everyone in your family.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#faq" className="hover:text-foreground">
              FAQ
            </Link>
            <Link href="/sign-in" className="hover:text-foreground">
              Sign in
            </Link>
            <a
              href="mailto:hello@gonephishin.com"
              className="hover:text-foreground"
            >
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gone Phishin&apos;
        </div>
      </div>
    </footer>
  );
}
