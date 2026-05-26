import { FormEvent, useState } from "react";
import { XIcon, ZapIcon } from "lucide-react";
import { TRIGGERS } from "./data/TRIGGERS";
import { NOTIFY_TARGETS } from "./data/NOTIFY_TARGETS";
import { CHANNELS } from "./data/CHANNELS";

type Form = {
  name: string;
  trigger: string;
  notify: string;
  channel: string;
};

const initialForm: Form = {
  name: "",
  trigger: TRIGGERS[0],
  notify: NOTIFY_TARGETS[0],
  channel: CHANNELS[2],
};

type NewRuleDrawerProps = {
  onClose: () => void;
  onSave: (label: string) => void;
};

export function NewRuleDrawer({ onClose, onSave }: NewRuleDrawerProps) {
  const [form, setForm] = useState<Form>(initialForm);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(`${form.name.trim()} — ${form.channel} · ${form.notify}`);
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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label className="m-field">
            <span className="m-field__label">Trigger event</span>
            <select
              className="m-field__input m-field__select"
              value={form.trigger}
              onChange={(e) => setForm({ ...form, trigger: e.target.value })}
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
              value={form.notify}
              onChange={(e) => setForm({ ...form, notify: e.target.value })}
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
              value={form.channel}
              onChange={(e) => setForm({ ...form, channel: e.target.value })}
            >
              {CHANNELS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <p className="m-invite-note">
            This rule will fire whenever <b>{form.trigger.toLowerCase()}</b> is
            detected and will notify <b>{form.notify}</b> via{" "}
            <b>{form.channel.toLowerCase()}</b>. Rules can be paused or deleted
            at any time.
          </p>
        </form>
        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="m-btn m-btn--primary"
            disabled={!form.name.trim()}
            onClick={handleSubmit}
          >
            <ZapIcon size={13} /> Save rule
          </button>
        </div>
      </div>
    </>
  );
}
