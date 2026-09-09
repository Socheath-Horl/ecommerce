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
    <div style={{ overflowX: 'auto' }}>
      <table className="tbl">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th className="num" style={{ textAlign: 'right' }}>Orders</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <div className="empty">
                  No users match <code>role={emptyRole}</code>.
                </div>
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isMe = currentUser?.id === user.id
              const isStaff = user.email.toLowerCase().includes('@horizon.supply')
              return (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <span className="initials">{initials(user.name)}</span>
                      <div>
                        <span className="cell-main">
                          {user.name}
                          {isMe && <span className="meta"> (you)</span>}
                        </span>
                        <span className="cell-sub">Joined {rowDate(user.createdAt)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    {user.email}
                    {isStaff && <div className="meta">staff</div>}
                  </td>
                  <td>
                    <RoleSelector user={user} />
                  </td>
                  <td className="num" style={{ textAlign: 'right' }}>
                    {user._count.orders}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}