import { faker, pad, isoDay, NOW } from "../seed";
import { PROGRAMS } from "../lookups";
import type { Program, Student, StudentStatus } from "../types";

export function buildStudents(count: number, programs: Program[] = PROGRAMS): Student[] {
  const results: Student[] = [];
  for (let i = 0; i < count; i++) {
    const program = faker.helpers.arrayElement(programs);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const year = faker.helpers.weightedArrayElement([
      { value: 1, weight: 28 },
      { value: 2, weight: 26 },
      { value: 3, weight: 22 },
      { value: 4, weight: 18 },
      { value: 5, weight: 6 },
    ]) as 1 | 2 | 3 | 4 | 5;
    const status = faker.helpers.weightedArrayElement<StudentStatus>([
      { value: "active", weight: 88 },
      { value: "leave", weight: 4 },
      { value: "probation", weight: 3 },
      { value: "graduated", weight: 3 },
      { value: "withdrawn", weight: 2 },
    ]);
    const gpa = Number(
      Math.min(
        4.0,
        Math.max(
          1.5,
          2.4 + faker.number.float({ min: 0, max: 1.6, fractionDigits: 2 })
        )
      ).toFixed(2)
    );
    const enrollmentDate = isoDay(
      new Date(NOW.getFullYear() - year, 7, 25)
    );
    results.push({
      id: `stu-${pad(i + 1, 5)}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: faker.internet
        .email({
          firstName,
          lastName,
          provider: "aldridge.edu",
          allowSpecialCharacters: false,
        })
        .toLowerCase(),
      programId: program.id,
      year,
      gpa,
      status,
      enrollmentDate,
      enrolledCourseIds: [],
    });
  }
  return results;
}
