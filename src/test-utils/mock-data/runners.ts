import { Gender, Grade, RunnerRow } from '@/database/types'

type DatabaseRecord<T> = T & {
  id: string
}

const mockRunners: DatabaseRecord<RunnerRow>[] = [
  { id: '1', runnerId: '1', name: 'George Washington', grade: Grade.Fifth, gender: Gender.Boy, lapCount: 10 },
  { id: '2', runnerId: '2', name: 'John Adams', grade: Grade.Fourth, gender: Gender.Boy, lapCount: 7 },
  { id: '3', runnerId: '3', name: 'Thomas Jefferson', grade: Grade.Third, gender: Gender.Boy, lapCount: 7 },
  { id: '4', runnerId: '4', name: 'Abraham Lincon', grade: Grade.K, gender: Gender.Girl, lapCount: 5 },
]

export default mockRunners
