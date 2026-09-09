import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import RoleSelector from '@/components/admin/RoleSelector'
import type { AdminUser } from '@/services/adminApi'

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function rowDate(iso: string) {
  return iso.slice(0, 10)
}

export default function UserTable({ users, emptyRole }: { users: AdminUser[]; emptyRole: string }) {
  const currentUser = useAppSelector(selectUser)
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-[0.03em] text-muted-foreground">User</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-[0.03em] text-muted-foreground">Email</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-mono text-xs font-medium uppercase tracking-[0.03em] text-muted-foreground">Role</th>
            <th className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-medium uppercase tracking-[0.03em] text-muted-foreground">Orders</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="px-4 py-12 text-center text-muted-foreground">
                  No users match{' '}
                  <code className="font-mono text-[13px]">role={emptyRole}</code>.
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isMe = currentUser?.id === user.id
              const isStaff = user.email.toLowerCase().includes('@horizon.supply')
              return (
                <tr key={user.id} className="border-b border-border transition-colors last:border-0 hover:bg-accent/60">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-primary/15 font-serif text-[15px] font-semibold text-primary">
                        {initials(user.name)}
                      </span>
                      <div>
                        <span className="font-medium">
                          {user.name}
                          {isMe && <span className="ml-1 font-mono text-xs text-muted-foreground">(you)</span>}
                        </span>
                        <span className="block font-mono text-xs text-muted-foreground">Joined {rowDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {user.email}
                    {isStaff && <div className="font-mono text-xs text-muted-foreground">staff</div>}
                  </td>
                  <td className="px-4 py-3.5">
                    <RoleSelector user={user} />
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums">{user._count.orders}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}