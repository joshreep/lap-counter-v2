'use client'

import { QueryStatus, useRunners } from '@/database/db-service'
import usePrevious from '@joshreep/captain-hooks/dist/usePrevious'
import React, { FC } from 'react'
import LoadingAnimation from './LoadingAnimation'
import RunnerRowListItem from './RunnerRowListItem'
import classNames from 'classnames'

type RunnerListProps = {
  clickable?: boolean
  autoScroll?: boolean
}

const RunnerList: FC<RunnerListProps> = ({ autoScroll, clickable = true }) => {
  const { data, status } = useRunners()
  const previousStatus = usePrevious(status)

  const isLoading = !previousStatus && status === QueryStatus.Loading

  return (
    <div className="flex flex-col items-center h-full overflow-auto">
      {isLoading && <LoadingAnimation className="w-30 h-30" />}
      <div
        className={classNames('grid grid-cols-[min-content_auto_min-content] gap-y-2.5 w-full', {
          'animate-auto-scroll': autoScroll,
        })}
      >
        {data.map((runner) => (
          <RunnerRowListItem key={runner.runnerId} item={runner} clickable={clickable} />
        ))}
        {autoScroll &&
          data.map((runner) => (
            <RunnerRowListItem
              key={runner.runnerId + 'scroll'}
              item={runner}
              clickable={clickable}
            />
          ))}
      </div>
    </div>
  )
}

export default RunnerList
