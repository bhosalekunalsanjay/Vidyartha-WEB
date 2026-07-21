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

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string | null) => void
  reject: (err: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config
    const status = error.response?.status

    // Check if error is 401 and the request was not a login or refresh request
    if (
      status === 401 &&
      originalRequest &&
      !(originalRequest as any)._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      ;(originalRequest as any)._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      const accessToken = localStorage.getItem('accessToken')

      if (refreshToken && accessToken) {
        if (isRefreshing) {
          return new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              return api(originalRequest)
            })
            .catch((err) => Promise.reject(err))
        }

        isRefreshing = true

        try {
          // Call refresh API endpoint
          const response = await axios.post<{ accessToken: string; refreshToken: string }>(
            (import.meta.env.VITE_API_BASE_URL || '/api') + '/auth/refresh',
            {
              accessToken,
              refreshToken,
            }
          )

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('accessToken', newAccessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          processQueue(null, newAccessToken)
          isRefreshing = false

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          isRefreshing = false

          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          if (window.location.pathname !== '/login') {
            notify.error('Your session has expired. Please sign in again.')
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      }
    }

    if (status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
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
