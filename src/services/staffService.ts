import axiosClient from '../api/axiosClient'
import { UserRole } from '../enums/UserRole'
import type { UserStatus } from '../enums/UserStatus'
import type { User } from '../interfaces/payloads/user'

export interface StaffPayload {
  firstName: string
  lastName?: string
  username: string
  email?: string
  password: string
  confirmPassword: string
  dateOfBirth?: string
  schoolId?: string
  status: UserStatus
  role: number // Always UserRole.NON_TEACHING_STAFF = 7
}

export interface StaffUpdatePayload {
  firstName: string
  lastName?: string
  username: string
  email?: string
  dateOfBirth?: string
  schoolId?: string
  status: UserStatus
}

export const staffService = {
  getStaff: async (payload: User, signal?: AbortSignal) => {
    const response = await axiosClient.get('/users', {
      params: { 
        pageNumber: payload.pageNumber, 
        pageSize: payload.pageSize, 
        role: payload.role,
        schoolId: payload.schoolId 
      }, // NON_TEACHING_STAFF = 7
      signal,
    })
    return response.data
  },

  createStaff: async (payload: StaffPayload) => {
    const response = await axiosClient.post('/auth/register', payload)
    return response.data
  },

  updateStaff: async (id: string, payload: StaffUpdatePayload) => {
    const response = await axiosClient.put(`/auth/update/${id}`, payload)
    return response.data
  },

  checkUsernameAvailable: async (username: string) => {
    const response = await axiosClient.get('/users/username-available', {
      params: { username },
    })
    return response.data.available
  },
}
