import {
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  Query,
  query,
  setDoc,
} from 'firebase/firestore'
import { InputRunnerRow, QueryStatus, RunnerRow } from './types'
import { useCallback, useEffect, useState } from 'react'
import { AbstractDBService } from './abstract-db-service'

class RunnersServiceSingleton extends AbstractDBService<RunnerRow> {
  private _listQuery: Query

  constructor() {
    super('runners')
    this._listQuery = query(this._collectionRef, orderBy('lapCount', 'desc'))
  }

  get listQuery() {
    return this._listQuery
  }

  async getAll() {
    const querySnapshot = await getDocs(this.listQuery)
    return querySnapshot.docs.map((doc) => doc.data() as RunnerRow)
  }

  async upsert(runner: InputRunnerRow) {
    try {
      const runnerRef = doc(this.collectionRef, runner.runnerId)
      await setDoc(runnerRef, runner, { merge: true })
    } catch (error) {
      console.error(error)
      throw new Error(`Something went wrong trying to update Runner number ${runner.runnerId}.`)
    }
  }

  async delete(runnerId: string) {
    try {
      const runnerRef = doc(this.collectionRef, runnerId)
      await deleteDoc(runnerRef)
    } catch (error) {
      console.error(error)
      throw new Error(`Something went wrong trying to delete Runner number ${runnerId}.`)
    }
  }

  async incrementRunnerLap(runnerId: string) {
    try {
      const runnerRef = doc(this.collectionRef, runnerId)
      await setDoc(runnerRef, { runnerId, lapCount: increment(1) }, { merge: true })
    } catch (error) {
      console.error(error)
      throw new Error(`Something went wrong trying to add a lap to Runner number ${runnerId}.`)
    }
  }
}

const RunnersService = new RunnersServiceSingleton()

export default RunnersService

export function useRunners() {
  const [data, setData] = useState<RunnerRow[]>([])
  const [status, setStatus] = useState(QueryStatus.Loading)

  const refreshData = useCallback(async () => {
    setStatus(QueryStatus.Loading)
    const data = await RunnersService.getAll()
    setStatus(QueryStatus.Idle)
    setData(data)
  }, [])

  useEffect(() => {
    return onSnapshot(RunnersService.listQuery, ({ docs }) => {
      setStatus(QueryStatus.Idle)
      setData(docs.map((doc) => doc.data() as RunnerRow))
    })
  }, [])

  return { data, refreshData, status }
}
