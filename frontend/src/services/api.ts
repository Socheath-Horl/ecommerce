import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { store } from '@/store'
import { logout, setTokens } from '@/store/slices/authSlice'
import { getRefreshToken } from '@/lib/authStorage'
import type { AuthTokens } from '@/store/slices/authSlice'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  const { data } = await axios.post<{ success: boolean; data: AuthTokens }>(
    `${baseURL}/auth/refresh`,
    { refreshToken },
  )
  if (!data.success) return null
  store.dispatch(setTokens(data.data))
  return data.data.accessToken
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const isRefreshCall = original?.url?.includes('/auth/refresh')
    if (error.response?.status !== 401 || !original || isRefreshCall || original._retry) {
      throw error
    }

    refreshPromise ??= tryRefreshToken().finally(() => {
      refreshPromise = null
    })

    const newToken = await refreshPromise
    if (!newToken) {
      store.dispatch(logout())
      throw error
    }

    original._retry = true
    original.headers.Authorization = `Bearer ${newToken}`
    return api(original)
  },
)