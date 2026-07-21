import { UserRole } from '../enums/UserRole'

export const checkUserRole = {
  isSuperAdmin: (role: number | undefined): boolean => role === UserRole.SUPER_ADMIN,
  isSchoolAdmin: (role: number | undefined): boolean => role === UserRole.SCHOOL_ADMIN,
  isTeacher: (role: number | undefined): boolean => role === UserRole.TEACHER,
  isStudent: (role: number | undefined): boolean => role === UserRole.STUDENT,
  isParent: (role: number | undefined): boolean => role === UserRole.PARENT,
  isFinance: (role: number | undefined): boolean => role === UserRole.FINANCE,
  isNonTeachingStaff: (role: number | undefined): boolean => role === UserRole.NON_TEACHING_STAFF,
} as const
