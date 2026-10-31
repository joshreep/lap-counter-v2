'use client'

import GroupedRunnerList from '@/components/GroupedRunnerList'
import RunnerList from '@/components/RunnerList'
import { useAppSettings } from '@/database/app-settings-service'
import { useCountDownTimer } from '@/database/count-down-service'
import usePreciseTimer from '@/hooks/usePreciseTimer'
import { useViewport } from '@/utils/viewport-utils'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect } from 'react'

const TVPage: FC = () => {
  const { appSettings } = useAppSettings()
  const { countDownTimer } = useCountDownTimer()
  const remainingTime = usePreciseTimer(countDownTimer?.time.getTime() ?? Date.now())

  const router = useRouter()
  const width = useViewport()

  useEffect(() => {
    const defaultFontSize = document.body.style.fontSize
    document.body.style.fontSize = `${(width / 1920) * 40}px`

    return () => {
      document.body.style.fontSize = defaultFontSize
    }
  }, [width])

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      debugger
      console.log(event)
      if (event.key === 'Escape') router.back()
    }
    document.addEventListener('keydown', listener)

    return document.removeEventListener('keydown', listener)
  }, [router])

  return (
    <div className="p-4 flex h-full justify-around items-center">
      {appSettings.groupByGradeAndGender ? (
        <GroupedRunnerList clickable={false} autoScroll />
      ) : (
        <RunnerList clickable={false} autoScroll />
      )}
      <div className="text-[20rem]">{remainingTime}</div>
    </div>
  )
}

export default TVPage
