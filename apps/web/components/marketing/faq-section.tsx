"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Is Gone Phishin' really free?",
    a: "Yes. The extension and the dashboard are both free. We're not building this on advertising or data resale either.",
  },
  {
    q: "What email services does it work on?",
    a: "Gmail and Outlook on the web today. Yahoo Mail and a few others are coming next.",
  },
  {
    q: "Does it really not read my email?",
    a: "Correct. The extension only inspects the URLs of the links in your messages. The subject line, sender, and body are never sent anywhere.",
  },
  {
    q: "How do I install it for my parent?",
    a: "Sign up on this page, create a 'circle' for them, generate a 6-digit code, and read it to them over the phone. They type it once into the extension popup. They never need an account.",
  },
  {
    q: "Will it slow down my browser?",
    a: "Not noticeably. We check links in batches, cache results for 24 hours, and never block the page from rendering.",
  },
  {
    q: "How do I remove it?",
    a: "Right-click the extension icon and choose 'Remove from Chrome.' That deletes everything stored locally.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="border-t border-border bg-background py-32 md:py-40"
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-16 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            FAQ
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
            Questions, answered plainly.
          </h2>
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {FAQS.map((f, i) => {
            const expanded = open === i;
            return (
              <li key={f.q}>
                <button
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:opacity-90"
                  aria-expanded={expanded}
                >
                  <span className="text-base font-medium leading-snug md:text-lg">
                    {f.q}
                  </span>
                  <span className="mt-0.5 shrink-0 text-muted-foreground">
                    {expanded ? (
                      <Minus className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </span>
                </button>
                {expanded && (
                  <p className="pb-6 pr-12 text-[15px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
