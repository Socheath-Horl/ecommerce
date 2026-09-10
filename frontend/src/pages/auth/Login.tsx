import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useLoginMutation } from '@/services/authApi'
import { loginSuccess, selectIsAuthenticated } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { AuthShell } from '@/pages/auth/AuthShell'
import { PasswordToggle } from '@/pages/auth/PasswordToggle'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const authed = useAppSelector(selectIsAuthenticated)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [login, { isLoading }] = useLoginMutation()

  if (authed) return <Navigate to="/" replace />

  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  function validate(): boolean {
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    try {
      const data = await login({ email: email.trim(), password }).unwrap()
      dispatch(
        loginSuccess({
          user: data.user,
          tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken },
        }),
      )
      toast.success('Welcome back', { description: `Signed in as ${data.user.email}` })
      navigate(from, { replace: true })
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Something went wrong'
      const status = (err as { status?: number })?.status
      if (status === 401) {
        setErrors({ password: 'Invalid email or password.' })
        toast.error('401 · Invalid email or password', {
          description: 'Check your credentials and try again.',
        })
      } else {
        toast.error(status ? `${status} · Error` : 'Error', { description: message })
      }
    }
  }

  return (
    <AuthShell>
      <form className="auth-card" noValidate onSubmit={handleSubmit}>
        <p className="eyebrow">Account</p>
        <h1>Sign in</h1>
        <p className="sub">Welcome back — your cart and orders are waiting.</p>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={255}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((s) => ({ ...s, email: undefined }))
            }}
            aria-invalid={Boolean(errors.email)}
          />
          <span className="err">{errors.email ?? ''}</span>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="password-wrap" aria-invalid={Boolean(errors.password)}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              maxLength={72}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((s) => ({ ...s, password: undefined }))
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="pw-toggle"
            />
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
          <span className="err">{errors.password ?? ''}</span>
        </div>

        <button
          className="btn btn--block"
          data-variant="default"
          data-size="lg"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>

        <div className="auth-foot">
          <span>No account?</span>
          <Link to="/auth/register">Create one</Link>
        </div>
      </form>
    </AuthShell>
  )
}