import {
  getRunnerNumberBounds,
  getTrackerRangeLimits,
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
