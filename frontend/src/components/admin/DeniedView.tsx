import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store'
import { logout } from '@/store/slices/authSlice'

export default function DeniedView({ role }: { role?: string }) {
  const dispatch = useAppDispatch()
  return (
    <div className="mx-auto my-16 max-w-[460px] rounded-2xl border border-border bg-background p-10 text-center shadow-sm">
      <div className="mx-auto grid size-[60px] place-items-center rounded-full bg-destructive/15 text-destructive">
        <ShieldX className="h-[30px] w-[30px]" />
      </div>
      <h2 className="mt-6 mb-1 font-serif text-2xl">403 — Admin only</h2>
      <p className="text-sm text-muted-foreground">
        Your role (<span className="font-mono tabular-nums">{role ?? 'USER'}</span>) is not allowed to manage users.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={() => dispatch(logout())}>Sign out</Button>
        <Button variant="ghost" asChild>
          <Link to="/admin">Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}