import type { StudentCourseDetailData } from "@/fake-db/dashboards";

type PoliciesProps = {
  syllabus: StudentCourseDetailData["syllabus"];
};

export function Policies({ syllabus }: PoliciesProps) {
  return (
    <div>
      <div className="m-syllabus-section__label">Course policies</div>
      <div className="m-syllabus-policies">
        {syllabus.policies.map((p) => (
          <div key={p.title}>
            <div className="m-syllabus-policy__title">{p.title}</div>
            <p className="m-syllabus-policy__body">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
