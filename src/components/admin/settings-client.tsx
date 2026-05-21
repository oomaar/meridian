"use client";

import { useState, useEffect } from "react";
import {
  CheckIcon, Loader2Icon, UploadIcon, ShieldCheckIcon,
  MonitorIcon, SunIcon, MoonIcon, LogOutIcon, KeyRoundIcon,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

type TabId = "profile" | "appearance" | "security" | "notifications" | "integrations";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile",       label: "Profile"       },
  { id: "appearance",    label: "Appearance"     },
  { id: "security",      label: "Security"       },
  { id: "notifications", label: "Notifications"  },
  { id: "integrations",  label: "Integrations"   },
];

const ONE_YEAR = 60 * 60 * 24 * 365;

// ─── Shared sub-components ────────────────────────────────────────────────────

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="m-info-row">
      <span className="m-info-row__label">{label}</span>
      <span className={`m-info-row__value${mono ? " m-mono" : ""}`}>{value}</span>
    </div>
  );
}

function CardSection({
  title,
  action,
  children,
  bodyClass,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  bodyClass?: string;
}) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="m-card__title">{title}</div>
        {action}
      </div>
      <div className={`m-card__body${bodyClass ? ` ${bodyClass}` : ""}`}>{children}</div>
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [displayName, setDisplayName] = useState("Ines Halvorsen");
  const [preferredName, setPreferredName] = useState("Ines");
  const [phone, setPhone] = useState("+1 (415) 555-0143");
  const [office, setOffice] = useState("Tucker Hall · 218");
  const [pronouns, setPronouns] = useState("she/her");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  function handleSave() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 1100);
  }

  return (
    <div className="m-grid m-grid-2-1">
      <div className="m-stack">
        <CardSection
          title="Personal details"
          action={
            <button
              className="m-btn m-btn--primary m-btn--sm"
              onClick={handleSave}
              disabled={saveState === "saving"}
            >
              {saveState === "idle"   && "Save changes"}
              {saveState === "saving" && <><Loader2Icon size={12} className="m-spin" /> Saving…</>}
              {saveState === "saved"  && <><CheckIcon size={12} /> Saved</>}
            </button>
          }
        >
          <div className="m-grid m-grid-2" style={{ gap: 14 }}>
            <label className="m-field">
              <span className="m-field__label">Display name</span>
              <input className="m-field__input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </label>
            <label className="m-field">
              <span className="m-field__label">Preferred name</span>
              <input className="m-field__input" value={preferredName} onChange={(e) => setPreferredName(e.target.value)} />
            </label>
            <label className="m-field">
              <span className="m-field__label">Email</span>
              <input className="m-field__input m-mono" value="i.halvorsen@aldridge.edu" disabled style={{ fontSize: 12, color: "var(--m-text-3)" }} />
            </label>
            <label className="m-field">
              <span className="m-field__label">Phone</span>
              <input className="m-field__input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </label>
            <label className="m-field">
              <span className="m-field__label">Office</span>
              <input className="m-field__input" value={office} onChange={(e) => setOffice(e.target.value)} />
            </label>
            <label className="m-field">
              <span className="m-field__label">Pronouns</span>
              <input className="m-field__input" value={pronouns} onChange={(e) => setPronouns(e.target.value)} />
            </label>
          </div>
        </CardSection>

        <CardSection title="Affiliations">
          <InfoRow label="Institution"  value="Aldridge University"              />
          <InfoRow label="Department"   value="Office of the Registrar"          />
          <InfoRow label="Title"        value="Registrar"                        />
          <InfoRow label="Manager"      value="Prof. Hyun-woo Kim · Provost"     />
          <InfoRow label="Joined"       value="February 14, 2019"        mono    />
          <InfoRow label="Employee ID"  value="AU-EMP-21038"             mono    />
        </CardSection>
      </div>

      <div className="m-stack">
        <CardSection title="Avatar">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "6px 0" }}>
            <div className="m-settings-avatar">IH</div>
            <button className="m-btn">
              <UploadIcon size={13} /> Upload image
            </button>
            <span style={{ fontSize: 11.5, color: "var(--m-text-3)", textAlign: "center" }}>
              PNG or JPG, max 2 MB. Square recommended.
            </span>
          </div>
        </CardSection>

        <CardSection title="Quick facts">
          <InfoRow label="Last login" value="12 minutes ago"           mono />
          <InfoRow label="Sessions"   value="3 active devices"         mono />
          <InfoRow label="MFA"        value="Enabled · Authenticator"  mono />
        </CardSection>
      </div>
    </div>
  );
}

