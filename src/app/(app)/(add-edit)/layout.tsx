'use client'

import { PageTitle } from '@/constants/PageTitle'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, PropsWithChildren } from 'react'

type AddEditLayoutProps = PropsWithChildren

const AddEditLayout: FC<AddEditLayoutProps> = ({ children }) => {
  const pathname = usePathname() as keyof typeof PageTitle
  const router = useRouter()

  return (
    <div className="flex flex-col justify-between h-full">
      <header className="flex flex-row gap-4 p-4 items-center justify-between bg-bg">
        <h1 className="text-xl">{PageTitle[pathname]}</h1>
        <button type="button" onClick={router.back} aria-label="close">
          <FontAwesomeIcon icon={faClose} size="xl" fixedWidth />
        </button>
      </header>
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  )
}

export default AddEditLayout
