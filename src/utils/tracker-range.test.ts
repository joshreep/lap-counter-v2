import {
  getRunnerNumberBounds,
  getTrackerRangeLimits,
  getTrackerRunnerNumbers,
  validateTrackerRangeValue,
} from './tracker-range'

describe('getRunnerNumberBounds', () => {
  test('returns undefined when there are no runners', () => {
    expect(getRunnerNumberBounds([])).toBeUndefined()
  })

  test('returns smallest and largest runner numbers, ignoring non-numeric ids', () => {
    const runners = [{ runnerId: '12' }, { runnerId: '3' }, { runnerId: 'abc' }, { runnerId: '40' }]
    expect(getRunnerNumberBounds(runners)).toEqual({ min: 3, max: 40 })
  })
})

describe('getTrackerRangeLimits', () => {
  const bounds = { min: 1, max: 100 }

  test('uses runner bounds when neither value is set', () => {
    expect(getTrackerRangeLimits(bounds, null, null)).toEqual({
      start: { min: 1, max: 100 },
      end: { min: 1, max: 100 },
    })
  })

  test('start is capped by end and end is floored by start', () => {
    expect(getTrackerRangeLimits(bounds, 10, 50)).toEqual({
      start: { min: 1, max: 50 },
      end: { min: 10, max: 100 },
    })
  })
})

describe('validateTrackerRangeValue', () => {
  const limits = { min: 5, max: 20 }

  test('allows empty values and values within limits (inclusive)', () => {
    expect(validateTrackerRangeValue(null, limits)).toBeUndefined()
    expect(validateTrackerRangeValue(5, limits)).toBeUndefined()
    expect(validateTrackerRangeValue(20, limits)).toBeUndefined()
  })

  test('rejects out of range and non-integer values', () => {
    expect(validateTrackerRangeValue(4, limits)).toBe('Must be at least 5')
    expect(validateTrackerRangeValue(21, limits)).toBe('Must be at most 20')
    expect(validateTrackerRangeValue(6.5, limits)).toBe('Must be a whole number')
  })
})

describe('getTrackerRunnerNumbers', () => {
  const runners = [{ runnerId: '10' }, { runnerId: '2' }, { runnerId: 'abc' }, { runnerId: '5' }]

  test('falls back to the runner bounds when the range is unset', () => {
    expect(getTrackerRunnerNumbers(runners, null, null)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  test('includes numbers that have no runner yet', () => {
    expect(getTrackerRunnerNumbers(runners, 4, 7)).toEqual([4, 5, 6, 7])
    expect(getTrackerRunnerNumbers(runners, 9, null)).toEqual([9, 10])
    expect(getTrackerRunnerNumbers(runners, null, 3)).toEqual([2, 3])
  })

  test('returns nothing when there is no range and no runners', () => {
    expect(getTrackerRunnerNumbers([], null, null)).toEqual([])
  })

  test('returns nothing when start is after end', () => {
    expect(getTrackerRunnerNumbers(runners, 8, 3)).toEqual([])
  })
})
