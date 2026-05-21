import { useState } from "react";
import { TRIGGERS } from "./data/TRIGGERS";
import { NOTIFY_TARGETS } from "./data/NOTIFY_TARGETS";
import { CHANNELS } from "./data/CHANNELS";
import { XIcon, ZapIcon } from "lucide-react";

type NewRuleDrawerProps = {
  onClose: () => void;
  onSave: (label: string) => void;
};

export function NewRuleDrawer({ onClose, onSave }: NewRuleDrawerProps) {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState(TRIGGERS[0]);
  const [notify, setNotify] = useState(NOTIFY_TARGETS[0]);
  const [channel, setChannel] = useState(CHANNELS[2]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(`${name.trim()} — ${channel} · ${notify}`);
    onClose();
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div
        className="m-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="New notification rule"
      >
        <div className="m-sheet__head">
          <span className="m-sheet__title">New notification rule</span>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={onClose}
          >
            <XIcon size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="m-sheet__body">
          <label className="m-field">
            <span className="m-field__label">Rule name</span>
            <input
              className="m-field__input"
              placeholder="e.g. Alert Dean on SLA breach"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="m-field">
            <span className="m-field__label">Trigger event</span>
            <select
              className="m-field__input m-field__select"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            >
              {TRIGGERS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="m-field">
            <span className="m-field__label">Notify</span>
            <select
              className="m-field__input m-field__select"
              value={notify}
              onChange={(e) => setNotify(e.target.value)}
            >
              {NOTIFY_TARGETS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="m-field">
            <span className="m-field__label">Channel</span>
            <select
              className="m-field__input m-field__select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {CHANNELS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <p className="m-invite-note">
            This rule will fire whenever <b>{trigger.toLowerCase()}</b> is
            detected and will notify <b>{notify}</b> via{" "}
            <b>{channel.toLowerCase()}</b>. Rules can be paused or deleted at
            any time.
          </p>
        </form>
        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!name.trim()}
            onClick={handleSubmit}
          >
            <ZapIcon size={13} /> Save rule
          </button>
        </div>
      </div>
    </>
  );
}
