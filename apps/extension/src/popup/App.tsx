import { ChooseModeScreen } from "./ChooseModeScreen.js";
import { StatusScreen } from "./StatusScreen.js";

export function App() {
  return (
    <>
      <StatusScreen />
      <hr
        style={{
          margin: "16px 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />
      <ChooseModeScreen />
    </>
  );
}
