import type { UserStatus } from '../enums/UserStatus'

export interface StaffMember {
  id: string
  firstName: string
  lastName?: string
  username: string
  email?: string
  dateOfBirth?: string | Date
  schoolId?: string
  status: UserStatus
  role: number
}
