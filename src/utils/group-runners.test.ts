import { Gender, Grade, RunnerRow } from '@/database/types'
import { groupRunnersByGradeAndGender } from './group-runners'

describe('groupRunnersByGradeAndGender', () => {
  test('should return empty array for empty input', () => {
    expect(groupRunnersByGradeAndGender([])).toEqual([])
  })

  test('should group runners by grade then gender', () => {
    const runners: RunnerRow[] = [
      { runnerId: '1', name: 'Alice', grade: Grade.Third, gender: Gender.Girl, lapCount: 5 },
      { runnerId: '2', name: 'Bob', grade: Grade.Third, gender: Gender.Boy, lapCount: 8 },
      { runnerId: '3', name: 'Charlie', grade: Grade.Fifth, gender: Gender.Boy, lapCount: 10 },
    ]

    const result = groupRunnersByGradeAndGender(runners)

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      grade: Grade.Third,
      gender: Gender.Boy,
      runners: [runners[1]],
    })
    expect(result[1]).toEqual({
      grade: Grade.Third,
      gender: Gender.Girl,
      runners: [runners[0]],
    })
    expect(result[2]).toEqual({
      grade: Grade.Fifth,
      gender: Gender.Boy,
      runners: [runners[2]],
    })
  })

  test('should sort runners within each group by lapCount descending', () => {
    const runners: RunnerRow[] = [
      { runnerId: '1', name: 'Low', grade: Grade.K, gender: Gender.Boy, lapCount: 2 },
      { runnerId: '2', name: 'High', grade: Grade.K, gender: Gender.Boy, lapCount: 10 },
      { runnerId: '3', name: 'Mid', grade: Grade.K, gender: Gender.Boy, lapCount: 5 },
    ]

    const result = groupRunnersByGradeAndGender(runners)

    expect(result).toHaveLength(1)
    expect(result[0].runners.map((r) => r.runnerId)).toEqual(['2', '3', '1'])
  })

  test('should handle runners with undefined gender', () => {
    const runners: RunnerRow[] = [
      { runnerId: '1', name: 'NoGender', grade: Grade.First, lapCount: 3 },
      { runnerId: '2', name: 'HasGender', grade: Grade.First, gender: Gender.Girl, lapCount: 7 },
    ]

    const result = groupRunnersByGradeAndGender(runners)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      grade: Grade.First,
      gender: Gender.Girl,
      runners: [runners[1]],
    })
    expect(result[1]).toEqual({
      grade: Grade.First,
      gender: undefined,
      runners: [runners[0]],
    })
  })

  test('should order grades from Pre-K through 8th then N/A', () => {
    const runners: RunnerRow[] = [
      { runnerId: '1', grade: Grade.Eighth, gender: Gender.Boy, lapCount: 1 },
      { runnerId: '2', grade: Grade.PreK, gender: Gender.Boy, lapCount: 1 },
      { runnerId: '3', grade: Grade.NA, gender: Gender.Boy, lapCount: 1 },
      { runnerId: '4', grade: Grade.K, gender: Gender.Boy, lapCount: 1 },
    ]

    const result = groupRunnersByGradeAndGender(runners)

    expect(result.map((g) => g.grade)).toEqual([Grade.PreK, Grade.K, Grade.Eighth, Grade.NA])
  })

  test('should not create groups for grades with no runners', () => {
    const runners: RunnerRow[] = [
      { runnerId: '1', grade: Grade.Third, gender: Gender.Boy, lapCount: 5 },
    ]

    const result = groupRunnersByGradeAndGender(runners)

    expect(result).toHaveLength(1)
    expect(result[0].grade).toBe(Grade.Third)
  })

  test('should order gender as Boy, Girl, then undefined within a grade', () => {
    const runners: RunnerRow[] = [
      { runnerId: '1', grade: Grade.Second, lapCount: 3 },
      { runnerId: '2', grade: Grade.Second, gender: Gender.Girl, lapCount: 5 },
      { runnerId: '3', grade: Grade.Second, gender: Gender.Boy, lapCount: 4 },
    ]

    const result = groupRunnersByGradeAndGender(runners)

    expect(result).toHaveLength(3)
    expect(result[0].gender).toBe(Gender.Boy)
    expect(result[1].gender).toBe(Gender.Girl)
    expect(result[2].gender).toBeUndefined()
  })
})
