import { SettingsAppearanceTabDensity } from "./settings-appearance-tab-density";
import { SettingsAppearanceTabTheme } from "./settings-appearance-tab-theme";

export function SettingsAppearanceTab() {
  return (
    <div className="m-grid m-grid-2">
      <SettingsAppearanceTabTheme />
      <SettingsAppearanceTabDensity />
    </div>
  );
}
