import {
  BookOpenIcon,
  InboxIcon,
  MapPinIcon,
  PenIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminCourseDTO, AdminInstructorDTO } from "@/fake-db/dashboards";
import { EditCourseSheet } from "./sheets/edit-course-sheet";
import { ComposeSheet } from "./sheets/compose-sheet";

type CourseDetailClientHeaderProps = {
  course: AdminCourseDTO;
  instructor: AdminInstructorDTO;
};

export function CourseDetailClientHeader({
  course,
  instructor,
}: CourseDetailClientHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [msgClassOpen, setMsgClassOpen] = useState(false);

  return (
    <>
      <div className="m-page__header m-page__header--flush">
        <div className="m-page__title">
          <span className="m-page__eyebrow">
            <Link href="/admin/courses" className="m-text-3">
              Courses
            </Link>
            {" · "}
            <span className="m-mono">{course.code}</span>
          </span>
          <h1 className="m-page__h m-page__h--flex">
            <span
              className="m-dept-stripe"
              style={{ background: course.deptColor }}
            />
            {course.title}
          </h1>
          <div className="m-page__meta">
            <span className="m-page__meta-item">
              <UsersIcon size={13} /> {instructor.name}
            </span>
            <span className="m-page__meta-item">
              <BookOpenIcon size={13} /> {course.credits} credits · level{" "}
              {course.level}
            </span>
            <span className="m-page__meta-item">
              <MapPinIcon size={13} /> {course.modality}
            </span>
            <span className="m-badge m-badge--success">
              <span className="m-badge__dot" />
              Active
            </span>
          </div>
        </div>
        <div className="m-page__actions">
          <button className="m-btn" onClick={() => setMsgClassOpen(true)}>
            <InboxIcon size={14} /> Message class
          </button>
          <button
            className="m-btn m-btn--primary"
            onClick={() => setEditOpen(true)}
          >
            <PenIcon size={14} /> Edit course
          </button>
        </div>
      </div>
      {editOpen && (
        <EditCourseSheet course={course} onClose={() => setEditOpen(false)} />
      )}
      {msgClassOpen && (
        <ComposeSheet
          title="Message class"
          to={`All enrolled students (${course.enrolled})`}
          onClose={() => setMsgClassOpen(false)}
        />
      )}
    </>
  );
}
