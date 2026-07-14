import axiosClient from '../api/axiosClient'
import type { SubjectItem } from '../interfaces/subject.type'

export const subjectsService = {
  getSubjects: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/subjects', {
      params: { page, pageSize },
    })
    return response.data
  },

  createSubject: async (payload: Omit<SubjectItem, 'id'>) => {
    const response = await axiosClient.post('/subjects', payload)
    return response.data
  },

  updateSubject: async (id: string, payload: Omit<SubjectItem, 'id'>) => {
    const response = await axiosClient.put(`/subjects/${id}`, payload)
    return response.data
  },
}
