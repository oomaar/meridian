"use client";

import { useState } from "react";
import { MegaphoneIcon } from "lucide-react";
import { PostAnnouncementSheetDrawer } from "./post-announcement-sheet-drawer";

export function PostAnnouncementSheet() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setOpen(true)}>
        <MegaphoneIcon size={14} /> Post announcement
      </button>

      {open && <PostAnnouncementSheetDrawer setOpen={setOpen} />}
    </>
  );
}
