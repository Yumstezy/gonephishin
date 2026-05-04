# Chrome Web Store listing copy

This is the text for the Web Store dashboard form. Each section below is
labeled with the field it goes into.

---

## Name (max 75 chars)

```
Gone Phishin' — Phishing protection for Gmail and Outlook
```

(56 chars)

---

## Short description (max 132 chars)

```
Catches phishing and malware links in Gmail and Outlook before you click them. Free. Built for parents, kids, and grandparents.
```

(127 chars)

---

## Detailed description (max 16,000 chars)

```
Gone Phishin' watches the links in your Gmail and Outlook inbox and warns
you before you click on a phishing or malware page.

It's free, it doesn't read your email, and it was designed for the people in
your life who are most often targeted — your parents, your grandparents,
and anyone else who finds the modern web a little hostile.

WHAT IT DOES

• Marks dangerous links in your inbox with a small icon, so you can see at
  a glance which messages are sketchy.
• Stops you when you click a known phishing or malware page and asks you
  to confirm — with a clear, plain-English warning, not a wall of red text.
• Works on Gmail and Outlook (web). No setup, no accounts, no tracking
  required to use it.

HOW IT WORKS

When you open Gmail or Outlook, the extension reads the URLs of the links
already shown on the page (the same ones your browser shows in the
link-preview tooltip when you hover over them). Each unfamiliar URL is
checked against Google's Safe Browsing list, which is the same threat
database that powers Chrome's red "Deceptive site ahead" page. Verdicts are
cached locally in your browser so we don't keep asking about the same link.

We do NOT read your emails, attachments, subject lines, senders, or
recipients. We never see the contents of your inbox. The only thing the
extension looks at is the clickable URLs that the webmail page already
renders for you.

FOR FAMILIES

If you're setting this up for a parent, grandparent, or anyone else who
isn't a power-user, sign in to gonephishin.tech, create a "family circle"
with their name on it, and read them a 6-digit pairing code over the phone
(no email links to click — that would be ironic). Once they enter the code,
the extension on their browser is paired to your dashboard, where you can
see the threats it's blocked for them. You can revoke the pairing at any
time from Settings.

You can also use Gone Phishin' just for yourself — sign in for yourself
from the extension popup, or skip sign-in entirely. Either way works.

PRIVACY

• We never read your email contents, subjects, senders, recipients, or
  attachments.
• We do not track your browsing history.
• We do not show ads, sell data, or train AI models on your data.
• Full privacy policy: https://gonephishin.tech/privacy

PERMISSIONS WE ASK FOR (AND WHY)

• "Read and change all your data on Gmail / Outlook" — required by Chrome
  to read the link URLs already displayed on those pages so we can flag
  the dangerous ones. The extension only runs on those four hostnames.
• "storage" — caches link verdicts and your sign-in state locally.

That's it. We don't ask for permissions on any other site, we don't read
your tabs, and we don't have access to anything outside the webmail tabs
themselves.

OPEN ABOUT WHAT WE'RE NOT

This is a community-maintained, free safety net — not a replacement for
careful clicking. It catches the phishing and malware sites that Google
already knows about, plus a small set of obvious-looking lookalikes
(typosquats, IP-only links, suspicious TLDs, brand-impersonation links
where the text says one company but the URL goes somewhere else).
Brand-new attacks that haven't been reported yet won't be in the
database. Pair it with the old-fashioned advice: if a message feels off,
don't click; if it claims to be your bank, log into your bank directly.

CONTACT & FEEDBACK

• Web: https://gonephishin.tech
• Privacy questions: privacy@gonephishin.tech
• Bug reports: support@gonephishin.tech

If the extension flagged something it shouldn't have, please send us the
domain — we'd like to know.
```

---

## Category

`Productivity` (primary)

If they want a secondary, `Privacy & Security`.

---

## Language

`English (United States)` (en-US)

---

## Single purpose (Web Store form requires one sentence)

```
Detect and warn about phishing or malware links displayed in Gmail and Outlook before the user clicks them.
```

---

## Permission justifications

Each host_permission and permission needs a one-paragraph reason. Paste
these into the corresponding boxes when the form asks for them.

### `storage`
> Caches the verdicts returned by the Safe Browsing API (so the same link is
> not re-scanned on every page load) and stores the user's pairing state
> (whether the browser is signed in for self-management or paired to a
> caregiver dashboard). All values are local to the browser; nothing is
> synced across devices.

### `https://mail.google.com/*`
> Required to read the rendered URLs of the links inside Gmail messages so
> the extension can flag and intercept dangerous ones. The extension does
> not read message content, subjects, attachments, or sender / recipient
> data. It only inspects anchor `href` attributes already shown on the page.

### `https://outlook.live.com/*`, `https://outlook.office.com/*`, `https://outlook.office365.com/*`
> Same as Gmail above, but for the three Outlook web hostnames Microsoft
> uses (consumer, work / school, and the older office365 hostname). The
> extension only inspects anchor URLs the page already displays.

### `https://gonephishin.tech/*`, `https://*.vercel.app/*`, `http://localhost:3000/*`
> The extension communicates with the Gone Phishin' API to (1) ask for a
> verdict when it encounters a new URL, (2) log a threat event when a
> warning is shown, and (3) accept a pairing token from the activate page
> on our website. The Vercel and localhost hosts are used for staging and
> local development; in the production build only the gonephishin.tech host
> is contacted in normal use.

### `externally_connectable` (the same three host patterns)
> The Gone Phishin' web app, after the user signs in, sends a one-time
> pairing token to the extension via `chrome.runtime.sendMessage(extension
> ID, ...)`. This is how the activate page authorizes the user's browser
> without ever exposing the token to the page's URL or DOM.

---

## Remote code

Answer: **No, the extension does not load remote code.** All scripts and
modules are bundled into the package. The only network traffic is to the
Gone Phishin' API and (transitively, server-side only) to Google Safe
Browsing.

---

## Distribution

- Visibility: Public
- Regions: All available regions
- Pricing: Free
- In-app purchases: None

---

## Required URLs

- Privacy policy URL: `https://gonephishin.tech/privacy` (live)
- Homepage URL: `https://gonephishin.tech`
- Support URL: `https://gonephishin.tech/support` (live)

Note: the Support URL field requires an `https://` URL — the Web Store
form rejects `mailto:` addresses outright (learned this the hard way on
the first submission attempt).

---

## Required image assets

The Web Store dashboard requires these. The extension's PNG icons are
already shipped inside the zip; the **store listing assets** below are
separate uploads that go into the Web Store form, not the extension.

| Asset                | Size                  | Where it shows up                    |
| -------------------- | --------------------- | ------------------------------------ |
| Store icon           | 128×128 PNG           | Search results, listing page         |
| Small promo tile     | 440×280 PNG or JPEG   | "Featured" carousel, search          |
| Marquee promo tile   | 1400×560 PNG or JPEG  | Front page (only if Google features) |
| Screenshots          | 1280×800 or 640×400   | Listing — at least one required, up to five     |

A starter set of screenshots — already templated — is in
`docs/store/screenshots/`. They are full-page mockups built on the same
dark Glowing-Sky theme as the marketing site, so the listing matches the
rest of the brand.
