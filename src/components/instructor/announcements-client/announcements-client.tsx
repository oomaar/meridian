"use client";

import type {
  InstructorAnnouncementItem,
  InstructorAnnouncementsData,
} from "@/fake-db/dashboards";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AnnouncementComposeSheet } from "./components/announcement-compose-sheet";
import { AnnouncementsList } from "./components/announcements-list";

type AnnouncementsClientProps = { data: InstructorAnnouncementsData };

export function AnnouncementsClient({ data }: AnnouncementsClientProps) {
  const { instructor, semesterName } = data;

  const [courses, setCourses] = useState(data.courses);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const activeCourse = selectedCourseId
    ? (courses.find((c) => c.id === selectedCourseId) ?? null)
    : null;

  const displayedAnnouncements = activeCourse
    ? activeCourse.announcements
    : courses.flatMap((c) => c.announcements);

  const totalAll = courses.reduce((s, c) => s + c.announcements.length, 0);
  const totalSent = courses.reduce(
    (s, c) =>
      s + c.announcements.filter((a) => a.status === "published").length,
    0,
  );

  function handlePost(item: InstructorAnnouncementItem) {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === item.courseId
          ? { ...c, announcements: [item, ...c.announcements] }
          : c,
      ),
    );
  }

  return (
    <>
      <div className="m-page__header m-page__header--compact">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Faculty · Announcements</span>
          <h1 className="m-page__h">{instructor.fullName}</h1>
          <div className="m-grading-header-meta">
            <span>{semesterName}</span>
            <span>·</span>
            <span>{courses.length} courses</span>
            <span>·</span>
            <span>{totalSent} sent</span>
          </div>
        </div>
        <div className="m-page__actions">
          <button
            className="m-btn m-btn--primary"
            onClick={() => setComposeOpen(true)}
          >
            <PlusIcon size={13} /> New announcement
          </button>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-card">
          <div className="m-card__head">
            <div className="m-card__title">
              {activeCourse ? activeCourse.code : "All announcements"}
            </div>
            <span className="m-card__sub">
              {activeCourse ? activeCourse.title : semesterName}
            </span>
          </div>
          <div className="m-tabs" role="tablist">
            <button
              role="tab"
              className="m-tab"
              data-selected={!selectedCourseId}
              onClick={() => setSelectedCourseId(null)}
            >
              All
              <span className="m-tab__count">{totalAll}</span>
            </button>
            {courses.map((course) => (
              <button
                key={course.id}
                role="tab"
                className="m-tab"
                data-selected={selectedCourseId === course.id}
                onClick={() => setSelectedCourseId(course.id)}
              >
                {course.code}
                <span className="m-tab__count">
                  {course.announcements.length}
                </span>
              </button>
            ))}
          </div>
          <AnnouncementsList
            announcements={displayedAnnouncements}
            showCourse={!selectedCourseId}
          />
        </div>
      </div>

      {composeOpen && (
        <AnnouncementComposeSheet
          courses={courses}
          onPost={handlePost}
          onClose={() => setComposeOpen(false)}
        />
      )}
    </>
  );
}
