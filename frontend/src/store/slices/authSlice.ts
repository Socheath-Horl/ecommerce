import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import {
  clearRefreshToken,
  getRefreshToken,
  setRefreshToken,
} from '@/lib/authStorage'

export type Role = 'GUEST' | 'CUSTOMER' | 'USER' | 'ADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: getRefreshToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ user: AuthUser; tokens: AuthTokens }>) {
      state.user = action.payload.user
      state.accessToken = action.payload.tokens.accessToken
      state.refreshToken = action.payload.tokens.refreshToken
      setRefreshToken(action.payload.tokens.refreshToken)
    },
    setTokens(state, action: PayloadAction<AuthTokens>) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      setRefreshToken(action.payload.refreshToken)
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      clearRefreshToken()
    },
  },
})

export const { loginSuccess, setTokens, setUser, logout } = authSlice.actions

export const selectUser = (state: RootState) => state.auth.user
export const selectAccessToken = (state: RootState) => state.auth.accessToken
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.accessToken)

export default authSlice.reducer