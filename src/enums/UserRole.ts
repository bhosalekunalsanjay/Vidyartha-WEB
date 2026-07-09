export const UserRole = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]