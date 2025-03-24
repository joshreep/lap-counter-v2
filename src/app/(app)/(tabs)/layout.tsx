'use client'

import TabIcon from '@/components/TabIcon'
import { PageTitle } from '@/constants/PageTitle'
import { faCog, faList, faPersonRunning, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { FC, PropsWithChildren } from 'react'

const TabsLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname() as keyof typeof PageTitle

  const showPlusButton = ['/tracker', '/list'].includes(pathname)

  return (
    <div className="flex flex-col justify-between h-full">
      <header className="flex flex-row gap-4 p-4 items-center justify-between bg-bg">
        <h1 className="text-xl">{PageTitle[pathname]}</h1>
        {showPlusButton && (
          <Link href="/add">
            <FontAwesomeIcon icon={faPlus} size="xl" fixedWidth />
          </Link>
        )}
      </header>
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
      <footer className="flex justify-around border-t-border bg-bg items-end">
        <TabIcon icon={faPersonRunning} path="/tracker" />
        <TabIcon icon={faList} path="/list" />
        <TabIcon icon={faCog} path="/settings" />
      </footer>
    </div>
  )
}

export default TabsLayout
