"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Is Gone Phishin' really free?",
    a: "Yes. The extension and the dashboard are both free, and there are no plans to charge. We're not building this on advertising or data resale either — see the privacy section above.",
  },
  {
    q: "What email services does it work on?",
    a: "Gmail and Outlook on the web today. Yahoo Mail and a few others are coming next.",
  },
  {
    q: "Does it really not read my email?",
    a: "Correct. The extension only inspects the URLs of the links in your messages. The subject line, sender, and body are never sent anywhere. The Chrome Web Store reviewers verified this before listing us.",
  },
  {
    q: "How do I install it for my parent?",
    a: "Sign up on this page, then create a 'circle' for them. Generate a six-digit code and read it to them over the phone. They type it once into the extension popup. They never need an account.",
  },
  {
    q: "Will it slow down my browser?",
    a: "Not noticeably. Links are checked in batches, results are cached for 24 hours, and we never block the page from rendering. If our service is offline, links just stay un-checked instead of breaking.",
  },
  {
    q: "How do I remove it?",
    a: "Right-click the extension icon and choose 'Remove from Chrome.' That deletes everything Gone Phishin' stored locally. If you had an account, you can delete it from Settings on this site.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-background py-32 md:py-40">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.14em] text-primary">
            Questions
          </p>
          <h2 className="font-display text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Answered <span className="text-muted-foreground">plainly.</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const expanded = open === i;
            return (
              <div
                key={f.q}
                className="rounded-2xl bg-secondary/50 transition-colors"
              >
                <button
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={expanded}
                >
                  <span className="font-display text-lg font-medium leading-snug md:text-xl">
                    {f.q}
                  </span>
                  <span className="mt-1 shrink-0 text-foreground/70">
                    {expanded ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                </button>
                {expanded && (
                  <p className="px-6 pb-5 text-base leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
