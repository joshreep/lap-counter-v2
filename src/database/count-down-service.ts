import { doc, DocumentReference, onSnapshot, setDoc } from 'firebase/firestore'
import DBService from './db-service'
import { useEffect, useState } from 'react'
import { CountDownTimer, QueryStatus } from './types'
import { AbstractDBService } from './abstract-db-service'

class CountDownServiceSingleton extends AbstractDBService<CountDownTimer> {
  private _countDownRef: DocumentReference

  constructor() {
    super('countDowns')
    this._countDownRef = doc(DBService.db, 'countDowns', '1')
  }

  get countDownRef() {
    return this._countDownRef
  }

  async upsertCountDownTimer(time: Date) {
    try {
      await setDoc(this.countDownRef, { time }, { merge: true })
    } catch (error) {
      console.error(error)
      throw new Error('Something went wrong trying to update the countdown timer')
    }
  }
}

const CountDownService = new CountDownServiceSingleton()

export default CountDownService

export function useCountDownTimer() {
  const [countDownTimer, setCountDownTimer] = useState<CountDownTimer>()
  const [status, setStatus] = useState(QueryStatus.Loading)

  useEffect(() => {
    return onSnapshot(CountDownService.countDownRef, (snapshot) => {
      setStatus(QueryStatus.Idle)
      const time = snapshot.get('time').toDate()
      setCountDownTimer({ time })
    })
  }, [])

  return { countDownTimer, status }
}
