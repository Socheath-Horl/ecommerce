import type { AdminUser } from '@/services/adminApi'
import RoleSelector from '@/components/admin/RoleSelector'

interface UserTableProps {
  users: AdminUser[]
}

export default function UserTable({ users }: UserTableProps) {
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
                <RoleSelector user={user} />
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