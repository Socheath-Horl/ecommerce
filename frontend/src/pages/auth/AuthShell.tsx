import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/theme-toggle'

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="auth-top">
        <div className="auth-top-inner">
          <Link to="/" className="logo" aria-label="Horizon Supply Co. — home">
            Horizon Supply Co.
          </Link>
          <div className="cluster">
            <ThemeToggle />
            <Link to="/" className="btn" data-variant="ghost">
              Back to store
            </Link>
          </div>
        </div>
      </header>
      <main className="auth-body">{children}</main>
      <footer className="auth-footer">
        <span className="meta">Horizon Supply Co. © 2026</span>
      </footer>
    </div>
  )
}