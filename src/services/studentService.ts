import axiosClient from '../api/axiosClient'
import type { Student } from '../interfaces/student.type'

export const studentsService = {
  getStudents: async (page: number, pageSize: number) => {
    const response = await axiosClient.get('/students', {
      params: { page, pageSize },
    })
    return response.data
  },

  createStudent: async (payload: Omit<Student, 'id'>) => {
    const response = await axiosClient.post('/students', payload)
    return response.data
  },

  updateStudent: async (id: string, payload: Omit<Student, 'id'>) => {
    const response = await axiosClient.put(`/students/${id}`, payload)
    return response.data
  },
}
