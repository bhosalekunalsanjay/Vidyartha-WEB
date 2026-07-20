import axiosClient from '../api/axiosClient'
import type { AcademicYearItem } from '../interfaces/academicYear.type'

export const academicYearsService = {
  getAcademicYears: async (page: number, pageSize: number, schoolId?: string | null) => {
    const url = schoolId 
      ? `/admin/schools/${schoolId}/academic-years` 
      : '/academic-years'
    const response = await axiosClient.get(url, {
      params: { pageNumber: page, pageSize },
    })
    
    // Map backend DTO to frontend AcademicYearItem
    const mapItem = (item: any): AcademicYearItem => ({
      id: item.id,
      name: item.name,
      startDate: item.startDate,
      endDate: item.endDate,
      status: item.isCurrent ? 'Active' : 'Inactive',
    })

    if (response.data) {
      if (response.data.items) {
        return {
          ...response.data,
          items: response.data.items.map(mapItem),
        }
      }
      if (Array.isArray(response.data)) {
        return response.data.map(mapItem)
      }
    }

    return response.data
  },

  createAcademicYear: async (payload: Omit<AcademicYearItem, 'id'>, schoolId?: string | null) => {
    const url = schoolId
      ? `/admin/schools/${schoolId}/academic-years`
      : '/academic-years'
    
    // Map frontend payload to backend request DTO
    const backendPayload = {
      name: payload.name,
      startDate: payload.startDate instanceof Date ? payload.startDate.toISOString().split('T')[0] : payload.startDate,
      endDate: payload.endDate instanceof Date ? payload.endDate.toISOString().split('T')[0] : payload.endDate,
      isCurrent: payload.status === 'Active',
    }

    const response = await axiosClient.post(url, backendPayload)
    return response.data
  },

  updateAcademicYear: async (id: string, payload: Omit<AcademicYearItem, 'id'>, schoolId?: string | null) => {
    const url = schoolId
      ? `/admin/schools/${schoolId}/academic-years/${id}`
      : `/academic-years/${id}`

    // Map frontend payload to backend request DTO
    const backendPayload = {
      name: payload.name,
      startDate: payload.startDate instanceof Date ? payload.startDate.toISOString().split('T')[0] : payload.startDate,
      endDate: payload.endDate instanceof Date ? payload.endDate.toISOString().split('T')[0] : payload.endDate,
      isCurrent: payload.status === 'Active',
    }

    const response = await axiosClient.put(url, backendPayload)
    return response.data
  },
}
