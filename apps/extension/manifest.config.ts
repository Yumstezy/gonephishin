import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Gone Phishin'",
  version: "0.1.0",
  description:
    "Warns you about phishing links in Gmail and Outlook before you click them.",
  action: {
    default_popup: "src/popup/index.html",
    default_title: "Gone Phishin'",
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
    "https://gonephishin.com/*",
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
      all_frames: false,
    },
  ],
  externally_connectable: {
    matches: [
      "https://gonephishin.com/*",
      "https://*.vercel.app/*",
      "http://localhost:3000/*",
    ],
  },
});
