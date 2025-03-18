import { RunnerRow } from '@/database/types'
import { Cell, Row } from './RunnerRowListItem.style'
import { FC } from 'react'
import Link from 'next/link'

type RunnerRowListItemProps = {
  item: RunnerRow
}

const RunnerRowListItem: FC<RunnerRowListItemProps> = ({ item }) => {
  return (
    <Link
      href={{
        pathname: '/edit-modal',
        query: { runnerId: item.runnerId, name: item.name ?? '', lapCount: item.lapCount },
      }}
    >
      <Row>
        <Cell>{item.runnerId}</Cell>
        <Cell $greedy>{item.name}</Cell>
        <Cell>
          {item.lapCount} lap{item.lapCount !== 1 && 's'}
        </Cell>
      </Row>
    </Link>
  )
}

export default RunnerRowListItem
