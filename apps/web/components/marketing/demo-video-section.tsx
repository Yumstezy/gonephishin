import { Reveal } from "./reveal";

/**
 * Hero-adjacent video section. Shows the 60-second walkthrough of the
 * extension in actual use — this is the single highest-conversion asset
 * on the page for the older-relative target audience, who decide on the
 * basis of "do I see the warning happen" not "does the copy mention X."
 */
export function DemoVideoSection() {
  return (
    <section className="band demo-video">
      <div className="container-marketing">
        <Reveal className="section-intro">
          <span className="kicker">See it in action</span>
          <h2>The whole product, in 60 seconds.</h2>
          <p>A real inbox, a real phishing link, a real warning.</p>
        </Reveal>
        <Reveal className="max-4xl demo-video-frame">
          <video
            controls
            playsInline
            preload="metadata"
            poster="/icon.png"
            aria-label="Gone Phishin' demo: catching a phishing link in Gmail"
          >
            <source src="/promo.mov" type="video/mp4" />
            <source src="/promo.mov" type="video/quicktime" />
            Your browser doesn&apos;t support inline video.{" "}
            <a href="/promo.mov">Download the demo (.mov)</a>.
          </video>
        </Reveal>
      </div>
    </section>
  );
}
