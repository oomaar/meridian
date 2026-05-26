import { InboxIcon } from "lucide-react";
import { Avatar } from "../../../components/avatar";
import { useState } from "react";
import { ComposeSheet } from "../../../sheets/compose-sheet";
import type { AdminTeachingTeamDTO } from "@/fake-db/dashboards";

type TeachingTeamProps = {
  teachingTeam: AdminTeachingTeamDTO[];
};

export function TeachingTeam({ teachingTeam }: TeachingTeamProps) {
  const [msgTeacher, setMsgTeacher] = useState({
    show: false,
    teacher: null as AdminTeachingTeamDTO | null,
  });

  return (
    <>
      <div className="m-card">
        <div className="m-card__head">
          <span className="m-card__title">Teaching team</span>
        </div>
        <div className="m-card__body">
          <div className="m-stack m-gap-12">
            {teachingTeam.map((p) => (
              <div key={p.id} className="m-person-row">
                <Avatar name={p.name} size="md" />
                <div className="m-person-row__info">
                  <div className="m-person-row__name">{p.name}</div>
                  <div className="m-person-row__role">{p.role}</div>
                </div>
                <button
                  className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                  onClick={() => setMsgTeacher({ show: true, teacher: p })}
                >
                  <InboxIcon size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {msgTeacher.show && (
        <ComposeSheet
          title={`Message ${msgTeacher.teacher?.name}`}
          to={msgTeacher.teacher ? msgTeacher?.teacher?.name : ``}
          onClose={() => setMsgTeacher({ show: false, teacher: null })}
        />
      )}
    </>
  );
}
