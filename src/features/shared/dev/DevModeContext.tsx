'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface DevModeContextType {
  sqlModeEnabled: boolean
  toggleSqlMode: () => void
}

const DevModeContext = createContext<DevModeContextType | null>(null)

const STORAGE_KEY = 'dev:sqlModeEnabled'

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [sqlModeEnabled, setSqlModeEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR hydration: sync state from localStorage after mount
      setSqlModeEnabled(stored === 'true')
    }
    setMounted(true)
  }, [])

  const toggleSqlMode = () => {
    setSqlModeEnabled((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  const value: DevModeContextType = {
    sqlModeEnabled: mounted ? sqlModeEnabled : true,
    toggleSqlMode,
  }

  return (
    <DevModeContext.Provider value={value}>
      {children}
    </DevModeContext.Provider>
  )
}

export function useDevMode(): DevModeContextType {
  const context = useContext(DevModeContext)
  if (!context) {
    return { sqlModeEnabled: false, toggleSqlMode: () => {} }
  }
  return context
}
