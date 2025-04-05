'use client'

import { AuthContext } from '@/authentication/auth'
import InputGroup from '@/components/form/InputGroup'
import CountDownService, { useCountDownTimer } from '@/database/count-down-service'
import { addMinutes, differenceInMinutes, format } from 'date-fns'
import React, { FocusEventHandler, useCallback, useContext, useEffect, useState } from 'react'

export default function SettingsPage() {
  const { signOut } = useContext(AuthContext)

  const { countDownTimer } = useCountDownTimer()

  const [countDownToTime, setCountDownToTime] = useState<Date>(
    countDownTimer?.time ?? addMinutes(Date.now(), 60),
  )
  const [countDownForMinutes, setCountDownForMinutes] = useState(() => {
    if (countDownTimer?.time) {
      return differenceInMinutes(countDownTimer.time, Date.now())
    } else {
      return 60
    }
  })

  useEffect(() => {
    if (countDownTimer?.time) {
      setCountDownToTime(countDownTimer.time)
      setCountDownForMinutes(differenceInMinutes(countDownTimer.time, Date.now()))
    }
  }, [countDownTimer?.time])

  const handleTimeInputChange: FocusEventHandler<HTMLInputElement> = useCallback(() => {
    if (countDownToTime) {
      const date = new Date()
      date.setSeconds(0)
      date.setMilliseconds(0)
      date.setHours(countDownToTime.getUTCHours())
      date.setMinutes(countDownToTime.getUTCMinutes())
      CountDownService.upsertCountDownTimer(date)
    }
  }, [countDownToTime])

  const handleMinutesInputChange: FocusEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.target.valueAsNumber) {
      CountDownService.upsertCountDownTimer(addMinutes(Date.now(), e.target.valueAsNumber))
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl">Reset Count Down Timer</h2>
      <form className="flex flex-col md:w-xl w-full pb-8 gap-4">
        <InputGroup
          id="countDownToTime"
          inputClassName="h-14"
          label="Count Down to Local Time"
          // max="23:59"
          // min="00:00"
          onBlur={handleTimeInputChange}
          onChange={(e) => e.target.valueAsDate && setCountDownToTime(e.target.valueAsDate)}
          type="time"
          value={format(countDownToTime, 'HH:mm')}
        />
        <InputGroup
          id="countDownForTime"
          inputClassName="h-14"
          inputMode="decimal"
          label="Count Down for Time in minutes"
          onBlur={handleMinutesInputChange}
          onChange={(e) => e.target.valueAsNumber && setCountDownForMinutes(e.target.valueAsNumber)}
          pattern="\d*\.?\d*"
          type="number"
          value={countDownForMinutes > 0 ? countDownForMinutes : ''}
          // min={0}
          // max={480}
        />
      </form>
      <h2 className="text-3xl">Manage Account</h2>
      <div>
        <button
          type="button"
          className="bg-error text-white py-3 px-6 rounded-lg"
          onClick={signOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
