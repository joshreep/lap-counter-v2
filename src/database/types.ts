export enum QueryStatus {
  Idle = 'IDLE',
  Loading = 'LOADING',
  Error = 'ERROR',
}

export interface RunnerRow extends InputRunnerRow {
  lapCount: number
}

export interface InputRunnerRow {
  runnerId: string
  name?: string
  lapCount?: number
}

export interface CountDownTimer {
  time: Date
}
