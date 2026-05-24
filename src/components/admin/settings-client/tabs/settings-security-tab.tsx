import { useState } from "react";
import { SESSIONS_INIT } from "./data/SESSIONS_INIT";
import { CardSection } from "../components/card-section";
import {
  CheckIcon,
  KeyRoundIcon,
  Loader2Icon,
  LogOutIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { InfoRow } from "../components/info-row";

export function SettingsSecurityTab() {
  const [sessions, setSessions] = useState(SESSIONS_INIT);
  const [changingPw, setChangingPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwState, setPwState] = useState<"idle" | "saving" | "saved">("idle");

  function revoke(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function handleChangePw(e: React.FormEvent) {
    e.preventDefault();
    if (pwState !== "idle" || !currentPw || !newPw || newPw !== confirmPw)
      return;
    setPwState("saving");
    setTimeout(() => {
      setPwState("saved");
      setTimeout(() => {
        setPwState("idle");
        setChangingPw(false);
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      }, 1800);
    }, 1200);
  }

  return (
    <div className="m-stack">
      <CardSection
        title="Password"
        action={
          !changingPw && (
            <button
              className="m-btn m-btn--sm"
              onClick={() => setChangingPw(true)}
            >
              <KeyRoundIcon size={13} /> Change
            </button>
          )
        }
      >
        {!changingPw ? (
          <>
            <InfoRow label="Last changed" value="42 days ago" mono />
            <InfoRow label="Strength" value="Strong" />
          </>
        ) : (
          <form onSubmit={handleChangePw} className="m-stack gap-3">
            <label className="m-field">
              <span className="m-field__label">Current password</span>
              <input
                type="password"
                className="m-field__input"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">New password</span>
              <input
                type="password"
                className="m-field__input"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
              />
            </label>
            <label className="m-field">
              <span className="m-field__label">Confirm new password</span>
              <input
                type="password"
                className="m-field__input"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
            </label>
            {newPw && confirmPw && newPw !== confirmPw && (
              <p className="text-[12px] text-m-danger">
                Passwords do not match.
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="m-btn m-btn--ghost m-btn--sm"
                onClick={() => setChangingPw(false)}
                disabled={pwState === "saving"}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="m-btn m-btn--primary m-btn--sm"
                disabled={
                  !currentPw ||
                  !newPw ||
                  newPw !== confirmPw ||
                  pwState !== "idle"
                }
              >
                {pwState === "idle" && "Update password"}
                {pwState === "saving" && (
                  <>
                    <Loader2Icon size={12} className="m-spin" /> Updating…
                  </>
                )}
                {pwState === "saved" && (
                  <>
                    <CheckIcon size={12} /> Updated!
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </CardSection>

      <CardSection
        title="Two-factor authentication"
        action={
          <span className="m-badge m-badge--success">
            <ShieldCheckIcon size={11} /> Enabled
          </span>
        }
      >
        <InfoRow label="Primary method" value="Authenticator app (Aegis)" />
        <InfoRow label="Backup method" value="SMS · ••••0143" mono />
        <InfoRow label="Recovery codes" value="8 of 10 unused" />
      </CardSection>

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
    </div>
  );
}
