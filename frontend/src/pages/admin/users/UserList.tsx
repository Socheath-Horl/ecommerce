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
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li aria-current="page">Users</li>
        </ol>
      </nav>

      <div className="filters">
        <label htmlFor="role-filter">Role</label>
        <select
          className="filter"
          id="role-filter"
          value={role}
          onChange={(e) => setRole(e.target.value as RoleFilter)}
        >
          {ROLE_FILTERS.map((r) => (
            <option key={r} value={r}>
              {r === 'ALL' ? 'All' : r}
            </option>
          ))}
        </select>
        <input
          className="filter filter--search"
          type="search"
          id="user-search"
          placeholder="Search name or email…"
          aria-label="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="meta" style={{ marginLeft: 'auto' }}>
          {total} user{total === 1 ? '' : 's'}
        </span>
      </div>

      <section className="table-card">
        {isLoading && !data ? (
          <div className="empty">Loading users…</div>
        ) : isError ? (
          <div className="empty">Failed to load users.</div>
        ) : (
          <>
            <UserTable users={data!.data} emptyRole={role} />
            {data!.data.length > 0 && <Pager page={page} totalPages={totalPages} onChange={setPage} />}
          </>
        )}
      </section>
    </>
  )
}