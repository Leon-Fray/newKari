'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'

interface ThemeContextType {
  isPractitioner: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()
  
  const isPractitioner = profile?.role === 'practitioner'

  useEffect(() => {
    // Update CSS custom properties based on user role
    const root = document.documentElement
    
    if (isPractitioner) {
      // Green accent for practitioners (#8cc342)
      root.style.setProperty('--primary', '88 50% 50%')
      root.style.setProperty('--ring', '88 50% 50%')
    } else {
      // Teal accent for patients (#1cabb0)
      root.style.setProperty('--primary', '182 73% 41%')
      root.style.setProperty('--ring', '182 73% 41%')
    }
  }, [isPractitioner])

  const value = {
    isPractitioner
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
