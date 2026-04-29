import { useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  getSettings,
  setSettings,
  type ExtensionSettings,
  type Verbosity,
} from "../shared/settings.js";

export function SettingsScreen() {
  const [settings, setLocalSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void getSettings().then((s) => {
      setLocalSettings(s);
      setLoaded(true);
    });
  }, []);

  const update = async (partial: Partial<ExtensionSettings>) => {
    const next = await setSettings(partial);
    setLocalSettings(next);
  };

  if (!loaded) return <p>Loading…</p>;

  return (
    <>
      <h1>Settings</h1>

      <div className="setting-row">
        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => void update({ enabled: e.target.checked })}
          />
          <span>Protection enabled</span>
        </label>
        <p className="hint">
          Turn off to stop checking links. Page reload required.
        </p>
      </div>

      <div className="setting-row">
        <h2>How visible should the indicators be?</h2>
        {(["minimal", "standard", "verbose"] as const).map((v) => (
          <label key={v} className="radio">
            <input
              type="radio"
              name="verbosity"
              value={v}
              checked={settings.verbosity === v}
              onChange={() => void update({ verbosity: v as Verbosity })}
            />
            <span>
              <strong>{labelFor(v)}</strong>
              <br />
              <span className="hint inline">{descriptionFor(v)}</span>
            </span>
          </label>
        ))}
      </div>

      <p className="footer-note">
        Settings apply on the next page load.
      </p>
    </>
  );
}

function labelFor(v: Verbosity): string {
  switch (v) {
    case "minimal":
      return "Minimal — warn me only";
    case "standard":
      return "Standard (recommended)";
    case "verbose":
      return "Verbose — mark every link";
  }
}

function descriptionFor(v: Verbosity): string {
  switch (v) {
    case "minimal":
      return "Only suspicious or dangerous links get a colored mark. Hover any link for details.";
    case "standard":
      return "Suspicious, dangerous, and unverified links get marked. Hover safe links for details.";
    case "verbose":
      return "Every link gets a colored mark, including safe ones.";
  }
}
