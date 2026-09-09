import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store'
import { logout, type Role } from '@/store/slices/authSlice'

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  'aria-hidden': true,
} as const

interface AdminNavItem {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
  adminOnly?: boolean
}

export const NAV_ITEMS: AdminNavItem[] = [
  {
    to: '/admin',
    label: 'Dashboard',
    end: true,
    icon: (
      <svg {...svgProps}>
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    to: '/admin/products',
    label: 'Products',
    icon: (
      <svg {...svgProps}>
        <path d="m6 10 6-4 6 4v7l-6 4-6-4v-7Z" />
        <path d="m6 10 6 4 6-4M12 14v7" />
      </svg>
    ),
  },
  {
    to: '/admin/categories',
    label: 'Categories',
    icon: (
      <svg {...svgProps}>
        <path d="M3 5h7l2 2h9v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
      </svg>
    ),
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg {...svgProps}>
        <path d="M6 8h12l-1 12H7L6 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
  {
    to: '/admin/users',
    label: 'Users',
    adminOnly: true,
    icon: (
      <svg {...svgProps}>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21a7 7 0 0 1 14 0" />
        <path d="M17 8a4 4 0 0 1 0 7M22 21a5 5 0 0 0-3-4.6" />
      </svg>
    ),
  },
]

export function AdminNav({ role, className }: { role?: Role; className?: string }) {
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === 'ADMIN')
  return (
    <nav className={className ?? 'adm-nav'} aria-label="Admin">
      {items.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? 'adm-nav-item is-active' : 'adm-nav-item')}
        >
          {icon}
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AdminSidebarFooter() {
  const dispatch = useAppDispatch()
  return (
    <div className="adm-side-foot">
      <Link className="btn" data-variant="outline" data-size="sm" to="/">
        View Store
      </Link>
      <button
        type="button"
        className="btn"
        data-variant="ghost"
        data-size="sm"
        onClick={() => {
          dispatch(logout())
          toast('Signed out', { description: 'You left the admin portal.' })
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default function Sidebar({ role }: { role?: Role }) {
  return (
    <aside className="adm-side">
      <Link className="adm-logo" to="/admin">
        Horizon Supply Co.
      </Link>
      <AdminNav role={role} />
      <hr className="adm-nav-sep" />
      <AdminSidebarFooter />
    </aside>
  )
}