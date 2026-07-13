import axiosClient from '../api/axiosClient'
import { UserStatus } from '../enums/UserStatus'

export interface UserPayload {
  username: string
  email: string
  password?: string
  confirmPassword?: string
  firstName: string
  lastName?: string
  dateOfBirth: string | Date
  role: number
  status?: UserStatus
}

export const usersService = {
  getUsers: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/users', {
      params: { page, pageSize },
    })
    return response.data
  },

  checkUsernameAvailable: async (username: string) => {
    const response = await axiosClient.get('/users/username-available', {
      params: { username },
    })
    return response.data.available
  },

  createUser: async (payload: UserPayload) => {
    const response = await axiosClient.post('/auth/register', payload)
    return response.data
  },

  updateUser: async (id: string, payload: UserPayload) => {
    const response = await axiosClient.put(`/users/${id}`, payload)
    return response.data
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    const response = await axiosClient.patch(`/users/${id}/status`, { status })
    return response.data
  },
}
