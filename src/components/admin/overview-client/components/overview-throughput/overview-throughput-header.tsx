import { EllipsisIcon } from "lucide-react";
import { WIN_LABEL } from "../../data/WIN_LABEL";
import type { TpWindow } from "../../types/TpWindow";
import { CARD_MENU_ITEMS } from "../../data/CARD_MENU_ITEMS";
import { Dispatch, RefObject, SetStateAction } from "react";

type OverviewThroughputHeaderProps = {
  win: TpWindow;
  setWin: Dispatch<SetStateAction<TpWindow>>;
  menuRef: RefObject<HTMLDivElement | null>;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export function OverviewThroughputHeader({
  win,
  setWin,
  menuRef,
  menuOpen,
  setMenuOpen,
}: OverviewThroughputHeaderProps) {
  return (
    <div className="m-card__head">
      <h3 className="m-card__title">Submission throughput</h3>
      <span className="m-card__sub">{WIN_LABEL[win]} · all departments</span>
      <div className="m-row" style={{ gap: 6 }}>
        <div className="m-seg">
          {(["7d", "12w", "term"] as TpWindow[]).map((w) => (
            <button key={w} aria-pressed={win === w} onClick={() => setWin(w)}>
              {w === "term" ? "Term" : w}
            </button>
          ))}
        </div>
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="More options"
          >
            <EllipsisIcon size={14} />
          </button>
          {menuOpen && (
            <div className="m-card-menu">
              {CARD_MENU_ITEMS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="m-card-menu__item"
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon size={13} className="m-card-menu__icon" />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
