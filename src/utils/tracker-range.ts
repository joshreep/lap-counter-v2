import { RunnerRow } from '@/database/types'

export interface RunnerNumberBounds {
  min: number
  max: number
}

export interface TrackerRangeLimits {
  start: RunnerNumberBounds
  end: RunnerNumberBounds
}

export function getRunnerNumberBounds(runners: Pick<RunnerRow, 'runnerId'>[]) {
  const numbers = runners.map((runner) => Number(runner.runnerId)).filter(Number.isFinite)
  if (numbers.length === 0) return undefined

  return { min: Math.min(...numbers), max: Math.max(...numbers) }
}

/**
 * Start must be between the smallest runner number and End (or the largest runner number if End is unset).
 * End must be between Start (or the smallest runner number if Start is unset) and the largest runner number.
 */
export function getTrackerRangeLimits(
  bounds: RunnerNumberBounds,
  start: number | null,
  end: number | null,
): TrackerRangeLimits {
  return {
    start: { min: bounds.min, max: end ?? bounds.max },
    end: { min: start ?? bounds.min, max: bounds.max },
  }
}

export function validateTrackerRangeValue(
  value: number | null,
  { min, max }: RunnerNumberBounds,
): string | undefined {
  if (value === null) return undefined
  if (!Number.isInteger(value)) return 'Must be a whole number'
  if (value < min) return `Must be at least ${min}`
  if (value > max) return `Must be at most ${max}`
  return undefined
}
