import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { InlineSvg } from "./inline-svg";
import { StickyNavScript } from "./sticky-nav-script";

/**
 * Sticky marketing nav. Brand fish mark + "Gone Phishin'" text, four
 * anchor links, and either Sign-in/Install for signed-out visitors or
 * Dashboard/UserButton for signed-in ones.
 */
export async function MarketingNav() {
  const { userId } = await auth();
  const signedIn = Boolean(userId);

  return (
    <>
      <nav className="site" id="siteNav">
        <div className="container-marketing inner">
          <Link href="/" className="brand" aria-label="Gone Phishin' home">
            <span className="mark">
              <InlineSvg src="/fish.svg" />
            </span>
            <span className="name">Gone Phishin&apos;</span>
          </Link>
          <ul>
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#how-it-works">How it works</Link></li>
            <li><Link href="#privacy">Privacy</Link></li>
            <li><Link href="#faq">FAQ</Link></li>
          </ul>
          <div className="right">
            {signedIn ? (
              <>
                <Link href="/dashboard" className="signin">Dashboard</Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="signin">Sign in</Link>
                <a
                  href="https://chromewebstore.google.com/detail/gone-phishin/ifckleibjeadbcebapahhahhleoifofb"
                  className="btn btn-primary btn-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  Install free
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
      <StickyNavScript />
    </>
  );
}
