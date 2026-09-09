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
        <div className="flex min-h-screen bg-background">
          <Sidebar role={user?.role} />
          {mobileOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-foreground/35"
                onClick={() => setMobileOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-50 flex w-[min(260px,86vw)] flex-col gap-8 overflow-y-auto border-r border-border bg-background px-4 py-5 shadow-soft">
                <div className="flex items-center justify-between pr-2">
                  <span className="px-2 font-serif text-lg font-semibold tracking-[-0.01em]">
                    Horizon Supply Co.
                  </span>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="grid size-11 place-items-center rounded-[10px] text-2xl leading-none text-muted-foreground transition-colors hover:bg-muted"
                  >
                    ×
                  </button>
                </div>
                <AdminNav role={user?.role} />
                <div className="mt-auto flex flex-col gap-8">
                  <hr className="mx-2 border-t border-border" />
                  <AdminSidebarFooter />
                </div>
              </div>
            </>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader onOpenMenu={() => setMobileOpen(true)} />
            <main className="px-8 pb-14 pt-8">
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  )
}