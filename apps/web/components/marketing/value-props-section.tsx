import { Eye, ShieldCheck, Users } from "lucide-react";

/**
 * Three value-prop cards. Plain text + lucide icons in soft tinted circles.
 * Background: muted slate so the section reads as a "shelf" between the
 * white hero and the next section.
 */
export function ValuePropsSection() {
  const items = [
    {
      icon: Eye,
      title: "Catches dangerous links",
      desc: "Every link in your inbox is checked against Google's database of known phishing and malware sites. Plus our own detection for fake brand pages and look-alike domains.",
    },
    {
      icon: ShieldCheck,
      title: "Warns you before you click",
      desc: "If a link looks dangerous, we stop the click and show a clear warning in plain English — with a single big button to go back safely.",
    },
    {
      icon: Users,
      title: "Keep your family safe",
      desc: "Set it up for a parent or grandparent in seconds. They never need an account. You see the dangerous links they encounter, without ever reading their email.",
    },
  ];

  return (
    <section className="bg-muted/40 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Built for the people most often targeted.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Older internet users get phished four times more often. Gone
            Phishin&apos; is for them — designed to stay out of the way until
            something is actually wrong.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-3xl border border-border bg-background p-7"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <it.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
