"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

/**
 * FAQ as a numbered editorial list — clicking expands the answer. Custom
 * accordion (not the shadcn radix one) so the typography is fully
 * editorial: roman numerals, display question, body answer.
 */
const FAQS = [
  {
    q: "Is Gone Phishin' really free?",
    a: "Yes. The extension and the dashboard are both free. There's no paid tier yet, and no plans to charge ordinary users. We're not building this on advertisements or data resale either — see the privacy section above.",
  },
  {
    q: "What email services does it work on?",
    a: "Gmail and Outlook on the web today. Yahoo Mail and a couple of other webmail services are coming next.",
  },
  {
    q: "Does it really not read my email?",
    a: "Correct. The extension only inspects the URLs of the links in your messages. The subject line, sender, and body are never sent anywhere. The Chrome Web Store reviewers verified this before listing us.",
  },
  {
    q: "How do I install it for my parent?",
    a: "Sign up on this page, then create a 'circle' for them. Generate a six-digit code and read it to them over the phone. They type it once into the extension popup. That's it — they never need an account.",
  },
  {
    q: "Will it slow down my browser?",
    a: "No noticeable difference. We check links in batches, cache results for twenty-four hours, and never block the page from rendering. If our service is offline, links just stay un-checked instead of breaking.",
  },
  {
    q: "How do I remove it?",
    a: "Right-click the extension icon and choose 'Remove from Chrome.' That deletes everything Gone Phishin' stored locally. If you had an account, you can delete it from Settings on this site.",
  },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-16 text-center">
          <p className="mb-4 font-mono-display text-[11px] uppercase tracking-[0.3em] text-primary">
            Correspondence
          </p>
          <h2 className="font-display text-[44px] leading-[1] tracking-tight text-foreground md:text-[56px]">
            Questions, answered{" "}
            <span className="font-display-italic">plainly</span>.
          </h2>
        </header>

        <ol className="border-t border-border">
          {FAQS.map((f, i) => (
            <li key={f.q} className="border-b border-border">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="grid w-full grid-cols-[36px_1fr_24px] items-baseline gap-4 py-6 text-left transition-colors hover:bg-secondary/40"
                aria-expanded={open === i}
              >
                <span className="font-mono-display text-[11px] uppercase tracking-[0.25em] text-primary">
                  {ROMAN[i]}.
                </span>
                <span className="font-display text-[22px] leading-snug text-foreground">
                  {f.q}
                </span>
                <span className="self-center text-foreground/55">
                  {open === i ? (
                    <Minus className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="grid grid-cols-[36px_1fr_24px] gap-4 pb-7">
                  <span aria-hidden />
                  <p className="font-newsreader text-[17px] leading-[1.65] text-foreground/75">
                    {f.a}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
