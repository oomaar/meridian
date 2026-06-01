"use client";

import { useState } from "react";
import type {
  StudentCourseDetailData,
  StudentCourseDetailLesson,
  StudentCourseDetailModule,
} from "@/fake-db/dashboards";
import { AllThreadsSheet } from "./sheets/all-threads-sheet/all-threads-sheet";
import { ThreadDetailSheet } from "./sheets/thread-detail-sheet/thread-detail-sheet";
import { CourseDetailClientHeader } from "./components/course-detail-client-header";
import { CourseDetailClientOutlineCard } from "./components/course-detail-client-outline-card/course-detail-client-outline-card";
import { CourseDetailClientLessonContent } from "./components/course-detail-client-lesson-content/course-detail-client-lesson-content";
import { CourseDetailClientLessonResources } from "./components/course-detail-client-lesson-resources";
import { CourseDetailClientDiscussion } from "./components/course-detail-client-discussion";

type StudentCourseDetailClientProps = { data: StudentCourseDetailData };

export function StudentCourseDetailClient({
  data,
}: StudentCourseDetailClientProps) {
  const {
    course,
    modulesTotal,
    grade,
    modules,
    activeModuleIdx,
    activeLessonId: initialLessonId,
    resources,
    threads,
    syllabus,
  } = data;

  const allLessons = modules.flatMap((m) => m.lessons);

  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);
  const [openModuleIdx, setOpenModuleIdx] = useState(activeModuleIdx);
  const [allThreadsOpen, setAllThreadsOpen] = useState(false);
  const [threadDetailOpen, setThreadDetailOpen] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () =>
      new Set(
        allLessons.filter((l) => l.state === "complete").map((l) => l.id),
      ),
  );

  const dynamicProgress =
    allLessons.length > 0 ? completedLessonIds.size / allLessons.length : 0;

  const currentIdx = allLessons.findIndex((l) => l.id === activeLessonId);
  const lesson = allLessons[currentIdx] ?? allLessons[0];

  function goToLesson(l: StudentCourseDetailLesson) {
    setActiveLessonId(l.id);
    setOpenModuleIdx(l.moduleIdx);
  }

  const gradeTone =
    grade === "—"
      ? ""
      : grade.startsWith("A")
        ? "accent"
        : grade.startsWith("B")
          ? ""
          : "warning";

  return (
    <>
      {allThreadsOpen && (
        <AllThreadsSheet
          threads={threads}
          onClose={() => setAllThreadsOpen(false)}
          onOpenThread={() => {
            setAllThreadsOpen(false);
            setThreadDetailOpen(true);
          }}
        />
      )}
      {threadDetailOpen && (
        <ThreadDetailSheet
          thread={threads[0]}
          instructor={course.instructor}
          onClose={() => setThreadDetailOpen(false)}
        />
      )}
      <CourseDetailClientHeader
        course={course}
        lesson={lesson}
        modulesTotal={modulesTotal}
        dynamicProgress={dynamicProgress}
        gradeTone={gradeTone}
        grade={grade}
        syllabus={syllabus}
      />
      <div className="m-page__body m-course-layout">
        <CourseDetailClientOutlineCard
          activeLessonId={activeLessonId}
          completedLessonIds={completedLessonIds}
          modules={modules}
          modulesTotal={modulesTotal}
          goToLesson={goToLesson}
          dynamicProgress={dynamicProgress}
          onModuleClick={(mod: StudentCourseDetailModule) => {
            setOpenModuleIdx(mod.idx === openModuleIdx ? -1 : mod.idx);
          }}
          isModuleOpen={(modId: number) => {
            return modId === openModuleIdx;
          }}
        />
        <CourseDetailClientLessonContent
          allLessons={allLessons}
          currentIdx={currentIdx}
          lesson={lesson}
          setCompletedLessonIds={setCompletedLessonIds}
          goToLesson={goToLesson}
          grade={grade}
          course={course}
          gradeTone={gradeTone}
        />
        <div className="m-stack m-right-col">
          <CourseDetailClientLessonResources resources={resources} />
          <CourseDetailClientDiscussion
            threads={threads}
            setAllThreadsOpen={setAllThreadsOpen}
            setThreadDetailOpen={setThreadDetailOpen}
          />
        </div>
      </div>
    </>
  );
}
