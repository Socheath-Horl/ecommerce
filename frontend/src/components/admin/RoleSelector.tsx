import type { ChangeEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from 'cn'
import { useUpdateUserRoleMutation, type AdminUser } from '@/services/adminApi'

type SelectableRole = 'CUSTOMER' | 'USER' | 'ADMIN'

const ROLE_TINTS: Record<SelectableRole, string> = {
  ADMIN: 'bg-primary/15 text-primary',
  USER: 'bg-chart-3/15 text-chart-3',
  CUSTOMER: 'bg-chart-2/15 text-chart-2',
}

export default function RoleSelector({ user }: { user: AdminUser }) {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation()

  async function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    const role = e.target.value as AdminUser['role']
    try {
      await updateUserRole({ id: user.id, role }).unwrap()
      toast.success(`${user.name} → ${role}`, { description: 'Role updated.' })
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Something went wrong'
      toast.error('Role update failed', { description: message })
    }
  }

  const disabled = isLoading || user.role === 'ADMIN'

  return (
    <span className="relative inline-block">
      <select
        value={user.role}
        onChange={handleChange}
        disabled={disabled}
        aria-label={`Role for ${user.name}`}
        className={cn(
          'h-[34px] cursor-pointer appearance-none rounded-full border border-border py-0 pl-2.5 pr-[30px] font-mono text-xs font-semibold tracking-[0.02em] transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          ROLE_TINTS[user.role as SelectableRole],
        )}
      >
        {(['CUSTOMER', 'USER', 'ADMIN'] as const).map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current" />
    </span>
  )
}