import { Reveal } from "./reveal";

export function CTASection() {
  return (
    <section className="band final-cta">
      <div className="container-marketing">
        <Reveal className="max-2xl">
          <h2>Stop a scam in 10 seconds.</h2>
          <p>
            Install Gone Phishin&apos; on your browser, or set it up for
            someone who needs it more than you do.
          </p>
          <a
            href="https://chromewebstore.google.com/detail/gone-phishin/ifckleibjeadbcebapahhahhleoifofb"
            className="btn btn-primary btn-lg"
            target="_blank"
            rel="noreferrer"
          >
            Install free
          </a>
        </Reveal>
      </div>
    </section>
  );
}
