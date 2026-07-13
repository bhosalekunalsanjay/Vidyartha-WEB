import axiosClient from '../api/axiosClient'
import type { DivisionItem } from '../types/division.type'

export const divisionsService = {
  getDivisions: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/divisions', {
      params: { page, pageSize },
    })
    return response.data
  },

  createDivision: async (payload: Omit<DivisionItem, 'id'>) => {
    const response = await axiosClient.post('/divisions', payload)
    return response.data
  },

  updateDivision: async (id: string, payload: Omit<DivisionItem, 'id'>) => {
    const response = await axiosClient.put(`/divisions/${id}`, payload)
    return response.data
  },
}
