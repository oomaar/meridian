import { AVATAR_COLORS } from "../data/AVATAR_COLORS";
import { strHash } from "../helpers/strHash";

export function InstructorsTableAvatar({ name }: { name: string }) {
  const initials = name
    .replace(/^(Prof\.|Dr\.|Mr\.) /, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const color = AVATAR_COLORS[strHash(name) % AVATAR_COLORS.length];

  return (
    <div className="m-avatar" style={{ background: color }}>
      {initials}
    </div>
  );
}
