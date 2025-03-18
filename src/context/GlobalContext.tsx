'use client'

import { AuthProvider } from '@/authentication/auth'
import { useColorScheme } from '@/hooks/useColorScheme'
import DarkTheme from '@/theme/dark-theme'
import LightTheme from '@/theme/light-theme'
import { FC, PropsWithChildren } from 'react'
import { ThemeProvider } from 'styled-components'

const GlobalContext: FC<PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme()

  return (
    <AuthProvider>
      <ThemeProvider theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
        {children}
      </ThemeProvider>
    </AuthProvider>
  )
}

export default GlobalContext
