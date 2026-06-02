import { ApperanceTabDensity } from "./components/apperance-tab-density";
import { ApperanceTabTheme } from "./components/apperance-tab-theme";

export const ONE_YEAR = 60 * 60 * 24 * 365;

export function AppearanceTab() {
  return (
    <div className="m-settings-grid m-settings-grid--2">
      <ApperanceTabTheme />
      <ApperanceTabDensity />
    </div>
  );
}
