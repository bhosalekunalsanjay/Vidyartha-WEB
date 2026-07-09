export const UserStatus = {
  INACTIVE: 'INACTIVE',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED'
} as const

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]