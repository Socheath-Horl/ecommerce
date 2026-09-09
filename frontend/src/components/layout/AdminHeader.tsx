import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppDispatch, useAppSelector } from '@/store'
import { logout, selectUser } from '@/store/slices/authSlice'
import { NAV_ITEMS } from '@/components/layout/Sidebar'

const TITLES = Object.fromEntries(NAV_ITEMS.map((item) => [item.to, item.label]))

export function AdminHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const location = useLocation()
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const title = TITLES[location.pathname] ?? 'Admin'

  useEffect(() => {
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function handleLogout() {
    setMenuOpen(false)
    dispatch(logout())
    navigate('/')
    toast('Signed out', { description: 'You left the admin portal.' })
  }

  return (
    <header className="adm-head">
      <button
        className="icon-btn icon-btn--bordered menu-btn"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        onClick={onOpenMenu}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <h1 className="adm-title">{title}</h1>
      <div className="adm-head-right">
        <ThemeToggle />
        <div className="usermenu" ref={menuRef}>
          <button
            className="icon-btn icon-btn--bordered"
            type="button"
            aria-label="Account menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M5 20a7 7 0 0 1 14 0" />
            </svg>
          </button>
          {menuOpen && (
            <div className="usermenu-panel">
              <div className="usermenu-head">
                <p>{user?.name ?? 'Guest'}</p>
                <p className="meta">{user ? `${user.role} · ${user.email}` : 'sign in to manage users'}</p>
              </div>
              <Link className="menu-item" to="/admin" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link className="menu-item" to="/profile" onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <button className="menu-item" type="button" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          )}
        </div>
        <Link className="btn" data-variant="outline" data-size="sm" to="/">
          View Store
        </Link>
      </div>
    </header>
  )
}