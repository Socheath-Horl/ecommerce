import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginMutation } from '@/services/authApi'
import { loginSuccess, selectIsAuthenticated } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { AuthShell } from '@/pages/auth/AuthShell'

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
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary">
        Account
      </p>
      <h1 className="font-serif text-[26px] tracking-tight">Sign in</h1>
      <p className="-mt-2 text-sm text-muted-foreground">
        Welcome back — your cart and orders are waiting.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
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
          {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
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
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password && (
            <span className="text-xs text-destructive">{errors.password}</span>
          )}
        </div>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="flex justify-center gap-1.5 border-t pt-4 text-sm text-muted-foreground">
        <span>No account?</span>
        <Link
          to="/auth/register"
          className="font-semibold text-foreground hover:underline underline-offset-[3px]"
        >
          Create one
        </Link>
      </div>
    </AuthShell>
  )
}