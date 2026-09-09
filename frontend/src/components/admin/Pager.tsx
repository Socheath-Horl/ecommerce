import { cn } from 'cn'

interface PagerProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pager({ page, totalPages, onChange }: PagerProps) {
  const pages = Math.max(1, totalPages)
  const btnBase =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-border bg-background px-2.5 font-mono text-[13px] text-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className="flex items-center justify-center gap-2 p-3.5">
      <button
        type="button"
        className={btnBase}
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        ◀
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((pg) => (
        <button
          key={pg}
          type="button"
          aria-current={page === pg ? 'page' : undefined}
          onClick={() => onChange(pg)}
          className={cn(
            btnBase,
            page === pg && 'border-primary bg-primary text-primary-foreground hover:border-primary',
          )}
        >
          {pg}
        </button>
      ))}
      <button
        type="button"
        className={btnBase}
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        ▶
      </button>
    </div>
  )
}