import axiosClient from '../api/axiosClient'
import type { AcademicYearItem } from '../interfaces/academicYear.type'

export const academicYearsService = {
  getAcademicYears: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/academic-years', {
      params: { page, pageSize },
    })
    return response.data
  },

  createAcademicYear: async (payload: Omit<AcademicYearItem, 'id'>) => {
    const response = await axiosClient.post('/academic-years', payload)
    return response.data
  },

  updateAcademicYear: async (id: string, payload: Omit<AcademicYearItem, 'id'>) => {
    const response = await axiosClient.put(`/academic-years/${id}`, payload)
    return response.data
  },
}
