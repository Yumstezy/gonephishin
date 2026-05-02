import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Gone Phishin'",
  version: "0.1.1",
  description:
    "Warns you about phishing links in Gmail and Outlook before you click them.",
  action: {
    default_popup: "src/popup/index.html",
    default_title: "Gone Phishin'",
    default_icon: {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png",
    },
  },
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  permissions: ["storage", "alarms"],
  host_permissions: [
    "https://mail.google.com/*",
    "https://outlook.live.com/*",
    "https://outlook.office.com/*",
    "https://outlook.office365.com/*",
    "http://localhost:3000/*",
    "https://*.vercel.app/*",
    "https://gonephishin.tech/*",
  ],
  content_scripts: [
    {
      matches: [
        "https://mail.google.com/*",
        "https://outlook.live.com/*",
        "https://outlook.office.com/*",
        "https://outlook.office365.com/*",
      ],
      js: ["src/content/index.ts"],
      css: ["src/content/content.css"],
      run_at: "document_idle",
      all_frames: true,
    },
  ],
  externally_connectable: {
    matches: [
      "https://gonephishin.tech/*",
      "https://*.vercel.app/*",
      "http://localhost:3000/*",
    ],
  },
});
