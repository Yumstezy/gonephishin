import Link from "next/link";
import { Reveal } from "./reveal";

export function ComparePathsSection() {
  return (
    <section className="band">
      <div className="container-marketing">
        <Reveal className="section-intro">
          <span className="kicker">Two paths</span>
          <h2>For yourself, or for someone you love.</h2>
          <p>Whichever side you&apos;re on, the protection is the same.</p>
        </Reveal>
        <div className="max-6xl">
          <div className="compare-grid">
            <Reveal className="compare-card">
              <div className="label">For yourself</div>
              <h3>Protect your own inbox.</h3>
              <p>
                Sign up, install the extension, and you&apos;ll see every
                dangerous link we&apos;ve stopped on your own dashboard.
              </p>
              <Link
                href="/sign-up"
                className="btn btn-primary"
                style={{ alignSelf: "flex-start" }}
              >
                Sign up — it&apos;s free
              </Link>
            </Reveal>
            <Reveal className="compare-card" delay={1}>
              <div className="label">For a family member</div>
              <h3>A parent. A grandparent. A friend.</h3>
              <p>
                Create your account, generate a 6-digit code, and read it to
                them on the phone. They type it once. You see only what&apos;s
                dangerous.
              </p>
              <Link
                href="/sign-up"
                className="btn btn-secondary"
                style={{ alignSelf: "flex-start" }}
              >
                Set up a family circle
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
