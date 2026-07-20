import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios'
import { notify } from '../store/notification.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  const schoolId = localStorage.getItem('selectedSchoolId')
  if (schoolId) {
    config.headers['X-School-Id'] = schoolId
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('accessToken')
      if (window.location.pathname !== '/login') {
        notify.error('Your session has expired. Please sign in again.')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // Handle structured backend validation errors (single response or array format)
    const errorData = error.response?.data
    if (errorData) {
      const dataArray = Array.isArray(errorData) ? errorData : [errorData]
      const validationMessages: string[] = []

      for (const item of dataArray) {
        if (item && Array.isArray(item.errors)) {
          for (const err of item.errors) {
            if (err && err.errorMessage) {
              validationMessages.push(err.errorMessage)
            }
          }
        }
      }

      if (validationMessages.length > 0) {
        // Create a single message from the validation errors array
        const combinedMessage = validationMessages.map((msg) => `• ${msg}`).join('\n')
        notify.error(combinedMessage)
        return Promise.reject(error)
      }
    }

    // Fallback to generic message parsing
    const standardErrorData = errorData as { message?: string } | undefined
    const errorMessage = standardErrorData?.message || error.message || 'An unexpected connection error occurred.'
    notify.error(errorMessage)

    return Promise.reject(error)
  }
)

export default api
