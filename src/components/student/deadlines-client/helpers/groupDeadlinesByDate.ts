import type { StudentDeadlineItem } from "@/fake-db/dashboards";

export function groupDeadlinesByDate(
  deadlines: StudentDeadlineItem[],
): Record<string, StudentDeadlineItem[]> {
  const groups: Record<string, StudentDeadlineItem[]> = {
    overdue: [],
    today: [],
    tomorrow: [],
    week: [],
    nextWeek: [],
    later: [],
  };

  deadlines.forEach((d) => {
    if (d.inLabel === "overdue") {
      groups.overdue.push(d);
    } else if (d.inLabel === "today") {
      groups.today.push(d);
    } else if (d.inLabel === "tomorrow") {
      groups.tomorrow.push(d);
    } else if (d.inLabel.startsWith("in ")) {
      const match = d.inLabel.match(/in (\d+) days/);
      if (match) {
        const days = parseInt(match[1], 10);
        if (days >= 2 && days <= 6) {
          groups.week.push(d);
        } else if (days >= 7 && days <= 13) {
          groups.nextWeek.push(d);
        } else {
          groups.later.push(d);
        }
      } else {
        groups.later.push(d);
      }
    } else {
      groups.later.push(d);
    }
  });

  return groups;
}
