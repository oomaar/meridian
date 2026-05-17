import { faker, pad, isoDay } from "../seed";
import { DEPARTMENTS } from "../lookups";
import type {
  Department,
  Instructor,
  InstructorStatus,
  InstructorTitle,
} from "../types";

const TITLE_PREFIX: Record<InstructorTitle, string> = {
  Adjunct: "Mr.",
  Lecturer: "Mr.",
  "Assistant Professor": "Dr.",
  "Associate Professor": "Prof.",
  Professor: "Prof.",
};

export function buildInstructors(count: number, departments: Department[] = DEPARTMENTS): Instructor[] {
  const results: Instructor[] = [];
  for (let i = 0; i < count; i++) {
    const dept = faker.helpers.arrayElement(departments);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const title = faker.helpers.weightedArrayElement<InstructorTitle>([
      { value: "Professor", weight: 18 },
      { value: "Associate Professor", weight: 28 },
      { value: "Assistant Professor", weight: 22 },
      { value: "Lecturer", weight: 22 },
      { value: "Adjunct", weight: 10 },
    ]);
    const status = faker.helpers.weightedArrayElement<InstructorStatus>([
      { value: "active", weight: 92 },
      { value: "leave", weight: 5 },
      { value: "retired", weight: 3 },
    ]);
    const hireDate = isoDay(
      faker.date.between({ from: "1995-01-01", to: "2024-09-01" })
    );
    results.push({
      id: `inst-${pad(i + 1, 3)}`,
      firstName,
      lastName,
      fullName: `${TITLE_PREFIX[title]} ${firstName} ${lastName}`,
      title,
      email: faker.internet
        .email({
          firstName,
          lastName,
          provider: "aldridge.edu",
          allowSpecialCharacters: false,
        })
        .toLowerCase(),
      departmentId: dept.id,
      hireDate,
      status,
      rating: Number(
        faker.number.float({ min: 3.2, max: 5.0, fractionDigits: 1 })
      ),
      courseIds: [],
    });
  }
  return results;
}
