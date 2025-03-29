import { RunnerRow } from '@/database/types'
import classNames from 'classnames'
import Link from 'next/link'
import { ComponentProps, FC, PropsWithChildren } from 'react'

type RunnerRowListItemProps = {
  clickable: boolean
  item: RunnerRow
}

const RunnerRowListItem: FC<RunnerRowListItemProps> = ({ clickable, item }) => {
  return (
    <>
      <EditLink clickable={clickable} runner={item} className="rounded-l-sm">
        {item.runnerId}
      </EditLink>
      <EditLink clickable={clickable} runner={item}>
        {item.name}
      </EditLink>
      <EditLink clickable={clickable} runner={item} className="rounded-r-sm whitespace-nowrap">
        {item.lapCount} lap{item.lapCount !== 1 && 's'}
      </EditLink>
    </>
  )
}

interface EditLinkProps extends PropsWithChildren<Omit<ComponentProps<typeof Link>, 'href'>> {
  clickable: boolean
  runner: RunnerRow
}

const EditLink: FC<EditLinkProps> = ({ children, className, clickable, runner, ...props }) => (
  <Link
    {...props}
    className={classNames('bg-bg py-2.5 px-5', className)}
    href={clickable ? { pathname: '/edit', query: { ...runner } } : '#'}
    scroll={clickable ? true : false}
  >
    {children}
  </Link>
)

export default RunnerRowListItem
