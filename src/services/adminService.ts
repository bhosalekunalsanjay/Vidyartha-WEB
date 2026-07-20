import axiosClient from '../api/axiosClient'
import { UserStatus } from '../enums/UserStatus'

export interface AdminPayload {
  schoolId: string
  firstName: string
  lastName?: string
  dateOfBirth?: string | Date | null
  password?: string
  confirmPassword?: string
  username: string
  status: UserStatus
}

export interface AdminItem {
  id: string
  schoolId: string
  username: string
  email: string
  firstName: string
  lastName?: string
  dateOfBirth?: string
  status: UserStatus
}

export const adminsService = {
  getAdmins: async (pageNumber: number, pageSize: number, searchTerm?: string) => {
    const response = await axiosClient.get('/admin', {
      params: { pageNumber, pageSize, searchTerm },
    })
    return response.data
  },

  createAdmin: async (payload: AdminPayload) => {
    const response = await axiosClient.post('/admin', payload)
    return response.data
  },

  updateAdmin: async (id: string, payload: AdminPayload) => {
    const response = await axiosClient.put(`/admin/${id}`, payload)
    return response.data
  },
}
