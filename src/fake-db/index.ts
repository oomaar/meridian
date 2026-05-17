export * from "./types";
export { db } from "./universe";
export { NOW, SCALE } from "./seed";

export {
  generateCourseProgress,
  generateDepartmentLoad,
  generateEnrollmentTrend,
  generateGradeDistribution,
  generateSemesterAnalytics,
  type CourseProgress,
  type DepartmentLoad,
  type EnrollmentTrend,
  type GradeDistribution,
  type SemesterAnalytics,
} from "./analytics";

export {
  generateRecentActivity,
  generateRecentActivityForCourse,
  generateRecentActivityForInstructor,
  generateRecentActivityForStudent,
  generateUnreadCount,
  generateUnreadNotifications,
  generateUpcomingDeadlines,
} from "./generators";

export {
  getAdminOverview,
  getInstructorDashboard,
  getStudentDashboard,
  type AdminOverviewData,
  type InstructorDashboardData,
  type StudentDashboardData,
} from "./dashboards";

export {
  getActiveSemester,
  getActivityForCourse,
  getActivityForInstructor,
  getActivityForStudent,
  getAssignment,
  getAssignmentsForCourse,
  getCourse,
  getCourseByCode,
  getCoursesForDepartment,
  getCoursesForInstructor,
  getCoursesForSemester,
  getCoursesForStudent,
  getDepartment,
  getInstructor,
  getNotificationsForUser,
  getProgram,
  getSemester,
  getStudent,
  getStudentsForCourse,
  getUser,
} from "./relationships";
