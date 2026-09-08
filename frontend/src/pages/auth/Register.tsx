import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegisterMutation } from '@/services/authApi'
import { selectIsAuthenticated } from '@/store/slices/authSlice'
import { useAppSelector } from '@/store'
import { AuthShell } from '@/pages/auth/AuthShell'

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
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-primary">
        Account
      </p>
      <h1 className="font-serif text-[26px] tracking-tight">Create account</h1>
      <p className="-mt-2 text-sm text-muted-foreground">
        One account for orders, addresses, and reviews.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
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
          {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
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
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
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
          <span className="text-xs text-muted-foreground">min 6 characters</span>
          {errors.password && (
            <span className="text-xs text-destructive">{errors.password}</span>
          )}
        </div>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isLoading}>
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <div className="flex justify-center gap-1.5 border-t pt-4 text-sm text-muted-foreground">
        <span>Already have an account?</span>
        <Link
          to="/auth/login"
          className="font-semibold text-foreground hover:underline underline-offset-[3px]"
        >
          Sign in
        </Link>
      </div>
    </AuthShell>
  )
}