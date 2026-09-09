import { createApi } from '@reduxjs/toolkit/query/react'
import type { AxiosError } from 'axios'
import { api } from '@/services/api'
import type { Role } from '@/store/slices/authSlice'

interface QueryArgs {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  params?: unknown
}

const axiosBaseQuery = async ({ url, method = 'GET', body, params }: QueryArgs) => {
  try {
    const result = await api({ url, method, data: body, params })
    return {
      data: result.data as { success: boolean; data: unknown; pagination?: unknown },
    }
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

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  createdAt: string
  _count: { orders: number }
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminUsersList {
  data: AdminUser[]
  pagination: Pagination
}

export interface AdminUsersQuery {
  page?: number
  limit?: number
  search?: string
  role?: Role
}

export interface AdminUserRoleUpdate {
  id: string
  name: string
  email: string
  role: Role
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['AdminUsers'],
  endpoints: (builder) => ({
    getUsers: builder.query<AdminUsersList, AdminUsersQuery>({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: ['AdminUsers'],
    }),
    updateUserRole: builder.mutation<{ data: AdminUserRoleUpdate }, { id: string; role: Role }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
})

export const { useGetUsersQuery, useUpdateUserRoleMutation } = adminApi