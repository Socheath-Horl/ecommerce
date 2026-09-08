import { createApi } from '@reduxjs/toolkit/query/react'
import type { AxiosError } from 'axios'
import { api } from '@/services/api'
import type { AuthTokens, AuthUser } from '@/store/slices/authSlice'

interface Credentials {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResult {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

interface QueryArgs {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

const axiosBaseQuery = async ({ url, method = 'GET', body }: QueryArgs) => {
  try {
    const result = await api({ url, method, data: body })
    return { data: (result.data as { success: boolean; data: unknown }).data }
  } catch (err) {
    const axiosError = err as AxiosError<{
      error?: { message?: string }
    }>
    return {
      error: {
        status: axiosError.response?.status ?? 500,
        message:
          axiosError.response?.data?.error?.message ?? 'Something went wrong',
      },
    }
  }
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResult, RegisterPayload>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<AuthResult, Credentials>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    refresh: builder.mutation<AuthTokens, { refreshToken: string }>({
      query: (body) => ({ url: '/auth/refresh', method: 'POST', body }),
    }),
    getProfile: builder.query<AuthUser, void>({
      query: () => ({ url: '/auth/profile' }),
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useGetProfileQuery,
} = authApi