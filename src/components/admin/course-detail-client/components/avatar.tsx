import { avatarBg } from "../helpers/avatarBg";
import { initials } from "../helpers/initials";

type AvatarProps = {
  name: string;
  size?: "sm" | "md";
};

export function Avatar({ name, size = "sm" }: AvatarProps) {
  return (
    <span
      className={`m-avatar m-avatar--${size === "md" ? "32" : "26"}`}
      style={{ background: avatarBg(name) }}
    >
      {initials(name)}
    </span>
  );
}
