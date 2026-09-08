import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-24 text-center">
      <h1 className="font-serif text-5xl">404 — Page not found</h1>
      <Button asChild className="mt-8">
        <Link to="/">Go home</Link>
      </Button>
    </main>
  )
}