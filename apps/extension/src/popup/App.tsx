import { useState } from "react";
import { ChooseModeScreen } from "./ChooseModeScreen.js";
import { SettingsScreen } from "./SettingsScreen.js";
import { StatusScreen } from "./StatusScreen.js";

type Tab = "protection" | "settings";

export function App() {
  const [tab, setTab] = useState<Tab>("protection");

  return (
    <>
      <nav className="tabs">
        <button
          className={`tab ${tab === "protection" ? "active" : ""}`}
          onClick={() => setTab("protection")}
        >
          Protection
        </button>
        <button
          className={`tab ${tab === "settings" ? "active" : ""}`}
          onClick={() => setTab("settings")}
        >
          Settings
        </button>
      </nav>

      <div className="tab-body">
        {tab === "protection" ? (
          <>
            <StatusScreen />
            <hr className="divider" />
            <ChooseModeScreen />
          </>
        ) : (
          <SettingsScreen />
        )}
      </div>
    </>
  );
}
