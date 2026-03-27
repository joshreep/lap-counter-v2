import { Gender, Grade, RunnerRow } from '@/database/types'

export interface RunnerGroup {
  grade: Grade
  gender: Gender | undefined
  runners: RunnerRow[]
}

const gradeOrder: Grade[] = [
  Grade.PreK,
  Grade.K,
  Grade.First,
  Grade.Second,
  Grade.Third,
  Grade.Fourth,
  Grade.Fifth,
  Grade.Sixth,
  Grade.Seventh,
  Grade.Eighth,
  Grade.NA,
]

const genderOrder: (Gender | undefined)[] = [Gender.Boy, Gender.Girl, undefined]

export function groupRunnersByGradeAndGender(runners: RunnerRow[]): RunnerGroup[] {
  const groups: RunnerGroup[] = []

  for (const grade of gradeOrder) {
    for (const gender of genderOrder) {
      const filtered = runners
        .filter((r) => r.grade === grade && r.gender === gender)
        .sort((a, b) => b.lapCount - a.lapCount)

      if (filtered.length > 0) {
        groups.push({ grade, gender, runners: filtered })
      }
    }
  }

  return groups
}
