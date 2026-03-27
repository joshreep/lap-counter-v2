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
