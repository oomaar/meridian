"use client";

import type { StudentCourseDetailData } from "@/fake-db/dashboards";
import { BookOpenIcon } from "lucide-react";
import { SyllabusSheetBody } from "./syllabus-sheet-body";
import { useState } from "react";

type SyllabusSheetProps = {
  course: StudentCourseDetailData["course"];
  syllabus: StudentCourseDetailData["syllabus"];
};

export function SyllabusSheet({ course, syllabus }: SyllabusSheetProps) {
  const [syllabusOpen, setSyllabusOpen] = useState(false);

  return (
    <>
      <button className="m-btn" onClick={() => setSyllabusOpen(true)}>
        <BookOpenIcon size={14} /> Syllabus
      </button>
      {syllabusOpen && (
        <SyllabusSheetBody
          course={course}
          syllabus={syllabus}
          onClose={() => setSyllabusOpen(false)}
        />
      )}
    </>
  );
}
