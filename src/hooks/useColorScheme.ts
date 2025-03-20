'use client'

import { useEffect, useState } from 'react'

type ColorScheme = 'light' | 'dark'

function getSystemColorScheme(): ColorScheme {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function useColorScheme(): ColorScheme {
  const [systemColorScheme, setSystemColorScheme] = useState<ColorScheme>('light')

  useEffect(() => {
    setSystemColorScheme(getSystemColorScheme())
  }, [])

  useEffect(() => {
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemColorScheme(event.matches ? 'dark' : 'light')
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeMediaQuery.addEventListener('change', handleChange)

    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  console.debug('System color scheme:', systemColorScheme)
  return systemColorScheme
}
