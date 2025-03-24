import GlobalContext from '@/context/GlobalContext'
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Mono } from 'next/font/google'
import { FC, PropsWithChildren } from 'react'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Lap Counter',
  description: "An app for counting runner's laps in a race",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lap Counter',
    startupImage: '/splash.png',
  },
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}, ${spaceMono.variable}`}>
        <GlobalContext>{children}</GlobalContext>
      </body>
    </html>
  )
}

export default RootLayout
