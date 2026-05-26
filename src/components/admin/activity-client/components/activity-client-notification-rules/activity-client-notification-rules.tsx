"use client";

import { PlusIcon, ZapIcon } from "lucide-react";
import { useState } from "react";
import { INIT_RULES } from "./data/INIT_RULES";
import { NewRuleDrawer } from "./new-rule-drawer";

export function ActivityClientNotificationRules() {
  const [rules, setRules] = useState<string[]>(INIT_RULES);
  const [ruleDrawer, setRuleDrawer] = useState(false);

  return (
    <>
      <div className="m-card">
        <div className="m-card__head">
          <div>
            <div className="m-card__title">Notification rules</div>
            <div className="m-card__sub">{rules.length} active</div>
          </div>
        </div>
        <div className="m-card__body">
          <div className="m-stack" style={{ gap: 10 }}>
            {rules.map((rule, i) => (
              <div key={i} className="m-rule-item">
                <ZapIcon size={14} className="m-rule-item__icon" />
                <span className="m-rule-item__label">{rule}</span>
                <span className="m-badge m-badge--success">On</span>
              </div>
            ))}
            <button className="m-btn" onClick={() => setRuleDrawer(true)}>
              <PlusIcon size={14} /> New rule
            </button>
          </div>
        </div>
      </div>
      {ruleDrawer && (
        <NewRuleDrawer
          onClose={() => setRuleDrawer(false)}
          onSave={(label) => {
            setRules((prev) => [...prev, label]);
            setRuleDrawer(false);
          }}
        />
      )}
    </>
  );
}
