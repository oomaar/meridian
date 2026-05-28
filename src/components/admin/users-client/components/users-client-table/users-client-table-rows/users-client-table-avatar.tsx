import { AVATAR_COLORS } from "../data/AVATAR_COLORS";

type UsersClientTableAvatarProps = {
  name: string;
  size?: "sm" | "md";
};

export function UsersClientTableAvatar({
  name,
  size = "md",
}: UsersClientTableAvatarProps) {
  const parts = name.split(" ").filter(Boolean);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (parts[0]?.[0] ?? "?").toUpperCase();
  let h = 0;

  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;

  const bg = AVATAR_COLORS[h % AVATAR_COLORS.length];

  return (
    <span className={`m-avatar m-avatar--${size}`} style={{ background: bg }}>
      {initials}
    </span>
  );
}
