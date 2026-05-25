import { UploadIcon } from "lucide-react";
import { CardSection } from "../../components/card-section";

export function SettingsProfileTabAvatar() {
  return (
    <CardSection title="Avatar">
      <div className="flex flex-col items-center gap-4 py-0 px-1.5">
        <div className="m-settings-avatar">IH</div>
        <button className="m-btn">
          <UploadIcon size={13} /> Upload image
        </button>
        <span className="text-[11.5px] text-m-text-3 text-center">
          PNG or JPG, max 2 MB. Square recommended.
        </span>
      </div>
    </CardSection>
  );
}
