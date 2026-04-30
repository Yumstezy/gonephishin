import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { WaveRule } from "./ornament";

export function FooterSection() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-20">
        <WaveRule className="mb-12 h-3 w-full text-primary/40" />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo size={36} />
            <p className="mt-6 max-w-xs font-newsreader text-[15px] leading-[1.55] text-foreground/65">
              A free extension for the inbox of every parent, grandparent, or
              friend who deserves a quieter, safer corner of the internet.
            </p>
          </div>
          <FooterColumn
            title="Product"
            links={[
              { label: "How it works", href: "#how-it-works" },
              { label: "Privacy", href: "#privacy" },
              { label: "FAQ", href: "#faq" },
            ]}
          />
          <FooterColumn
            title="Account"
            links={[
              { label: "Install free", href: "/sign-up" },
              { label: "Sign in", href: "/sign-in" },
              { label: "Dashboard", href: "/dashboard" },
            ]}
          />
          <FooterColumn
            title="Reach Out"
            links={[
              {
                label: "hello@gonephishin.com",
                href: "mailto:hello@gonephishin.com",
              },
              { label: "@gonephishin", href: "#" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 font-mono-display text-[10px] uppercase tracking-[0.3em] text-foreground/55 md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} Gone Phishin&apos;. All Rights
            Reserved.
          </span>
          <span>Cape Cod · MMXXVI</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-5 font-mono-display text-[10px] uppercase tracking-[0.3em] text-primary">
        {title}
      </h4>
      <ul className="space-y-3 font-newsreader text-[15px] text-foreground/75">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
