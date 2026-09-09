import { api } from '@/services/api'
import { store } from '@/store'
import {
  setTokens,
  setUser,
  type AuthTokens,
  type AuthUser,
} from '@/store/slices/authSlice'
import { getRefreshToken } from '@/lib/authStorage'

export async function restoreSession(): Promise<void> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return

  try {
    const { data: tokens } = await api.post<{
      success: boolean
      data: AuthTokens
    }>('/auth/refresh', { refreshToken })
    if (!tokens?.success) return
    store.dispatch(setTokens(tokens.data))

    const { data: profile } = await api.get<{
      success: boolean
      data: AuthUser
    }>('/auth/profile')
    if (profile?.success) store.dispatch(setUser(profile.data))
  } catch {
    // invalid/expired refresh token — remain a guest
  }
}