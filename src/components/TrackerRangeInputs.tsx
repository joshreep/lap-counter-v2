'use client'

import {
  getRunnerNumberBounds,
  getTrackerRangeLimits,
  validateTrackerRangeValue,
} from '@/utils/tracker-range'
import { useDeviceSettings } from '@/hooks/useDeviceSettings'
import { useRunners } from '@/database/runners-service'
import { FC, useState } from 'react'

type RangeKey = 'trackerRangeStart' | 'trackerRangeEnd'
type Drafts = Record<RangeKey, string>

const parseValue = (raw: string) => (raw === '' ? null : Number(raw))

const TrackerRangeFields: FC<{ initialDrafts: Drafts }> = ({ initialDrafts }) => {
  const { data: runners } = useRunners()
  const { updateDeviceSettings } = useDeviceSettings()
  const [drafts, setDrafts] = useState(initialDrafts)

  const bounds = getRunnerNumberBounds(runners)
  const start = parseValue(drafts.trackerRangeStart)
  const end = parseValue(drafts.trackerRangeEnd)
  const limits = bounds && getTrackerRangeLimits(bounds, start, end)

  const errors = {
    trackerRangeStart: limits && validateTrackerRangeValue(start, limits.start),
    trackerRangeEnd: limits && validateTrackerRangeValue(end, limits.end),
  }

  const handleChange = (key: RangeKey, raw: string) => {
    const nextDrafts = { ...drafts, [key]: raw }
    setDrafts(nextDrafts)

    if (!bounds) return
    const nextStart = parseValue(nextDrafts.trackerRangeStart)
    const nextEnd = parseValue(nextDrafts.trackerRangeEnd)
    const nextLimits = getTrackerRangeLimits(bounds, nextStart, nextEnd)
    const isValid =
      !validateTrackerRangeValue(nextStart, nextLimits.start) &&
      !validateTrackerRangeValue(nextEnd, nextLimits.end)

    if (isValid) {
      updateDeviceSettings({ trackerRangeStart: nextStart, trackerRangeEnd: nextEnd })
    }
  }

  const renderInput = (key: RangeKey, label: string, limit?: { min: number; max: number }) => (
    <div className="flex flex-col gap-1 w-[6.25rem]">
      <input
        id={key}
        aria-label={label}
        aria-invalid={!!errors[key]}
        className="w-full p-4 border-solid bg-input-bg rounded-md h-14"
        disabled={!bounds}
        inputMode="numeric"
        max={limit?.max}
        min={limit?.min}
        onChange={(e) => handleChange(key, e.target.value)}
        placeholder={label}
        step={1}
        type="number"
        value={drafts[key]}
      />
      {errors[key] && <p className="text-error ml-1.5">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="flex flex-col gap-1">
      <span className="ml-1.5">Tracker Range</span>
      <div className="flex items-start gap-3">
        {renderInput('trackerRangeStart', 'Start', limits?.start)}
        <span className="pt-4">-</span>
        {renderInput('trackerRangeEnd', 'End', limits?.end)}
      </div>
      {!bounds && <p className="ml-1.5 text-disabled-text">Add runners to set a range.</p>}
    </div>
  )
}

// Fields mount only after the stored values are read, so they can seed the draft state directly.
const TrackerRangeInputs: FC = () => {
  const { deviceSettings, isLoaded } = useDeviceSettings()
  if (!isLoaded) return null

  return (
    <TrackerRangeFields
      initialDrafts={{
        trackerRangeStart: deviceSettings.trackerRangeStart?.toString() ?? '',
        trackerRangeEnd: deviceSettings.trackerRangeEnd?.toString() ?? '',
      }}
    />
  )
}

export default TrackerRangeInputs
