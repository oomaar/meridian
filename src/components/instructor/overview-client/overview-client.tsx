"use client";

import Link from "next/link";
import { PenLineIcon } from "lucide-react";
import { OfficeHoursSheet } from "./sheets/office-hours-sheet";
import type { InstructorOverviewData } from "@/fake-db/dashboards";
import { StatCard } from "./components/stat-card";
import { CourseRow } from "./components/course-row";
import { ScheduleItem } from "./components/schedule-item";
import { QueueRow } from "./components/queue-row";

export function OverviewClient({ data }: { data: InstructorOverviewData }) {
  const {
    instructor,
    semesterName,
    weekNum,
    scheduleDay,
    ungradedTotal,
    oldestHours,
    avgTurnaroundHours,
    courseHealth,
    officeLocation,
    officeHours,
    courses,
    schedule,
    gradingQueue,
  } = data;

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">
            Faculty · {semesterName} · Week {weekNum}
          </span>
          <h1 className="m-page__h">
            Welcome back, Prof. {instructor.lastName}.
          </h1>
          <p className="m-page__sub">
            {ungradedTotal > 0 ? (
              <>
                <b>{ungradedTotal} submissions</b> are waiting for your review,
                with the oldest waiting <b>{oldestHours} hours</b>.
              </>
            ) : (
              "All submissions are graded. Great work."
            )}
          </p>
        </div>
        <div className="m-page__actions">
          <OfficeHoursSheet
            officeLocation={officeLocation}
            officeHours={officeHours}
          />
          <Link href="/instructor/grading" className="m-btn m-btn--primary">
            <PenLineIcon size={14} /> Open grading queue
          </Link>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-stack">
          <div className="m-grid m-grid-4">
            <StatCard
              label="My courses"
              value={data.courseCount}
              delta={`${courses.reduce((s, c) => s + c.enrolled, 0)} students`}
            />
            <StatCard
              label="Ungraded"
              value={ungradedTotal}
              delta={`oldest ${oldestHours}h`}
              deltaDir="down"
              spark={[14, 18, 21, 19, 22, 25, ungradedTotal]}
              sparkColor="var(--m-warning)"
            />
            <StatCard
              label="Avg. turnaround"
              value={avgTurnaroundHours}
              unit=" hrs"
              delta="−4h vs target"
              deltaDir="up"
              spark={[58, 54, 49, 46, 44, 42, avgTurnaroundHours]}
              sparkColor="var(--m-info)"
            />
            <StatCard
              label="Course health"
              value={courseHealth}
              delta="all on track"
              deltaDir="up"
            />
          </div>

          <div className="m-grid m-grid-2-1">
            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">My courses</div>
              </div>
              <div className="m-card__body--flush">
                {courses.map((c, i) => (
                  <div
                    key={c.code}
                    className={
                      i < courses.length - 1
                        ? "m-inst-course-row-wrap m-inst-course-row-wrap--bordered"
                        : "m-inst-course-row-wrap"
                    }
                  >
                    <CourseRow course={c} />
                  </div>
                ))}
              </div>
            </div>

            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">{`Today's`} schedule</div>
                <span className="m-card__sub">{scheduleDay}</span>
              </div>
              <div className="m-card__body--flush">
                {schedule.map((item, i) => (
                  <ScheduleItem
                    key={i}
                    item={item}
                    last={i === schedule.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="m-card">
            <div className="m-card__head">
              <div className="m-card__title">Submissions waiting on you</div>
              <span className="m-card__sub">
                {gradingQueue.length} in queue · oldest {oldestHours}h
              </span>
              <div className="m-card__head-actions">
                <Link
                  href="/instructor/grading"
                  className="m-btn m-btn--primary m-btn--sm"
                >
                  <PenLineIcon size={12} /> Grade next
                </Link>
              </div>
            </div>
            <div className="m-card__body--flush">
              <table className="m-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Assignment</th>
                    <th>Submitted</th>
                    <th className="m-num">Attempt</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {gradingQueue.map((item) => (
                    <QueueRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
