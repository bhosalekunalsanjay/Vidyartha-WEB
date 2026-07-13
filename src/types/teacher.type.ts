import { Gender } from '../enums/Gender'

export interface Teacher {
  id: string
  firstName: string
  lastName?: string
  email: string
  phone?: string
  qualification?: string
  status: 'Active' | 'Inactive'
  gender: Gender
}