// ─── Appearance tab ───────────────────────────────────────────────────────────

function AppearanceTab() {
  const [theme,   setThemeState]   = useState<"light" | "dark" | "system">("dark");
  const [density, setDensityState] = useState<"comfortable" | "compact">("comfortable");

  useEffect(() => {
    const current = document.documentElement.dataset.theme as "light" | "dark" | undefined;
    if (current) setThemeState(current);
    const d = document.documentElement.dataset.density as "comfortable" | "compact" | undefined;
    if (d) setDensityState(d);
  }, []);

  function applyTheme(t: "light" | "dark" | "system") {
    setThemeState(t);
    const effective = t === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : t;
    document.documentElement.dataset.theme = effective;
    document.cookie = `meridian_theme=${effective}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }

  function applyDensity(d: "comfortable" | "compact") {
    setDensityState(d);
    document.documentElement.dataset.density = d;
    document.cookie = `meridian_density=${d}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
  }

  return (
    <div className="m-grid m-grid-2">
      <CardSection title="Theme">
        <p style={{ color: "var(--m-text-3)", fontSize: 13, marginBottom: 16 }}>
          Choose your default appearance. You can also switch from the topbar at any time.
        </p>
        <div className="m-theme-picker">
          {(["light", "dark", "system"] as const).map((m) => (
            <button
              key={m}
              className={`m-theme-option${theme === m ? " m-theme-option--active" : ""}`}
              onClick={() => applyTheme(m)}
            >
              <div className="m-theme-option__preview" data-mode={m}>
                {m === "system" && (
                  <>
                    <div className="m-theme-option__half m-theme-option__half--light" />
                    <div className="m-theme-option__half m-theme-option__half--dark" />
                  </>
                )}
              </div>
              <div className="m-theme-option__footer">
                {m === "light" && <SunIcon size={12} />}
                {m === "dark"  && <MoonIcon size={12} />}
                {m === "system" && <MonitorIcon size={12} />}
                <span style={{ textTransform: "capitalize" }}>{m}</span>
                {theme === m && <CheckIcon size={11} style={{ marginLeft: "auto", color: "var(--m-accent)" }} />}
              </div>
            </button>
          ))}
        </div>
      </CardSection>

      <CardSection title="Density">
        <p style={{ color: "var(--m-text-3)", fontSize: 13, marginBottom: 16 }}>
          Comfortable for daily use; compact when reviewing dense rosters.
        </p>
        <div className="m-density-picker">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              className={`m-density-option${density === d ? " m-density-option--active" : ""}`}
              onClick={() => applyDensity(d)}
            >
              <div className="m-density-option__bars">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="m-density-option__bar"
                    style={{ marginBottom: d === "compact" ? 3 : 7 }}
                  />
                ))}
              </div>
              <div className="m-density-option__label">
                <span style={{ textTransform: "capitalize" }}>{d}</span>
                {density === d && <CheckIcon size={11} style={{ color: "var(--m-accent)" }} />}
              </div>
            </button>
          ))}
        </div>
      </CardSection>
    </div>
  );
}

// ─── Security tab ─────────────────────────────────────────────────────────────

