import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-background lg:flex lg:flex-col">
        <p className="px-6 py-4 font-serif text-lg">Admin</p>
      </aside>
      <main className="lg:pl-60">
        <Outlet />
      </main>
    </div>
  )
}