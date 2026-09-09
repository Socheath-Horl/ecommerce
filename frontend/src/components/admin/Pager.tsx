import { cn } from 'cn'

interface PagerProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pager({ page, totalPages, onChange }: PagerProps) {
  const pages = Math.max(1, totalPages)
  return (
    <div className="flex items-center justify-center gap-2 p-3.5">
      <button
        type="button"
        className="grid min-w-9 place-items-center border border-border bg-background p-2 font-mono text-[13px] text-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40"
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
            'grid min-w-9 place-items-center border border-border bg-background p-2 font-mono text-[13px] text-foreground transition-colors hover:border-foreground',
            page === pg && 'border-primary bg-primary text-primary-foreground hover:border-primary',
          )}
        >
          {pg}
        </button>
      ))}
      <button
        type="button"
        className="grid min-w-9 place-items-center border border-border bg-background p-2 font-mono text-[13px] text-foreground transition-colors hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        ▶
      </button>
    </div>
  )
}