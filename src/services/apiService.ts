import axiosClient from '../api/axiosClient'
import { UserRole } from '../enums/UserRole'
import { UserStatus } from '../enums/UserStatus'
import { Gender } from '../enums/Gender'

// --- Users Service ---
export interface UserPayload {
  username: string
  email: string
  password?: string
  confirmPassword?: string
  firstName: string
  lastName?: string
  dateOfBirth: string | Date
  gender?: Gender
  role: UserRole
  status?: UserStatus
}

export const usersService = {
  getUsers: async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.get('/users', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  checkUsernameAvailable: async (username: string) => {
    try {
      const response = await axiosClient.get('/users/username-available', {
        params: { username },
      })
      return response.data.available
    } catch (error) {
      throw error
    }
  },

  createUser: async (payload: UserPayload) => {
    try {
      const response = await axiosClient.post('/auth/register', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateUser: async (id: string, payload: UserPayload) => {
    try {
      const response = await axiosClient.put(`/users/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateUserStatus: async (id: string, status: UserStatus) => {
    try {
      const response = await axiosClient.patch(`/users/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// --- Students Service ---
export interface Student {
  id: string
  firstName: string
  lastName?: string
  classId: string
  feesStatus: 'Paid' | 'Pending'
  attendanceStatus: 'Present' | 'Absent'
  gender: Gender
  dateOfBirth: string | Date
  email: string
}

export const studentsService = {
  getStudents: async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.get('/students', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createStudent: async (payload: Omit<Student, 'id'>) => {
    try {
      const response = await axiosClient.post('/students', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateStudent: async (id: string, payload: Omit<Student, 'id'>) => {
    try {
      const response = await axiosClient.put(`/students/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// --- Teachers Service ---
export interface Teacher {
  id: string
  firstName: string
  lastName?: string
  email: string
  phone?: string
  qualification?: string
  status: 'Active' | 'Inactive'
  gender: Gender
}

export const teachersService = {
  getTeachers: async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.get('/teachers', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createTeacher: async (payload: Omit<Teacher, 'id'>) => {
    try {
      const response = await axiosClient.post('/teachers', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateTeacher: async (id: string, payload: Omit<Teacher, 'id'>) => {
    try {
      const response = await axiosClient.put(`/teachers/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// --- Classes Service ---
export interface ClassItem {
  id: string
  name: string
  academicYearId: string
  capacity: number
}

export const classesService = {
  getClasses: async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.get('/classes', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createClass: async (payload: Omit<ClassItem, 'id'>) => {
    try {
      const response = await axiosClient.post('/classes', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateClass: async (id: string, payload: Omit<ClassItem, 'id'>) => {
    try {
      const response = await axiosClient.put(`/classes/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// --- Divisions Service ---
export interface DivisionItem {
  id: string
  name: string
  classId: string
  classRoom?: string
}

export const divisionsService = {
  getDivisions: async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.get('/divisions', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createDivision: async (payload: Omit<DivisionItem, 'id'>) => {
    try {
      const response = await axiosClient.post('/divisions', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateDivision: async (id: string, payload: Omit<DivisionItem, 'id'>) => {
    try {
      const response = await axiosClient.put(`/divisions/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// --- Subjects Service ---
export interface SubjectItem {
  id: string
  name: string
  code: string
  type: 'Theory' | 'Practical' | 'Both'
}

export const subjectsService = {
  getSubjects: async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.get('/subjects', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createSubject: async (payload: Omit<SubjectItem, 'id'>) => {
    try {
      const response = await axiosClient.post('/subjects', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateSubject: async (id: string, payload: Omit<SubjectItem, 'id'>) => {
    try {
      const response = await axiosClient.put(`/subjects/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// --- Academic Years Service ---
export interface AcademicYearItem {
  id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  status: 'Active' | 'Inactive'
}

export const academicYearsService = {
  getAcademicYears: async (page: number, pageSize: number) => {
    try {
      const response = await axiosClient.get('/academic-years', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createAcademicYear: async (payload: Omit<AcademicYearItem, 'id'>) => {
    try {
      const response = await axiosClient.post('/academic-years', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateAcademicYear: async (id: string, payload: Omit<AcademicYearItem, 'id'>) => {
    try {
      const response = await axiosClient.put(`/academic-years/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
