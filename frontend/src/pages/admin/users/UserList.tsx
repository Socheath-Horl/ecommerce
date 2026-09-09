import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserTable from '@/components/admin/UserTable'
import Pager from '@/components/admin/Pager'
import { useGetUsersQuery } from '@/services/adminApi'
import { type Role } from '@/store/slices/authSlice'

const PAGE_SIZE = 10
const ROLE_FILTERS = ['ALL', 'ADMIN', 'USER', 'CUSTOMER'] as const
type RoleFilter = (typeof ROLE_FILTERS)[number]

export default function UserList() {
  const [page, setPage] = useState(1)
  const [role, setRole] = useState<RoleFilter>('ALL')
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [role, debounced])

  const { data, isLoading, isError } = useGetUsersQuery({
    page,
    limit: PAGE_SIZE,
    role: role === 'ALL' ? undefined : (role as Role),
    search: debounced.trim() || undefined,
  })

  const total = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 0

  return (
    <div className="flex flex-col gap-5">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-[0.03em] text-muted-foreground"
      >
        <Link to="/admin" className="transition-colors hover:text-foreground">Admin</Link>
        <span>/</span>
        <span aria-current="page">Users</span>
      </nav>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5">
        <label htmlFor="role-filter" className="text-[13px] text-muted-foreground">Role</label>
        <select
          id="role-filter"
          value={role}
          onChange={(e) => setRole(e.target.value as RoleFilter)}
          className="h-10 rounded-[10px] border border-border bg-background px-2.5 text-sm text-foreground transition-colors hover:border-foreground"
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r} value={r}>{r === 'ALL' ? 'All' : r}</option>
          ))}
        </select>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          aria-label="Search users"
          className="h-10 flex-[0_0_240px] max-w-full rounded-[10px] border border-border bg-background px-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground hover:border-foreground"
        />
        <span className="ml-auto font-mono text-[13px] text-muted-foreground">
          {total} user{total === 1 ? '' : 's'}
        </span>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
        {isLoading && !data ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Loading users…</div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-destructive">Failed to load users.</div>
        ) : (
          <>
            <UserTable users={data!.data} emptyRole={role} />
            {data!.data.length > 0 && <Pager page={page} totalPages={totalPages} onChange={setPage} />}
          </>
        )}
      </section>
    </div>
  )
}