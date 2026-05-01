# Gone Phishin' — Privacy Policy

_Last updated: 2026-04-29_

Gone Phishin' is a free Chrome extension that warns you about phishing or
malware links inside webmail (Gmail and Outlook). This policy describes the
small amount of data the extension and its companion website handle, why we
need it, and how long we keep it.

## What Gone Phishin' is

There are two parts:

- The Chrome extension that runs in your browser when you open Gmail or
  Outlook. It scans the URLs of the links displayed in your inbox.
- The Gone Phishin' web app at https://gonephishin.com (and its preview
  domains on `vercel.app`) where caregivers can sign in to set the extension
  up for a family member, view a log of blocked threats, and revoke access.

You only need the web app if you want to set the extension up for someone
else (for example, an adult child setting it up for a parent). If you are
using the extension for yourself, you can either use the "Sign in for
myself" option from the popup or skip sign-in entirely — the extension still
warns you about dangerous links either way.

## What we collect

We collect the smallest amount of data we can.

### From inside your browser

The extension reads the URLs of the links displayed on the Gmail / Outlook
pages you have open. For each link we have not already classified, the URL
is sent to the Gone Phishin' API, which forwards the URL to Google's
[Safe Browsing Lookup API](https://developers.google.com/safe-browsing/v4/lookup-api).
The API returns a verdict (safe, sketchy, or dangerous), which is cached
locally in your browser.

We do **not** read or upload the contents of your emails. We do not see
attachments, subject lines, sender addresses, recipient lists, message
bodies, or any other email metadata. The only thing we look at is the
clickable URLs the page renders in front of you — the same URLs your browser
already shows in the link preview at the bottom-left corner of the window.

The extension does **not** store browsing history.

### From the web app (caregivers and self-managed users)

If you sign into the web app, we store:

- An identifier from our authentication provider (Clerk) that links your
  sign-in to your account, plus the email address you signed in with.
- The "circles" you create. A circle is a label for a person whose browser
  is paired with the extension (for example, "Mom's laptop"). Each circle
  stores the label, whether it's self-managed or caregiver-paired, and a
  database identifier.
- A log of "danger events" — when the extension warns about a suspicious or
  dangerous link, it records the **domain** of that link (not the full URL),
  the kind of threat (e.g., `dangerous`, `sketchy`, `heuristic_typosquat`),
  and what the user did (`shown`, `dismissed`, `ignored_warning`). This log
  is what shows up in the dashboard's "Recent activity" view.
- For caregiver pairing: a short-lived 6-digit pairing code (5-minute TTL)
  and a long-lived bearer token that authorizes the paired browser to log
  events to your dashboard. Tokens can be revoked from the Settings page.

We do **not** store the full URLs of the links the extension scans on our
servers. The threat log keeps the domain only.

## What we do not collect

- Email contents, subjects, attachments, sender or recipient information.
- Browsing history or pages you visit outside of Gmail / Outlook.
- Keystrokes, form data, passwords, or anything you type into a webpage.
- Cookies set by other sites.
- Device identifiers, advertising identifiers, or fingerprinting signals.
- Geolocation, microphone, camera, or any other sensor data.
- Personal information beyond the email address you sign in with.

## How we use it

The data above is used **only** to:

1. Detect whether a link in your inbox is known to be phishing or malware.
2. Show the threat history on your dashboard so you can see what's been
   blocked for you (or for the family member you set up).
3. Authenticate you to the web app and the paired browser.

We do not sell, rent, share, or trade your data. We do not use your data to
train AI models. We do not show advertising.

## Third parties

The extension and web app rely on these third parties to operate. They each
have their own privacy practices — links below.

- **Google Safe Browsing** — receives the URLs we scan to return a verdict.
  Google's privacy policy: https://policies.google.com/privacy
- **Clerk** — handles sign-in for the web app. Clerk's privacy policy:
  https://clerk.com/legal/privacy
- **Neon (Postgres) and Vercel** — hosts the database and the web app
  itself. Vercel's privacy policy: https://vercel.com/legal/privacy-policy
  · Neon's: https://neon.tech/privacy-policy

## Retention

- Cached link verdicts in your browser: held for up to 24 hours, then
  refreshed.
- Threat-log rows in the dashboard: kept indefinitely for the circles you
  own. Deleting a circle from Settings removes its log permanently.
- Pairing codes: expire after 5 minutes.
- Extension tokens: kept until you revoke them from Settings.
- Account record: kept until you ask us to delete it (see "Your choices"
  below). Deleting your account removes all of your circles, threat logs,
  and tokens.

## Your choices

- You can use the extension entirely without signing in. It will still warn
  you about dangerous links; it just won't keep a history.
- You can revoke a paired browser at any time from the web app's Settings
  page. The extension on that browser will stop sending events.
- You can delete a circle at any time from the Settings page; this removes
  its threat-log history.
- To delete your account and all associated data, email us at
  privacy@gonephishin.com.

## Children

Gone Phishin' is not directed at children under 13. We do not knowingly
collect data from children under 13. If you believe a child has provided us
with personal information, contact us and we will delete it.

## Security

Data is transmitted over HTTPS. The database is encrypted at rest by our
hosting provider. Pairing codes and tokens are random, single-use (codes) or
revocable (tokens). We do not have access to your email account itself —
the extension only reads the links rendered on the page you are viewing.

## Changes

If we change this policy, we will update the "Last updated" date and post
the new version at the same URL the extension links to. For material
changes, we will note the change in the extension popup.

## Contact

Questions, concerns, or data-deletion requests:

- Email: privacy@gonephishin.com
- Web: https://gonephishin.com
