import axiosClient from '../api/axiosClient'
import type { SchoolItem } from '../types/school.type'

export const schoolsService = {
  getSchools: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/schools', {
      params: { page, pageSize },
    })
    return response.data
  },

  createSchool: async (payload: Omit<SchoolItem, 'id'>) => {
    const response = await axiosClient.post('/school/register', payload)
    return response.data
  },

  updateSchool: async (id: string, payload: Omit<SchoolItem, 'id'>) => {
    const response = await axiosClient.put(`/schools/${id}`, payload)
    return response.data
  },
}
