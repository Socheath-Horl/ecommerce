import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import './styles/admin.css'
import './styles/auth.css'
import App from './App.tsx'
import { store } from '@/store'
import { restoreSession } from '@/lib/session'

const restorePromise = restoreSession()

function Root() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    restorePromise.finally(() => {
      if (active) setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Restoring session…
      </div>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </StrictMode>,
)