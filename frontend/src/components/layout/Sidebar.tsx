import { Link, NavLink } from 'react-router-dom'
import {
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store'
import { logout, type Role } from '@/store/slices/authSlice'

interface AdminNavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  adminOnly?: boolean
}

export const NAV_ITEMS: AdminNavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/users', label: 'Users', icon: Users, adminOnly: true },
]

export function AdminNav({ role, className }: { role?: Role; className?: string }) {
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === 'ADMIN')
  return (
    <nav className={cn('flex flex-col gap-1', className)} aria-label="Admin">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
            }`
          }
        >
          <Icon className="h-[17px] w-[17px]" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AdminSidebarFooter() {
  const dispatch = useAppDispatch()
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
        <Link to="/">View Store</Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        onClick={() => {
          dispatch(logout())
          toast('Signed out', { description: 'You left the admin portal.' })
        }}
      >
        <LogOut className="size-3.5" />
        Logout
      </Button>
    </div>
  )
}

export default function Sidebar({ role }: { role?: Role }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-8 border-r border-border bg-background px-4 py-5 lg:flex">
      <Link to="/admin" className="px-2 font-serif text-lg font-semibold tracking-tight">
        Horizon Supply Co.
      </Link>
      <AdminNav role={role} />
      <hr className="mx-2 border-t border-border" />
      <AdminSidebarFooter />
    </aside>
  )
}