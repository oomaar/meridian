import { BookIcon, CheckIcon, ClipboardListIcon, PlayIcon } from "lucide-react";

export const LESSON_ICONS: Record<string, React.ReactNode> = {
  video: <PlayIcon size={11} />,
  reading: <BookIcon size={11} />,
  quiz: <CheckIcon size={11} />,
  assignment: <ClipboardListIcon size={11} />,
};
