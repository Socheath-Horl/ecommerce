import { Link } from 'react-router-dom'
import { useAppDispatch } from '@/store'
import { logout } from '@/store/slices/authSlice'

export default function DeniedView({ role }: { role?: string }) {
  const dispatch = useAppDispatch()
  return (
    <div className="denied">
      <div className="denied-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="m6 6 13 13M18 6 5 19" />
        </svg>
      </div>
      <h2>403 — Admin only</h2>
      <p>
        Your role (<span className="num">{role ?? 'USER'}</span>) is not allowed to manage users.
      </p>
      <div className="gate-actions">
        <button className="btn" data-variant="outline" type="button" onClick={() => dispatch(logout())}>
          Sign out
        </button>
        <Link className="btn" data-variant="ghost" to="/admin">
          Dashboard
        </Link>
      </div>
    </div>
  )
}