const SESSIONS_INIT = [
  { id: "s1", device: "MacBook Pro · macOS 14.6 · Safari 18", where: "Princeton, NJ · 8.227.x", when: "Active now", current: true },
  { id: "s2", device: "iPhone 15 · iOS 18.2 · Safari",        where: "Princeton, NJ · 10.0.x",  when: "4h ago",     current: false },
  { id: "s3", device: "Windows 11 · Chrome 132",               where: "Newark, NJ · 8.227.x",    when: "Yesterday",  current: false },
];

function SecurityTab() {
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
    if (pwState !== "idle" || !currentPw || !newPw || newPw !== confirmPw) return;
    setPwState("saving");
    setTimeout(() => {
      setPwState("saved");
      setTimeout(() => {
        setPwState("idle");
        setChangingPw(false);
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      }, 1800);
    }, 1200);
  }

  return (
    <div className="m-stack">
      <CardSection
        title="Password"
        action={
          !changingPw && (
            <button className="m-btn m-btn--sm" onClick={() => setChangingPw(true)}>
              <KeyRoundIcon size={13} /> Change
            </button>
          )
        }
      >
        {!changingPw ? (
          <>
            <InfoRow label="Last changed" value="42 days ago" mono />
            <InfoRow label="Strength"     value="Strong"           />
          </>
        ) : (
          <form onSubmit={handleChangePw} className="m-stack" style={{ gap: 12 }}>
            <label className="m-field">
              <span className="m-field__label">Current password</span>
              <input type="password" className="m-field__input" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required />
            </label>
            <label className="m-field">
              <span className="m-field__label">New password</span>
              <input type="password" className="m-field__input" value={newPw} onChange={(e) => setNewPw(e.target.value)} required />
            </label>
            <label className="m-field">
              <span className="m-field__label">Confirm new password</span>
              <input type="password" className="m-field__input" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
            </label>
            {newPw && confirmPw && newPw !== confirmPw && (
              <p style={{ fontSize: 12, color: "var(--m-danger)" }}>Passwords do not match.</p>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" className="m-btn m-btn--ghost m-btn--sm" onClick={() => setChangingPw(false)} disabled={pwState === "saving"}>
                Cancel
              </button>
              <button
                type="submit"
                className="m-btn m-btn--primary m-btn--sm"
                disabled={!currentPw || !newPw || newPw !== confirmPw || pwState !== "idle"}
              >
                {pwState === "idle"   && "Update password"}
                {pwState === "saving" && <><Loader2Icon size={12} className="m-spin" /> Updating…</>}
                {pwState === "saved"  && <><CheckIcon size={12} /> Updated!</>}
              </button>
            </div>
          </form>
        )}
      </CardSection>

      <CardSection
        title="Two-factor authentication"
        action={<span className="m-badge m-badge--success"><ShieldCheckIcon size={11} /> Enabled</span>}
      >
        <InfoRow label="Primary method"  value="Authenticator app (Aegis)"  />
        <InfoRow label="Backup method"   value="SMS · ••••0143"        mono  />
        <InfoRow label="Recovery codes"  value="8 of 10 unused"             />
      </CardSection>

      <CardSection title="Active sessions">
        <div className="m-stack" style={{ gap: 10 }}>
          {sessions.map((s) => (
            <div key={s.id} className="m-session-item">
              <div className="m-session-item__info">
                <div className="m-session-item__device">{s.device}</div>
                <div className="m-session-item__meta m-mono">{s.where} · {s.when}</div>
              </div>
              {s.current ? (
                <span className="m-badge m-badge--success">
                  <span className="m-badge__dot" /> This device
                </span>
              ) : (
                <button className="m-btn m-btn--ghost m-btn--sm m-btn--danger" onClick={() => revoke(s.id)}>
                  <LogOutIcon size={12} /> Revoke
                </button>
              )}
            </div>
          ))}
          {sessions.length === 1 && (
            <p style={{ fontSize: 12, color: "var(--m-text-3)", marginTop: 4 }}>No other active sessions.</p>
          )}
        </div>
      </CardSection>
    </div>
  );
}

// ─── Notifications tab ────────────────────────────────────────────────────────

const NOTIF_EVENTS = [
  "New petition routed to me",
  "Grading SLA breach in my courses",
  "Probation review trigger",
  "Roster sync completed",
  "Catalog publication events",
  "Faculty mentions in announcements",
];

type Channel = "email" | "inapp" | "push";

function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, Record<Channel, boolean>>>(() =>
    Object.fromEntries(
      NOTIF_EVENTS.map((ev, i) => [
        ev,
        { email: i % 2 === 0, inapp: true, push: i < 3 },
      ])
    )
  );
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  function toggle(ev: string, ch: Channel) {
    setPrefs((prev) => ({
      ...prev,
      [ev]: { ...prev[ev], [ch]: !prev[ev][ch] },
    }));
  }

  function handleSave() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 900);
  }

  return (
    <CardSection
      title="Channels & preferences"
      action={
        <button className="m-btn m-btn--primary m-btn--sm" onClick={handleSave} disabled={saveState === "saving"}>
          {saveState === "idle"   && "Save preferences"}
          {saveState === "saving" && <><Loader2Icon size={12} className="m-spin" /> Saving…</>}
          {saveState === "saved"  && <><CheckIcon size={12} /> Saved</>}
        </button>
      }
    >
      <table className="m-table" style={{ marginTop: 4 }}>
        <thead>
          <tr>
            <th>Event</th>
            <th style={{ textAlign: "center", width: 90 }}>Email</th>
            <th style={{ textAlign: "center", width: 90 }}>In-app</th>
            <th style={{ textAlign: "center", width: 90 }}>Mobile push</th>
          </tr>
        </thead>
        <tbody>
          {NOTIF_EVENTS.map((ev) => (
            <tr key={ev}>
              <td style={{ fontSize: 13 }}>{ev}</td>
              {(["email", "inapp", "push"] as Channel[]).map((ch) => (
                <td key={ch} style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    className="m-checkbox"
                    checked={prefs[ev][ch]}
                    onChange={() => toggle(ev, ch)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardSection>
  );
}

// ─── Integrations tab ─────────────────────────────────────────────────────────

const INTEGRATIONS = [
  { name: "Banner SIS",  letter: "B", who: "Roster sync · daily 02:00",       connected: true  },
  { name: "Canvas LMS",  letter: "C", who: "Grade passback · live",            connected: true  },
  { name: "Zoom",        letter: "Z", who: "Lecture capture · all halls",      connected: true  },
  { name: "Stripe",      letter: "S", who: "Tuition · 14,810 accounts",        connected: true  },
  { name: "Slack",       letter: "Sl", who: "Faculty announcements",            connected: false },
  { name: "Okta SSO",   letter: "O", who: "All accounts · SAML",              connected: true  },
];

function IntegrationsTab() {
  const [states, setStates] = useState(
    Object.fromEntries(INTEGRATIONS.map((i) => [i.name, i.connected]))
  );

  return (
    <div className="m-grid m-grid-3">
      {INTEGRATIONS.map((intg) => (
        <div key={intg.name} className="m-card m-integration-card">
          <div className="m-integration-card__head">
            <div className="m-integration-card__logo">{intg.letter}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{intg.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--m-text-3)" }}>{intg.who}</div>
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
              onClick={() => setStates((prev) => ({ ...prev, [intg.name]: !prev[intg.name] }))}
            >
              {states[intg.name] ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SettingsClient() {
  const [tab, setTab] = useState<TabId>("profile");

  return (
    <>
      <div className="m-page__header m-page__header--no-border">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Account</span>
          <h1 className="m-page__h">Settings</h1>
        </div>
      </div>

      <div className="m-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className="m-tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="m-page__body">
        {tab === "profile"       && <ProfileTab />}
        {tab === "appearance"    && <AppearanceTab />}
        {tab === "security"      && <SecurityTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "integrations"  && <IntegrationsTab />}
      </div>
    </>
  );
}
