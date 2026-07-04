import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// REQUEST interceptor — runs before every request leaves the app.
// Attaches the auth token automatically so you never repeat this in every call.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// RESPONSE interceptor — runs on every response/error before your .then()/.catch() sees it.
// Centralizes "session expired" handling instead of checking status codes in every component.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api