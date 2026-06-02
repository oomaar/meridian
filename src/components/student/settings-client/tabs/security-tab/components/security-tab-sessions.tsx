"use client";

import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import { SESSIONS_INIT } from "../data/SESSIONS_INIT";

export function SecurityTabSessions() {
  const [sessions, setSessions] = useState(SESSIONS_INIT);

  function revoke(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">Active sessions</div>
      </div>
      <div className="m-card__body">
        <div className="m-stack gap-2.5">
          {sessions.map((s) => (
            <div key={s.id} className="m-session-item">
              <div className="m-session-info">
                <div className="m-session-device">{s.device}</div>
                <div className="m-session-meta m-mono">
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
            <p className="m-sessions-empty">No other active sessions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
