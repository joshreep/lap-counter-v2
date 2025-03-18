import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Mono } from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from '@/lib/registry'
import GlobalContext from '@/context/GlobalContext'
import { FC, PropsWithChildren } from 'react'

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
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}, ${spaceMono.variable}`}>
        <GlobalContext>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </GlobalContext>
      </body>
    </html>
  )
}

export default RootLayout
