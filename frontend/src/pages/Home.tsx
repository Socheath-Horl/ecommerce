import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-16 text-center">
      <h1 className="font-serif text-5xl tracking-tight">Horizon Supply Co.</h1>
      <p className="mt-4 text-muted-foreground">Premium equipment and supplies.</p>
      <Button asChild className="mt-8">
        <Link to="/products">Browse products</Link>
      </Button>
    </main>
  )
}