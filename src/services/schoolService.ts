import axiosClient from '../api/axiosClient'
import type { SchoolItem } from '../interfaces/school.type'

export const schoolsService = {
  getSchools: async (pageNumber: number, pageSize: number, signal?: AbortSignal) => {
    const response = await axiosClient.get('/school/', {
      params: { pageNumber, pageSize },
      signal,
    })
    return response.data
  },

  createSchool: async (payload: Omit<SchoolItem, 'id'>) => {
    const response = await axiosClient.post('/school/register', payload)
    return response.data
  },

  updateSchool: async (id: string, payload: Omit<SchoolItem, 'id'>) => {
    const response = await axiosClient.put(`/school/${id}`, payload)
    return response.data
  },
}
