import type { AdminUser } from '@/services/adminApi'

const ROLE_OPTIONS: AdminUser['role'][] = ['CUSTOMER', 'USER', 'ADMIN']

interface UserTableProps {
  users: AdminUser[]
  onRoleChange: (userId: string, role: AdminUser['role']) => void
}

export default function UserTable({ users, onRoleChange }: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Email</th>
            <th className="px-4 py-3 text-left font-medium">Role</th>
            <th className="px-4 py-3 text-left font-medium">Created</th>
            <th className="px-4 py-3 text-left font-medium">Orders</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/40">
              <td className="px-4 py-3 font-medium">{user.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
              <td className="px-4 py-3">
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user.id, e.target.value as AdminUser['role'])}
                  className="rounded-md border bg-background px-2 py-1 text-sm"
                  aria-label={`Change role for ${user.name}`}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{user._count.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}