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
  generateSampleSubmission,
  generateSubmissionsLast7d,
  generateSubmissionThroughput,
  generateUnreadCount,
  generateUnreadNotifications,
  generateUpcomingDeadlines,
  type SampleSubmission,
  type SubmissionThroughputPoint,
} from "./generators";

export {
  getAdminOverview,
  getInstructorDashboard,
  getStudentDashboard,
  getCmdPaletteIndex,
  type AdminOverviewData,
  type InstructorDashboardData,
  type StudentDashboardData,
  type CmdIndexItem,
  type CmdIconName,
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
