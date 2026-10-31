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

  test('is only limited by the smallest runner number when neither value is set', () => {
    expect(getTrackerRangeLimits(bounds, null, null)).toEqual({
      start: { min: 1, max: undefined },
      end: { min: 1, max: undefined },
    })
  })

  test('start is capped by end and end is floored by start', () => {
    expect(getTrackerRangeLimits(bounds, 10, 30)).toEqual({
      start: { min: 1, max: 30 },
      end: { min: 10, max: 49 },
    })
  })

  test('limits the range to 40 runners', () => {
    expect(getTrackerRangeLimits(bounds, 20, null).end).toEqual({ min: 20, max: 59 })
    expect(getTrackerRangeLimits(bounds, null, 80).start).toEqual({ min: 41, max: 80 })
  })

  test('does not limit the range by the largest runner number', () => {
    expect(getTrackerRangeLimits(bounds, 90, null).end).toEqual({ min: 90, max: 129 })
    expect(getTrackerRangeLimits(bounds, null, 150).start).toEqual({ min: 111, max: 150 })
  })

  test('start never goes below the smallest runner number', () => {
    expect(getTrackerRangeLimits(bounds, null, 10).start).toEqual({ min: 1, max: 10 })
  })
})

describe('validateTrackerRangeValue', () => {
  const limits = { min: 5, max: 20 }

  test('allows empty values and values within limits (inclusive)', () => {
    expect(validateTrackerRangeValue(null, limits)).toBeUndefined()
    expect(validateTrackerRangeValue(5, limits)).toBeUndefined()
    expect(validateTrackerRangeValue(20, limits)).toBeUndefined()
  })

  test('has no upper limit when max is unset', () => {
    expect(validateTrackerRangeValue(1000, { min: 5 })).toBeUndefined()
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

  test('an unset end is raised to the start when the start is above every runner', () => {
    expect(getTrackerRunnerNumbers(runners, 15, null)).toEqual([15])
  })

  test('includes numbers that have no runner yet', () => {
    expect(getTrackerRunnerNumbers(runners, 4, 7)).toEqual([4, 5, 6, 7])
    expect(getTrackerRunnerNumbers(runners, 9, null)).toEqual([9, 10])
    expect(getTrackerRunnerNumbers(runners, null, 3)).toEqual([2, 3])
  })

  test('returns nothing when there is no range and no runners', () => {
    expect(getTrackerRunnerNumbers([], null, null)).toEqual([])
  })

  test('shortens ranges longer than 40, keeping the end the user chose', () => {
    const many = [{ runnerId: '1' }, { runnerId: '100' }]
    expect(getTrackerRunnerNumbers(many, null, null)).toHaveLength(40)
    expect(getTrackerRunnerNumbers(many, null, null)[0]).toBe(1)
    expect(getTrackerRunnerNumbers(many, 5, null)[39]).toBe(44)
    expect(getTrackerRunnerNumbers(many, null, 100)[0]).toBe(61)
    expect(getTrackerRunnerNumbers(many, null, 100)[39]).toBe(100)
  })

  test('returns nothing when start is after end', () => {
    expect(getTrackerRunnerNumbers(runners, 8, 3)).toEqual([])
  })
})
