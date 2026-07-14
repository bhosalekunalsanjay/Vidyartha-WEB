import axiosClient from '../api/axiosClient'
import type { ClassItem } from '../interfaces/class.type'

export const classesService = {
  getClasses: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/classes', {
      params: { page, pageSize },
    })
    return response.data
  },

  createClass: async (payload: Omit<ClassItem, 'id'>) => {
    const response = await axiosClient.post('/classes', payload)
    return response.data
  },

  updateClass: async (id: string, payload: Omit<ClassItem, 'id'>) => {
    const response = await axiosClient.put(`/classes/${id}`, payload)
    return response.data
  },
}
