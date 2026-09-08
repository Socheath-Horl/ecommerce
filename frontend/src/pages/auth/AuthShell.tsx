import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-8 py-[13px]">
          <Link
            to="/"
            className="font-serif text-lg font-semibold tracking-tight text-foreground"
          >
            Horizon Supply Co.
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/">Back to store</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-14 md:py-[72px]">
        <div className="flex w-full max-w-[400px] flex-col gap-[18px] rounded-2xl border bg-card p-8 shadow-sm">
          {children}
        </div>
      </main>
      <footer className="border-t py-6 text-center">
        <span className="font-mono text-xs text-muted-foreground">
          Horizon Supply Co. © 2026
        </span>
      </footer>
    </div>
  )
}