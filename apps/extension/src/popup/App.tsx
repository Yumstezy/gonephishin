import { useEffect, useState } from "react";
import { ChooseModeScreen } from "./ChooseModeScreen.js";
import { CodePairingScreen } from "./CodePairingScreen.js";
import { DirectSignInScreen } from "./DirectSignInScreen.js";
import { SettingsScreen } from "./SettingsScreen.js";
import { StatusScreen } from "./StatusScreen.js";
import { getPairedState, type PairedState } from "../shared/paired-state.js";

type Tab = "protection" | "settings";
type ProtectionView = "status" | "choose" | "code" | "direct";

export function App() {
  const [tab, setTab] = useState<Tab>("protection");
  const [view, setView] = useState<ProtectionView>("status");
  const [paired, setPaired] = useState<PairedState | null>(null);

  useEffect(() => {
    void getPairedState().then(setPaired);
  }, [view]);

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
            {view === "status" && (
              <>
                <StatusScreen paired={paired} />
                <hr className="divider" />
                {!paired && (
                  <button
                    className="button"
                    onClick={() => setView("choose")}
                  >
                    Pair this browser
                  </button>
                )}
              </>
            )}
            {view === "choose" && (
              <ChooseModeScreen
                onPickCode={() => setView("code")}
                onPickDirect={() => setView("direct")}
              />
            )}
            {view === "code" && (
              <CodePairingScreen
                onDone={() => setView("status")}
                onBack={() => setView("choose")}
              />
            )}
            {view === "direct" && (
              <DirectSignInScreen
                onDone={() => setView("status")}
                onBack={() => setView("choose")}
              />
            )}
          </>
        ) : (
          <SettingsScreen />
        )}
      </div>
    </>
  );
}
