"use client";

import { useState } from "react";
import { CardSection } from "../../components/card-section";
import { LogOutIcon } from "lucide-react";
import { SESSIONS_INIT } from "./data/SESSIONS_INIT";

export function SettingsSecurityTabActiveSessions() {
  const [sessions, setSessions] = useState(SESSIONS_INIT);

  function revoke(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <CardSection title="Active sessions">
      <div className="m-stack gap-2.5">
        {sessions.map((s) => (
          <div key={s.id} className="m-session-item">
            <div className="m-session-item__info">
              <div className="m-session-item__device">{s.device}</div>
              <div className="m-session-item__meta m-mono">
                {s.where} · {s.when}
              </div>
            </div>
            {s.current ? (
              <span className="m-badge m-badge--success">
                <span className="m-badge__dot" /> This device
              </span>
            ) : (
              <button
                className="m-btn m-btn--ghost m-btn--sm m-btn--danger"
                onClick={() => revoke(s.id)}
              >
                <LogOutIcon size={12} /> Revoke
              </button>
            )}
          </div>
        ))}
        {sessions.length === 1 && (
          <p className="text-[12px] text-m-text-3 mt-1">
            No other active sessions.
          </p>
        )}
      </div>
    </CardSection>
  );
}
