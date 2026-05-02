import Link from "next/link";

export function FooterSection() {
  return (
    <footer className="site">
      <div className="container-marketing inner max-6xl">
        <Link href="/" className="brand" aria-label="Gone Phishin' home">
          <span className="mark">
            <img src="/brand-fish.png" alt="" />
          </span>
          <span>Gone Phishin&apos;</span>
        </Link>
        <nav aria-label="Footer">
          <Link href="#features">Features</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="/sign-in">Sign in</Link>
          <a href="mailto:hello@gonephishin.tech">Contact</a>
        </nav>
        <div className="copyright">© 2026 Gone Phishin&apos;</div>
      </div>
    </footer>
  );
}
