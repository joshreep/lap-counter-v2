'use client'

import { useRunners } from '@/database/runners-service'
import { QueryStatus } from '@/database/types'
import { gradeDisplayLabels } from '@/database/types'
import { groupRunnersByGradeAndGender, RunnerGroup } from '@/utils/group-runners'
import usePrevious from '@joshreep/captain-hooks/dist/usePrevious'
import classNames from 'classnames'
import React, { FC } from 'react'
import LoadingAnimation from './LoadingAnimation'
import RunnerRowListItem from './RunnerRowListItem'

type GroupedRunnerListProps = {
  clickable?: boolean
  autoScroll?: boolean
}

function renderGroup(group: RunnerGroup, clickable: boolean, keySuffix = '') {
  const genderLabel = group.gender ? `${group.gender}s` : 'Unspecified'
  const headerText = `${gradeDisplayLabels[group.grade]} - ${genderLabel}`

  return (
    <React.Fragment key={`${group.grade}-${group.gender}${keySuffix}`}>
      <div className="col-span-3 text-tint font-bold py-1.5 px-5 mt-2 first:mt-0">
        {headerText}
      </div>
      {group.runners.map((runner) => (
        <RunnerRowListItem
          key={`${runner.runnerId}${keySuffix}`}
          item={runner}
          clickable={clickable}
        />
      ))}
    </React.Fragment>
  )
}

const GroupedRunnerList: FC<GroupedRunnerListProps> = ({ autoScroll, clickable = true }) => {
  const { data, status } = useRunners()
  const previousStatus = usePrevious(status)

  const isLoading = !previousStatus && status === QueryStatus.Loading
  const groups = groupRunnersByGradeAndGender(data)

  return (
    <div className="flex flex-col items-center h-full overflow-auto">
      {isLoading && <LoadingAnimation className="w-30 h-30" />}
      <div
        className={classNames('grid grid-cols-[min-content_auto_min-content] gap-y-2.5 w-full', {
          'animate-auto-scroll': autoScroll,
        })}
      >
        {groups.map((group) => renderGroup(group, clickable))}
        {autoScroll && groups.map((group) => renderGroup(group, clickable, '-scroll'))}
      </div>
    </div>
  )
}

export default GroupedRunnerList
