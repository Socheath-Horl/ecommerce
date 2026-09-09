import { Outlet } from 'react-router-dom'
import AuthGuard from '@/components/guards/AuthGuard'
import RoleGuard from '@/components/guards/RoleGuard'
import Sidebar from '@/components/layout/Sidebar'

export default function AdminLayout() {
  return (
    <AuthGuard>
      <RoleGuard roles={['ADMIN']}>
        <div className="min-h-screen bg-muted/40">
          <Sidebar />
          <main className="lg:pl-60">
            <Outlet />
          </main>
        </div>
      </RoleGuard>
    </AuthGuard>
  )
}