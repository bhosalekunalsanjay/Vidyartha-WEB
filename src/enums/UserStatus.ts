export const UserStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  SUSPENDED: 2,
  DELETED: 3
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]