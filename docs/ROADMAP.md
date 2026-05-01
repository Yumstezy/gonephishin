# Gone Phishin' — Roadmap

_Written 2026-05-01, post-Chrome-Web-Store-submission. Edit freely._

The goal of this roadmap is to keep the product honest: build only what
real users need, in priority order, and avoid the trap of inventing
features for an imaginary user. Re-read this whenever you're tempted to
pick up something shiny.

## Anti-goals (read first)

These are deliberately **off** the roadmap. If you find yourself doing
one of these, stop and ask why.

- **A native iOS / Android app.** iPhone Mail and the Gmail Android app
  have no extension API. Building "Gone Phishin' Mobile" would mean a
  separate native codebase that can't actually intercept email links in
  the apps people use — at best it covers webmail in mobile Safari /
  Chrome. Wrong cost, wrong audience, wrong stage.
- **Your own threat intel database.** Google Safe Browsing already
  ingests phishing reports from the entire web. Don't compete with it;
  layer on top of it.
- **A paid tier before product/market fit.** Free + word-of-mouth is the
  growth engine for this audience.
- **A big marketing push before the product feedback loop is tight.**
  100 visitors who install once and churn ≪ 10 grandmothers who never
  touch it again because it just works.
- **Refactoring for scale.** Postgres + Vercel handle 100× more load than
  you'll have for the next 6 months. Boring is correct.

---

## Stage 1 — Approved & wired up (next 1–7 days)

The Web Store is in review. Once it's approved:

- [ ] Add `NEXT_PUBLIC_EXTENSION_ID` to Vercel Production + Preview, redeploy.
- [ ] Update marketing CTAs (`hero.tsx`, `nav.tsx`, `cta-section.tsx`,
      footer's "Install free") to point at the public Web Store URL
      instead of `/sign-up`.
- [ ] Attach the custom `gonephishin.com` domain in Vercel. Update
      privacy policy URL + support URL on the Web Store listing
      afterwards (no re-review needed for those two fields).
- [ ] Post the Web Store URL on your own personal channels (LinkedIn,
      one Discord, one group chat). Don't ask for shares yet — just put
      it where curious people will see it.

**Success criteria for Stage 1:** the install flow works end-to-end for
a person who isn't you, on a computer that isn't yours.

---

## Stage 2 — First five real users (week 2–4)

The single most important thing right now is **getting 5 real users**.
Specifically: 5 older adults (parents, grandparents, family friends'
parents) running the extension on their actual day-to-day browser.

- [ ] Install it on **your own parents' / grandparents' machines** in
      person. Set up a caregiver circle for each. Watch what their
      inboxes catch over a week.
- [ ] DM 3 friends with older parents: "would you set this up for your
      mom this week, free, I want to know what you both think." Don't
      pitch — ask for help.
- [ ] Build a private internal page (e.g. `/internal/health`, gated to
      your email) that shows: total events last 7 days, by threat type,
      by circle. So you can answer "is anyone using it" in 5 seconds.
- [ ] Talk to each user once they've had the extension for a week.
      What got flagged that shouldn't have? What got missed? Did the
      caregiver dashboard ever feel useful?

**Success criteria for Stage 2:** at least one warning fires for a
user who isn't you, on an email you didn't plant.

---

## Stage 3 — Tighten the loop (month 2)

Now that you have signal, fix the things that actually matter — not the
ones that *feel* like they matter.

- [ ] **Yahoo Mail web support.** Older audience, similar tech to Gmail.
      Add a `yahoo` site adapter in `apps/extension/src/content/sites/`.
- [ ] **Edge browser support.** Most Edge installs are on Windows
      machines belonging to people over 50 — your exact audience.
      Submission to the Edge Add-ons store is essentially free; the same
      MV3 zip works.
- [ ] **Caregiver weekly-digest email.** Once a week, send the caregiver
      a short summary: "Gone Phishin' stopped 3 dangerous links for Mom
      this week." This is the single biggest engagement lever you have —
      it makes the product visible without asking the caregiver to log
      in.
- [ ] **False-positive feedback loop.** Add a one-click "this was fine,
      let me through and don't ask again" button on the warning modal.
      Log those reports; read them weekly.
- [ ] **Heuristic tuning** based on what real users see. Your local
      heuristics catch typosquats, IDN homoglyphs, IP-only links,
      excessive subdomains, suspicious TLDs. Ship one new check per
      month based on real false-negative reports.

**Success criteria for Stage 3:** weekly digest open rate > 40%, false
positive rate < 1 per user per week.

---

## Stage 4 — Reach (month 3–4)

Once Stage 3 is steady, expand reach.

- [ ] **Firefox version.** MV3 in Firefox is mostly compatible; the
      dist/ zip needs minor manifest tweaks. Submitting to addons.mozilla.org
      is free.
- [ ] **iCloud Mail + AOL Mail web adapters.** Same code shape as Yahoo.
- [ ] **Spanish localization.** The largest non-English grandparent
      demographic in the US. Marketing site + popup + warning modal
      copy. Use a translator, not Google Translate.
- [ ] **A 90-second demo video** on the marketing page. Older users
      decide to install based on whether they see the warning happen,
      not whether they read the copy.
- [ ] **Start a /blog** (or just a `/post/...` route) and write one
      post: "What we caught this week" — anonymized examples of real
      phishing your users dodged. Honest, useful, share-bait.

**Success criteria for Stage 4:** > 100 weekly active installs across
Chrome + Edge + Firefox.

---

## Stage 5 — Sustainability (month 5–6)

Only get here if the product is genuinely working.

- [ ] **Cost monitoring.** Vercel + Neon free tiers cover a lot, but
      Safe Browsing API has a quota. Add a daily metric for API calls
      vs. cache hit rate. If you ever cross 50% of a quota, plan
      ahead.
- [ ] **Error monitoring.** Add Sentry (free tier) so you know when
      `/api/scan` is throwing in production before users tell you.
- [ ] **Lightweight, privacy-respecting analytics.** Plausible or
      Simple Analytics on the marketing site (NOT inside the
      extension). 10-line install, no cookies, no fingerprinting,
      consistent with the privacy policy.
- [ ] **Caregiver invite-by-link.** Right now the only way to set up a
      family member is reading them a code over the phone. A signed,
      single-use invite link they can click — same security guarantee,
      lower friction.
- [ ] **A "donate" link** if (and only if) you've started getting
      unsolicited "how can I support this" emails. Don't put it up
      pre-emptively; it cheapens the product.

**Success criteria for Stage 5:** no paid plan, no investors, no
employees, just a small thing that protects a few thousand people's
parents and pays for itself in goodwill.

---

## Things to deliberately not decide yet

These are real questions but trying to answer them now is premature.
Park them.

- Custom branded warning modals for enterprises.
- Team / family plans (multi-caregiver per circle).
- A native macOS / Windows desktop app.
- AI-generated explanations of why a link is dangerous ("this looks
  like Bank of America's login page but the URL is a typo of their
  domain"). Tempting, but cost / latency / hallucination risk vs. the
  clear plain-English warning we already show — not a clear win.
- iOS Safari Web Extension for mobile webmail. Maybe at Stage 6+,
  maybe never.
- Open-sourcing the repo. There's a real argument either way; defer
  until you've decided whether you want contributors or just users.

---

## A note on the bar

The user is your grandmother. If a feature would confuse her, doesn't
ship. If a warning would scare her into clicking the wrong button,
doesn't ship. If a permission is creepy, doesn't ship. Re-read this
when you're tempted to over-build.
