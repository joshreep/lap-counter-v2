import { PageTitle } from '@/constants/PageTitle'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { FC } from 'react'

type TabIconProps = {
  icon: IconProp
  path: keyof typeof PageTitle
}

const TabIcon: FC<TabIconProps> = ({ icon, path }) => {
  const pathname = usePathname() as keyof typeof PageTitle

  return (
    <Link
      className={classNames('flex flex-col py-4 px-8 items-center gap-1 text-sm', {
        'text-tint': pathname === path,
      })}
      href={path}
    >
      <FontAwesomeIcon icon={icon} size="xl" fixedWidth />
      {PageTitle[path]}
    </Link>
  )
}

export default TabIcon
