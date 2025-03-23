import { AuthProvider } from '@/authentication/auth'
import { FC, PropsWithChildren } from 'react'

const GlobalContext: FC<PropsWithChildren> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>
}

export default GlobalContext
