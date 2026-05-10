import { Reveal } from "./reveal";

const YOUTUBE_ID = "4GLIMzQA6GM";

/**
 * Hero-adjacent video section. Embeds the unlisted YouTube walkthrough
 * via the privacy-enhanced youtube-nocookie domain — for the
 * older-relative target audience the demo is the single
 * highest-conversion asset on the page (they decide based on watching
 * the warning happen, not on copy). Uses native iframe rather than a
 * lite-embed shim so playback works in every browser without an extra
 * JS bundle; the loading="lazy" attribute defers the network call until
 * the user scrolls near it.
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
          <div className="demo-video-aspect">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
              title="Gone Phishin' demo: catching a phishing link in Gmail"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
