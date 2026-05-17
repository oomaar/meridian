import { faker, pad, isoDate, daysAgo, hoursAgo } from "../seed";
import type { User, UserRole, UserStatus } from "../types";

export function buildUsers(count: number): User[] {
  const results: User[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const role = faker.helpers.weightedArrayElement<UserRole>([
      { value: "registrar", weight: 35 },
      { value: "admissions", weight: 25 },
      { value: "it", weight: 15 },
      { value: "dean", weight: 10 },
      { value: "admin", weight: 15 },
    ]);
    const status = faker.helpers.weightedArrayElement<UserStatus>([
      { value: "active", weight: 85 },
      { value: "invited", weight: 10 },
      { value: "suspended", weight: 5 },
    ]);
    const lastLogin =
      status === "invited"
        ? null
        : isoDate(
            faker.helpers.weightedArrayElement([
              { value: hoursAgo(faker.number.int({ min: 1, max: 8 })), weight: 50 },
              { value: daysAgo(faker.number.int({ min: 1, max: 7 })), weight: 35 },
              { value: daysAgo(faker.number.int({ min: 7, max: 60 })), weight: 15 },
            ])
          );
    results.push({
      id: `user-${pad(i + 1, 3)}`,
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
      role,
      status,
      lastLogin,
      mfa: faker.helpers.weightedArrayElement([
        { value: true, weight: 70 },
        { value: false, weight: 30 },
      ]),
    });
  }
  return results;
}
