import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAppDispatch, useAppSelector } from '@/store'
import { logout, selectUser } from '@/store/slices/authSlice'
import { NAV_ITEMS } from '@/components/layout/Sidebar'

const TITLES = Object.fromEntries(NAV_ITEMS.map((item) => [item.to, item.label]))

const iconBtnSpring = 'transition-colors hover:bg-muted'
const iconBtnStyles = `grid size-11 place-items-center rounded-[10px] border border-border text-foreground ${iconBtnSpring}`

export function AdminHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const location = useLocation()
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const title = TITLES[location.pathname] ?? 'Admin'

  function handleLogout() {
    setMenuOpen(false)
    dispatch(logout())
    navigate('/')
    toast('Signed out', { description: 'You left the admin portal.' })
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-5 border-b border-border bg-background/90 px-8 py-3 backdrop-blur">
      <button
        className={cn(iconBtnStyles, 'hidden lt900:inline-grid')}
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
        onClick={onOpenMenu}
      >
        <Menu className="h-[18px] w-[18px]" strokeWidth={1.7} />
      </button>
      <h1 className="font-serif text-[22px] font-semibold tracking-[-0.01em]">{title}</h1>
      <div className="ml-auto flex items-center gap-2.5">
        <ThemeToggle />
        <div className="relative">
          <button
            className={iconBtnStyles}
            type="button"
            aria-label="Account menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <UserRound className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[236px] rounded-2xl border border-border bg-background p-2 shadow-soft">
              <div className="mb-1.5 border-b border-border px-3 pb-2.5 pt-2.5">
                <p className="text-[13px] font-medium">{user?.name ?? 'Guest'}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {user ? `${user.role} · ${user.email}` : 'sign in to manage users'}
                </p>
              </div>
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/">View Store</Link>
        </Button>
      </div>
    </header>
  )
}