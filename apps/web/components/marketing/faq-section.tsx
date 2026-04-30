import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is Gone Phishin' really free?",
    a: "Yes. The extension and the dashboard are both free. There's no paid tier yet, and no plans to charge ordinary users. We're not building this on ads or data resale either — see the privacy section above.",
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
    a: "Sign up on this page, then create a 'circle' for them. Generate a 6-digit code and read it to them over the phone. They type it once into the extension popup. That's it — they never need an account.",
  },
  {
    q: "Will it slow down my browser?",
    a: "No noticeable difference. We check links in batches, cache results for 24 hours, and never block the page from rendering. If our service is offline, links just stay un-checked instead of breaking.",
  },
  {
    q: "How do I remove it?",
    a: "Right-click the extension icon and choose 'Remove from Chrome.' That deletes everything Gone Phishin' stored locally. If you had an account, you can delete it from Settings on this site.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            FAQ
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Questions, answered plainly.
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
