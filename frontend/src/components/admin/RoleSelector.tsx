import { toast } from 'sonner'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import {
  useUpdateUserRoleMutation,
  type AdminUser,
} from '@/services/adminApi'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ROLE_OPTIONS: AdminUser['role'][] = ['CUSTOMER', 'USER', 'ADMIN']

export default function RoleSelector({ user }: { user: AdminUser }) {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation()
  const currentUser = useAppSelector(selectUser)
  const isSelf = currentUser?.id === user.id

  async function handleChange(role: AdminUser['role']) {
    try {
      await updateUserRole({ id: user.id, role }).unwrap()
      toast.success('Role updated', { description: `${user.email} is now ${role}` })
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Something went wrong'
      toast.error('Role update failed', { description: message })
    }
  }

  return (
    <Select value={user.role} onValueChange={handleChange} disabled={isSelf || isLoading}>
      <SelectTrigger size="sm" className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLE_OPTIONS.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}