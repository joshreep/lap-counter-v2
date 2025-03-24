import { RunnerRow } from '@/database/types'
import { FC } from 'react'
import Link from 'next/link'

type RunnerRowListItemProps = {
  item: RunnerRow
}

const RunnerRowListItem: FC<RunnerRowListItemProps> = ({ item }) => {
  return (
    <li>
      <Link
        href={{
          pathname: '/edit',
          query: { runnerId: item.runnerId, name: item.name ?? '', lapCount: item.lapCount },
        }}
        aria-label={`Edit ${item.name}`}
      >
        <div className="flex flex-row w-full justify-between mt-2.5 bg-bg rounded-sm">
          <span className="py-2.5 px-5 grow-0">{item.runnerId}</span>
          <span className="py-2.5 px-5 grow-1">{item.name}</span>
          <span className="py-2.5 px-5 grow-0">
            {item.lapCount} lap{item.lapCount !== 1 && 's'}
          </span>
        </div>
      </Link>
    </li>
  )
}

export default RunnerRowListItem
