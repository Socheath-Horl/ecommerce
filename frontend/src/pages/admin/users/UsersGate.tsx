import AdminLayout from '@/pages/admin/AdminLayout'
import UserList from '@/pages/admin/users/UserList'
import DeniedView from '@/components/admin/DeniedView'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'

export default function UsersGate() {
  const user = useAppSelector(selectUser)

  if (user?.role === 'ADMIN') {
    return (
      <AdminLayout>
        <UserList />
      </AdminLayout>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DeniedView role={user?.role} />
    </div>
  )
}