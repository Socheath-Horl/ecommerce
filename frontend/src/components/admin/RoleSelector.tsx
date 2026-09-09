import type { ChangeEvent } from 'react'
import { toast } from 'sonner'
import { useUpdateUserRoleMutation, type AdminUser } from '@/services/adminApi'

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
    <select
      className="pill-select"
      data-role={user.role}
      aria-label={`Role for ${user.name}`}
      value={user.role}
      onChange={handleChange}
      disabled={disabled}
    >
      {(['CUSTOMER', 'USER', 'ADMIN'] as const).map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  )
}