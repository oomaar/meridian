import Link from "next/link";
import { HBarChart } from "@/components/charts/hbar";
import type { Semester } from "@/fake-db";

type OverviewEnrollmentDepartmentProps = {
  deptBars: {
    l: string;
    v: number;
    color: string;
  }[];
  sem?: Semester;
};

export function OverviewEnrollmentDepartment({
  deptBars,
  sem,
}: OverviewEnrollmentDepartmentProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <h3 className="m-card__title">Enrollment by department</h3>
        <span className="m-card__sub">{sem?.name ?? "Current semester"}</span>
        <Link href="/admin/semesters" className="m-btn m-btn--ghost m-btn--sm">
          Compare terms
        </Link>
      </div>
      <div className="m-card__body">
        <HBarChart data={deptBars} format={(v) => v.toLocaleString()} />
      </div>
    </div>
  );
}
