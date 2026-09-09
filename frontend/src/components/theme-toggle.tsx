import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { getTheme, toggleTheme } from '@/lib/theme'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const [theme, setTheme] = useState(getTheme())
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-11 rounded-[10px]"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(toggleTheme())}
    >
      {theme === 'dark' ? <Moon className="h-[18px] w-[18px]" strokeWidth={1.7} /> : <Sun className="h-[18px] w-[18px]" strokeWidth={1.7} />}
    </Button>
  )
}