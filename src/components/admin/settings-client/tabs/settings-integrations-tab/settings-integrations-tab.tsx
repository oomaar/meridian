import { useState } from "react";
import { INTEGRATIONS } from "./data/INTEGRATIONS";

export function SettingsIntegrationsTab() {
  const [states, setStates] = useState(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.name, i.connected])),
  );

  return (
    <div className="m-grid m-grid-3">
      {INTEGRATIONS.map((intg) => (
        <div key={intg.name} className="m-card m-integration-card">
          <div className="m-integration-card__head">
            <div className="m-integration-card__logo">{intg.letter}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[14px]">{intg.name}</div>
              <div className="text-[11.5px] text-m-text-3">{intg.who}</div>
            </div>
          </div>
          <div className="m-integration-card__foot">
            {states[intg.name] ? (
              <span className="m-badge m-badge--success">Connected</span>
            ) : (
              <span className="m-badge">Disconnected</span>
            )}
            <span className="m-spacer" />
            <button
              className="m-btn m-btn--ghost m-btn--sm"
              onClick={() =>
                setStates((prev) => ({
                  ...prev,
                  [intg.name]: !prev[intg.name],
                }))
              }
            >
              {states[intg.name] ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
