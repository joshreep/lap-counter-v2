'use client'

import { AuthContext } from '@/authentication/auth'
import React, { useContext } from 'react'

export default function SettingsPage() {
  const { signOut } = useContext(AuthContext)

  return (
    <div>
      <button type="button" className="bg-error text-white py-3 px-6 rounded-lg" onClick={signOut}>
        Sign Out
      </button>
    </div>
  )
}

// const Container = styled(View).attrs({ $rootBackground: true })`
//   display: flex;
//   flex: 1;
//   align-items: center;
//   justify-content: flex-start;
//   padding: 1.25rem;
//   gap: 1.25rem;
// `
