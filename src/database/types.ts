export enum QueryStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Error = 'ERROR',
}

export enum Grade {
  PreK = 'Pre-K',
  K = 'K',
  First = '1',
  Second = '2',
  Third = '3',
  Fourth = '4',
  Fifth = '5',
  Sixth = '6',
  Seventh = '7',
  Eighth = '8',
  NA = 'N/A',
}

export const gradeDisplayLabels: Record<Grade, string> = {
  [Grade.PreK]: 'Pre-K',
  [Grade.K]: 'Kindergarten',
  [Grade.First]: '1st Grade',
  [Grade.Second]: '2nd Grade',
  [Grade.Third]: '3rd Grade',
  [Grade.Fourth]: '4th Grade',
  [Grade.Fifth]: '5th Grade',
  [Grade.Sixth]: '6th Grade',
  [Grade.Seventh]: '7th Grade',
  [Grade.Eighth]: '8th Grade',
  [Grade.NA]: 'N/A',
}

export enum Gender {
  Boy = 'Boy',
  Girl = 'Girl',
}

export interface RunnerRow extends InputRunnerRow {
  lapCount: number
}

export interface InputRunnerRow {
  runnerId: string
  name?: string
  grade: Grade
  gender?: Gender
  lapCount?: number
}

export interface CountDownTimer {
  time: Date
}

export interface AppSettings {
  groupByGradeAndGender: boolean
}
