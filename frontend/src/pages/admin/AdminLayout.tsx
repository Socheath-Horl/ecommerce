import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AuthGuard from '@/components/guards/AuthGuard'
import RoleGuard from '@/components/guards/RoleGuard'
import Sidebar, { AdminNav, AdminSidebarFooter } from '@/components/layout/Sidebar'
import { AdminHeader } from '@/components/layout/AdminHeader'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'

export default function AdminLayout() {
  const user = useAppSelector(selectUser)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <AuthGuard>
      <RoleGuard roles={['USER', 'ADMIN']}>
        <div className="flex min-h-screen bg-background">
          <Sidebar role={user?.role} />
          {mobileOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-foreground/35 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 flex w-[min(260px,86vw)] flex-col gap-8 overflow-y-auto border-r border-border bg-background px-4 py-5 shadow-xl lg:hidden">
                <div className="flex items-center justify-between pr-2">
                  <span className="px-2 font-serif text-lg font-semibold tracking-tight">
                    Horizon Supply Co.
                  </span>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="grid size-9 place-items-center rounded-lg text-2xl leading-none text-muted-foreground hover:bg-muted"
                  >
                    ×
                  </button>
                </div>
                <AdminNav role={user?.role} />
                <hr className="mx-2 border-t border-border" />
                <AdminSidebarFooter />
              </div>
            </>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader onOpenMenu={() => setMobileOpen(true)} />
            <main className="px-8 py-8">
              <Outlet />
            </main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  )
}