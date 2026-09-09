import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { selectIsAuthenticated } from '@/store/slices/authSlice'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const authed = useAppSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!authed) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }
  return <>{children}</>
}