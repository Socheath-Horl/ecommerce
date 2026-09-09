import { useState } from 'react'
import { Button } from '@/components/ui/button'
import UserTable from '@/components/admin/UserTable'
import { useGetUsersQuery } from '@/services/adminApi'

const PAGE_SIZE = 10

export default function UserList() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useGetUsersQuery({ page, limit: PAGE_SIZE })

  const totalPages = data?.pagination.totalPages ?? 0
  const total = data?.pagination.total ?? 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary">Admin</p>
        <h1 className="font-serif text-[26px] tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">Manage customer accounts and roles.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading users…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load users.</p>
      ) : (
        <>
          <UserTable users={data!.data} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {data?.pagination.page} of {totalPages} ({total} users)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}