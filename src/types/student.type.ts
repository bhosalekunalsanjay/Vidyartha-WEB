import { Gender } from '../enums/Gender'

export interface Student {
  id: string
  firstName: string
  lastName?: string
  classId: string
  feesStatus: 'Paid' | 'Pending'
  attendanceStatus: 'Present' | 'Absent'
  gender: Gender
  dateOfBirth: string | Date
  email: string
}
