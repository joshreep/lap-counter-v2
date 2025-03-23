'use client'

import LoadingAnimation from '@/components/LoadingAnimation'
import RunnerRowListItem from '@/components/RunnerRowListItem'
import { QueryStatus, useRunners } from '@/database/db-service'
import usePrevious from '@joshreep/captain-hooks/dist/usePrevious'
import React, { FC } from 'react'

const ListPage: FC = () => {
  const { data, status } = useRunners()
  const previousStatus = usePrevious(status)

  const isLoading = !previousStatus && status === QueryStatus.Loading

  return (
    <div className="flex flex-col items-center">
      {isLoading && <LoadingAnimation className="w-30 h-30" />}
      <ul className="flex flex-col gap-2 list-none">
        {data.map((runner) => (
          <RunnerRowListItem key={runner.runnerId} item={runner} />
        ))}
      </ul>
    </div>
  )
}

export default ListPage

// const Container = styled(View).attrs({ $rootBackground: true })`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   align-items: center;
//   justify-content: center;
//   padding: 1.25rem;
//   gap: 1.25rem;
// `
