import { ExternalLink, X } from "lucide-react";
import { SHORTCUTS } from "./data/SHORTCUTS";
import { SUPPORT_LINKS } from "./data/SUPPORT_LINKS";

type HelpSheetProps = { onClose: () => void };

export function HelpSheet({ onClose }: HelpSheetProps) {
  return (
    <>
      <div className="m-sheet-overlay" onClick={onClose} />
      <div className="m-sheet">
        <div className="m-sheet__head">
          <span className="m-sheet__title">Help & Information</span>
          <button className="m-btn m-btn--ghost m-btn--icon" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        <div className="m-sheet__body">
          {/* About */}
          <div className="m-help-section">
            <div className="m-help-section__label">About</div>
            <div className="m-help-about">
              <div className="m-help-about__mark">M</div>
              <div>
                <div className="m-help-about__name">Meridian</div>
                <div className="m-help-about__meta m-mono">
                  v4.2 · Spring 2026 · Enterprise
                </div>
              </div>
            </div>
            <div className="m-help-about__tenant">
              Aldridge University · operations instance
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div className="m-help-section">
            <div className="m-help-section__label">Keyboard shortcuts</div>
            <div className="m-help-shortcuts">
              {SHORTCUTS.map((s) => (
                <div key={s.label} className="m-help-shortcut">
                  <span className="m-help-shortcut__label">{s.label}</span>
                  <span className="m-help-shortcut__keys">
                    {s.keys.map((k) => (
                      <kbd key={k}>{k}</kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="m-help-section">
            <div className="m-help-section__label">Support</div>
            <div className="m-help-links">
              {SUPPORT_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <a key={l.label} href={l.href} className="m-help-link">
                    <Icon size={14} className="m-help-link__icon" />
                    <span>{l.label}</span>
                    <ExternalLink size={11} className="m-help-link__ext" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="m-sheet__foot">
          <span className="text-[11.5px] text-m-text-3 m-mono">
            © 2026 Aldridge University · Meridian LMS
          </span>
        </div>
      </div>
    </>
  );
}
