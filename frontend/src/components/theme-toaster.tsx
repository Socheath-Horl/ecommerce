import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import { getTheme } from '@/lib/theme'

export function ThemeToaster() {
  const [theme, setTheme] = useState(getTheme())
  useEffect(() => {
    const onChange = () => setTheme(getTheme())
    window.addEventListener('ui:themechange', onChange)
    return () => window.removeEventListener('ui:themechange', onChange)
  }, [])
  return <Toaster position="bottom-right" theme={theme} />
}