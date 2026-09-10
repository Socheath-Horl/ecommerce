export function PasswordToggle({
  show,
  onToggle,
}: {
  show: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className="toggle"
      id="pw-toggle"
      aria-pressed={show}
      aria-label={show ? 'Hide password' : 'Show password'}
      onClick={onToggle}
    >
      <span className="eye" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
      <span className="eye-off" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M4 4l16 16M10.6 10.6a3 3 0 0 0 4.2 4.2" />
          <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-3.2 4.4M6.6 6.6C3.9 8.3 2 12 2 12s3.5 8 10 8a9.5 9.5 0 0 0 4.1-.9" />
        </svg>
      </span>
    </button>
  )
}