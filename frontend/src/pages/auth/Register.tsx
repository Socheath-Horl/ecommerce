import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useRegisterMutation } from '@/services/authApi'
import { selectIsAuthenticated } from '@/store/slices/authSlice'
import { useAppSelector } from '@/store'
import { AuthShell } from '@/pages/auth/AuthShell'
import { PasswordToggle } from '@/pages/auth/PasswordToggle'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const navigate = useNavigate()
  const authed = useAppSelector(selectIsAuthenticated)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
  }>({})
  const [register, { isLoading }] = useRegisterMutation()

  if (authed) return <Navigate to="/" replace />

  function validate(): boolean {
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Name is required.'
    else if (name.trim().length > 80) next.name = 'Name must be 80 characters or fewer.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.'
    else if (password.length > 72) next.password = 'Password must be 72 characters or fewer.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    try {
      await register({ name: name.trim(), email: email.trim(), password }).unwrap()
      toast.success('Account created', {
        description: 'Sign in with your new credentials.',
      })
      navigate('/auth/login')
    } catch (err) {
      const message = (err as { message?: string })?.message ?? 'Something went wrong'
      const status = (err as { status?: number })?.status
      if (status === 409) {
        setErrors((s) => ({ ...s, email: 'Email already exists.' }))
        toast.error('409 · Email already exists', {
          description: 'Try signing in or use another email.',
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
        <h1>Create account</h1>
        <p className="sub">One account for orders, addresses, and reviews.</p>

        <div className="field">
          <label htmlFor="name">
            Name <span className="req">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            maxLength={80}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrors((s) => ({ ...s, name: undefined }))
            }}
            aria-invalid={Boolean(errors.name)}
          />
          <span className="err">{errors.name ?? ''}</span>
        </div>

        <div className="field">
          <label htmlFor="email">
            Email <span className="req">*</span>
          </label>
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
          <label htmlFor="password">
            Password <span className="req">*</span>
          </label>
          <div className="password-wrap" aria-invalid={Boolean(errors.password)}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={6}
              maxLength={72}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((s) => ({ ...s, password: undefined }))
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="pw-toggle pw-hint"
            />
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((v) => !v)} />
          </div>
          <span className="hint" id="pw-hint">
            min 6 characters
          </span>
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
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>

        <div className="auth-foot">
          <span>Already have an account?</span>
          <Link to="/auth/login">Sign in →</Link>
        </div>
      </form>
    </AuthShell>
  )
}