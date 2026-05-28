"use client";

import { EllipsisIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type CoursesViewsRowMenuProps = {
  courseCode: string;
  onDelete: () => void;
};

export function CoursesViewsRowMenu({
  courseCode,
  onDelete,
}: CoursesViewsRowMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen((o) => !o);
    setConfirming(false);
  }

  return (
    <div ref={ref} className="m-pos-rel">
      <button
        className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
        onClick={toggle}
        aria-label="Actions"
      >
        <EllipsisIcon size={14} />
      </button>

      {open && (
        <div className="m-card-menu" onMouseDown={(e) => e.stopPropagation()}>
          {confirming ? (
            <div className="m-card-menu__confirm">
              <span className="m-card-menu__confirm-label">
                Remove this course?
              </span>
              <div className="m-card-menu__confirm-actions">
                <button
                  className="m-btn m-btn--ghost m-btn--sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirming(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="m-btn m-btn--ghost m-btn--sm m-btn--danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setOpen(false);
                    setConfirming(false);
                  }}
                >
                  <Trash2Icon size={12} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                className="m-card-menu__item"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/courses/${courseCode}`);
                }}
              >
                <EyeIcon size={13} className="m-card-menu__icon" /> View course
              </button>
              <div className="m-card-menu__sep" />
              <button
                className="m-card-menu__item m-card-menu__item--danger"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirming(true);
                }}
              >
                <Trash2Icon size={13} className="m-card-menu__icon" /> Delete
                course
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
