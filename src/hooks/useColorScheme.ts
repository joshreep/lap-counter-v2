'use client'

import { useEffect, useState } from 'react'

type ColorScheme = 'light' | 'dark'

function getSystemColorScheme(): ColorScheme {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useColorScheme(): ColorScheme {
  const [systemColorScheme, setSystemColorScheme] = useState(getSystemColorScheme())

  useEffect(() => {
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemColorScheme(event.matches ? 'dark' : 'light')
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeMediaQuery.addEventListener('change', handleChange)

    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  return systemColorScheme
}
