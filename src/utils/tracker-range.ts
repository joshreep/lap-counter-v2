import { RunnerRow } from '@/database/types'

/** The most runner buttons the tracker grid shows, so they always fit on screen without scrolling. */
export const MAX_TRACKER_RANGE_SIZE = 40

export interface RunnerNumberBounds {
  min: number
  max: number
}

/** An unset `max` means the value has no upper limit */
export interface RangeLimit {
  min: number
  max?: number
}

export interface TrackerRangeLimits {
  start: RangeLimit
  end: RangeLimit
}

export function getRunnerNumberBounds(runners: Pick<RunnerRow, 'runnerId'>[]) {
  const numbers = runners.map((runner) => Number(runner.runnerId)).filter(Number.isFinite)
  if (numbers.length === 0) return undefined

  return { min: Math.min(...numbers), max: Math.max(...numbers) }
}

/**
 * Start must be at least the smallest runner number, and at most End if End is set.
 * End must be at least Start (or the smallest runner number if Start is unset).
 * Neither is limited by the largest runner number, so numbers without a runner yet can be included.
 * The range may span at most MAX_TRACKER_RANGE_SIZE runners.
 */
export function getTrackerRangeLimits(
  bounds: RunnerNumberBounds,
  start: number | null,
  end: number | null,
): TrackerRangeLimits {
  const maxSpan = MAX_TRACKER_RANGE_SIZE - 1

  return {
    start: {
      min: end === null ? bounds.min : Math.max(bounds.min, end - maxSpan),
      max: end ?? undefined,
    },
    end: {
      min: start ?? bounds.min,
      max: start === null ? undefined : start + maxSpan,
    },
  }
}

export function validateTrackerRangeValue(
  value: number | null,
  { min, max }: RangeLimit,
): string | undefined {
  if (value === null) return undefined
  if (!Number.isInteger(value)) return 'Must be a whole number'
  if (value < min) return `Must be at least ${min}`
  if (max !== undefined && value > max) return `Must be at most ${max}`
  return undefined
}

/**
 * Every whole number in the (inclusive) range, whether or not a runner exists for it yet.
 * An unset start falls back to the smallest existing runner number, and an unset end to the largest
 * existing runner number (or the start, if that is higher).
 * Ranges longer than MAX_TRACKER_RANGE_SIZE are shortened to that size.
 */
export function getTrackerRunnerNumbers(
  runners: Pick<RunnerRow, 'runnerId'>[],
  start: number | null,
  end: number | null,
): number[] {
  const bounds = getRunnerNumberBounds(runners)
  let first = start ?? bounds?.min
  if (first === undefined) return []
  let last = end ?? Math.max(bounds?.max ?? first, first)

  if (last - first + 1 > MAX_TRACKER_RANGE_SIZE) {
    // Keep the end the user chose; otherwise keep the start
    if (start === null && end !== null) first = last - (MAX_TRACKER_RANGE_SIZE - 1)
    else last = first + (MAX_TRACKER_RANGE_SIZE - 1)
  }

  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index)
}
