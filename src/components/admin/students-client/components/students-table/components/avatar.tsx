import { AVATAR_COLORS } from "../data/AVATAR_COLORS";
import { strHash } from "../helpers/strHash";

type AvatarProps = { name: string };

export function Avatar({ name }: AvatarProps) {
  const ini = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const color = AVATAR_COLORS[strHash(name) % AVATAR_COLORS.length];

  return (
    <div className="m-avatar" style={{ background: color }}>
      {ini}
    </div>
  );
}
