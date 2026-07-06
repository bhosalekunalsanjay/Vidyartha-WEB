import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios'
import { notify } from '../store/notification.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
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

    const errorData = error.response?.data as { message?: string } | undefined
    const errorMessage = errorData?.message || error.message || 'An unexpected connection error occurred.'
    notify.error(errorMessage)

    return Promise.reject(error)
  }
)

export default api
