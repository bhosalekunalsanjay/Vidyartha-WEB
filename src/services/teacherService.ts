import axiosClient from '../api/axiosClient'
import type { Teacher } from '../types/teacher.type'

export const teachersService = {
  getTeachers: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/teachers', {
      params: { page, pageSize },
    })
    return response.data
  },

  createTeacher: async (payload: Omit<Teacher, 'id'>) => {
    const response = await axiosClient.post('/teachers', payload)
    return response.data
  },

  updateTeacher: async (id: string, payload: Omit<Teacher, 'id'>) => {
    const response = await axiosClient.put(`/teachers/${id}`, payload)
    return response.data
  },
}
