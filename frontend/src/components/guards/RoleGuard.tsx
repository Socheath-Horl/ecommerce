import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { selectUser, type Role } from '@/store/slices/authSlice'

export default function RoleGuard({
  roles,
  children,
}: {
  roles: Role[]
  children: ReactNode
}) {
  const user = useAppSelector(selectUser)

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}