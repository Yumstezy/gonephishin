"use client";

import { useState } from "react";
import { Reveal } from "./reveal";

const FAQS = [
  {
    q: "Is Gone Phishin' really free?",
    a: "Yes. The extension and the dashboard are both free. No trial, no credit card, no upsell. We may add a paid tier with team features down the road, but the core protection will always be free.",
  },
  {
    q: "What email services does it work on?",
    a: "Gmail and Outlook on the web, in any Chromium-based browser (Chrome, Edge, Brave, Arc). Apple Mail and other native email apps aren't supported yet.",
  },
  {
    q: "Does it really not read my email?",
    a: "Correct. The extension only looks at the URLs inside your messages — the addresses behind the links — and checks each one against known phishing lists. The subject, sender, body, and attachments are never read or sent anywhere.",
  },
  {
    q: "How do I install it for my parent?",
    a: "Sign up for an account, generate a 6-digit pairing code, and read it to them over the phone. They install the extension once and type the code in. From then on, it just works — they never need to log in again.",
  },
  {
    q: "Will it slow down my browser?",
    a: "No. Link checking happens in milliseconds against a local cache, and the extension is tiny — under a megabyte. You won't notice it's there until it stops something.",
  },
  {
    q: "How do I remove it?",
    a: 'Right-click the fish icon in your browser toolbar and choose "Remove from Chrome." That\'s it. Nothing left behind.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="band" id="faq">
      <div className="container-marketing">
        <Reveal className="max-3xl">
          <div className="section-intro" style={{ marginBottom: 8 }}>
            <span className="kicker">FAQ</span>
            <h2>Questions, answered plainly.</h2>
          </div>
          <ul className="faq-list">
            {FAQS.map((item, i) => {
              const isOpen = i === openIndex;
              return (
                <li key={item.q} className="faq-item">
                  <button
                    className="faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="icn" aria-hidden="true">
                      {isOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {isOpen && <div className="faq-a">{item.a}</div>}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
