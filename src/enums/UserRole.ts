export const UserRole = {
  SUPER_ADMIN : 1,
  SCHOOL_ADMIN : 2,
  TEACHER : 3,
  STUDENT : 4,
  PARENT : 5,
  FINANCE: 6,
  NON_TEACHING_STAFF: 7
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]