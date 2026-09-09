interface PagerProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pager({ page, totalPages, onChange }: PagerProps) {
  const pages = Math.max(1, totalPages)
  return (
    <div className="pager">
      <button
        type="button"
        className="pg-btn"
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
          className={pg === page ? 'pg-btn is-active' : 'pg-btn'}
          aria-current={page === pg ? 'page' : undefined}
          onClick={() => onChange(pg)}
        >
          {pg}
        </button>
      ))}
      <button
        type="button"
        className="pg-btn"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        ▶
      </button>
    </div>
  )
}