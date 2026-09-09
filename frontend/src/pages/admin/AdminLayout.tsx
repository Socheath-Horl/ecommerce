import type { ReactNode } from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AuthGuard from '@/components/guards/AuthGuard'
import RoleGuard from '@/components/guards/RoleGuard'
import Sidebar, { AdminNav, AdminSidebarFooter } from '@/components/layout/Sidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'

export default function AdminLayout({ children }: { children?: ReactNode }) {
  const user = useAppSelector(selectUser)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AuthGuard>
      <RoleGuard roles={['USER', 'ADMIN']}>
        <div className="adm-shell">
          <Sidebar role={user?.role} />
          {mobileOpen && (
            <>
              <div className="adm-menu-overlay" onClick={() => setMobileOpen(false)} />
              <nav className="adm-panel" aria-label="Admin">
                <div className="adm-panel-head">
                  <span className="adm-logo">Horizon Supply Co.</span>
                  <button
                    className="icon-btn"
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <AdminNav role={user?.role} />
                <hr className="adm-nav-sep" />
                <AdminSidebarFooter />
              </nav>
            </>
          )}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <AdminHeader onOpenMenu={() => setMobileOpen(true)} />
            <main className="adm-main">
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  )
}