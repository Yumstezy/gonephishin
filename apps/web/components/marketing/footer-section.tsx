import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function FooterSection() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <Logo size={28} />
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link href="#how-it-works" className="hover:text-foreground">
            How it works
          </Link>
          <Link href="#faq" className="hover:text-foreground">
            FAQ
          </Link>
          <Link href="/sign-in" className="hover:text-foreground">
            Sign in
          </Link>
          <a href="mailto:hello@gonephishin.com" className="hover:text-foreground">
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
