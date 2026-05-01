# Submitting Gone Phishin' to the Chrome Web Store

Everything that can be prepared in advance is ready. The remaining steps
require your hands (Google's $5 dev fee and the upload form). Allow ~30
minutes for the form, then 1–3 business days for review.

## What's already built

| Asset                               | Location                                                       |
| ----------------------------------- | -------------------------------------------------------------- |
| Production extension zip (v0.1.0)   | `dist/gone-phishin-extension-v0.1.0.zip`                       |
| 1280×800 screenshots (5 of them)    | `docs/store/screenshots/0[1-5]-*.png`                          |
| 440×280 small promo tile            | `docs/store/screenshots/promo-small-440x280.png`               |
| 1400×560 marquee promo tile         | `docs/store/screenshots/promo-marquee-1400x560.png`            |
| Privacy policy (live URL)           | https://gonephishin-echos-projects-74cc5946.vercel.app/privacy |
| Privacy policy (markdown source)    | `docs/store/PRIVACY.md`                                        |
| Web Store form copy                 | `docs/store/LISTING.md`                                        |

## Step-by-step

### 1. Register as a Chrome Web Store developer

Go to https://chrome.google.com/webstore/devconsole and pay the **one-time
$5 USD fee**. Use the Google account you want associated with the listing
publicly — switching it later means re-publishing under a new account.

Set the developer display name to **Gone Phishin'** (or whatever you'd
like to appear on the listing — it's permanent for this account).

### 2. Verify your developer email

The Web Store will email you a verification link. Click it. You can't
publish anything until this clears.

### 3. Add a new item

In the Web Store dashboard, click **"+ Add new item"** and upload
`dist/gone-phishin-extension-v0.1.0.zip`.

If Google rejects the zip, the most common causes are:

- The manifest icons are missing → already fixed in v0.1.0.
- The zip contains a parent folder → fix by re-zipping with the contents
  at the root: `cd apps/extension/dist && zip -rq ../../../dist/gone-phishin-extension-v0.1.0.zip .`
- The version number conflicts → bump `version` in
  `apps/extension/manifest.config.ts`.

### 4. Fill out the listing form

Open `docs/store/LISTING.md`. Each section header in that file maps to a
field in the Web Store form. Paste the values verbatim.

Specifically:

- **Name** → from `## Name`
- **Short description** → from `## Short description`
- **Detailed description** → from `## Detailed description`
- **Category** → `Productivity` (and `Privacy & Security` if asked for a
  secondary)
- **Language** → English (United States)
- **Single purpose** → from `## Single purpose`

### 5. Upload images

In the Web Store form's **Graphic assets** section:

- Upload **all 5 screenshots** (`01-inbox-flagged.png` through
  `05-hover-tooltip.png`).
- Upload `promo-small-440x280.png` as the small promo tile.
- Upload `promo-marquee-1400x560.png` as the marquee tile.
- The 128×128 store icon comes from the manifest automatically — no
  separate upload needed.

### 6. Privacy practices section

This is where most rejections happen. Be precise.

- **Single purpose** → use the exact sentence from `LISTING.md`.
- **Permission justifications** → for each permission, paste the matching
  paragraph from `## Permission justifications` in `LISTING.md`.
- **Remote code** → No. Justify: "All scripts are bundled into the
  package. The only network calls are to our own API and (server-side
  only, never the client) Google Safe Browsing."
- **Data usage certification** → tick:
  - "I do not sell or transfer user data to third parties, except for the
    approved use cases."
  - "I do not use or transfer user data for purposes that are unrelated
    to my item's single purpose."
  - "I do not use or transfer user data to determine creditworthiness or
    for lending purposes."

### 7. Distribution

- **Visibility**: Public
- **Regions**: All available
- **Pricing**: Free
- **Privacy policy URL**: paste
  `https://gonephishin-echos-projects-74cc5946.vercel.app/privacy`. Once
  the custom domain is connected, swap to `https://gonephishin.com/privacy`
  (you can update this without re-submitting the bundle).

### 8. Submit for review

Click **Submit for Review** at the top of the dashboard. Reviews typically
clear in 1–3 business days for new items, sometimes same-day. If they
reject, the email will list the exact reason — usually a permission that
needs better justification.

## After it's approved

- Note the **extension ID** Google assigns. It will look like
  `abcdefghijklmnopabcdefghijklmnop` (32 lowercase letters).
- Add it to the Vercel project's `NEXT_PUBLIC_EXTENSION_ID` env var on
  Production (and Preview, if you want previews to work). Redeploy so the
  activate page can use it:
  ```
  vercel env add NEXT_PUBLIC_EXTENSION_ID production --value <id> --yes
  vercel env add NEXT_PUBLIC_EXTENSION_ID preview    --value <id> --yes
  vercel --prod --yes
  ```
- Update `apps/extension/manifest.config.ts`'s `externally_connectable.matches`
  list if your custom domain isn't already in there (it is — `gonephishin.com`).
- Pin a "Get the extension" link to the Web Store URL in the marketing
  page and the popup's "Install" button.

## Versioning

To ship a new version:

1. Bump `version` in `apps/extension/manifest.config.ts` (e.g. `0.1.0`
   → `0.1.1`).
2. From repo root: `pnpm --filter @gonephishin/extension build`.
3. Re-zip: `cd apps/extension/dist && zip -rq
   ../../../dist/gone-phishin-extension-v0.1.1.zip .`.
4. Upload the new zip to the Web Store dashboard's same listing — it
   stays the same item, just a new version.

Re-review usually clears faster than the initial review (~hours).
