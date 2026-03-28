import { doc, DocumentReference, onSnapshot, setDoc } from 'firebase/firestore'
import DBService from './db-service'
import { useEffect, useState } from 'react'
import { AppSettings, QueryStatus } from './types'
import { AbstractDBService } from './abstract-db-service'

const defaultAppSettings: AppSettings = {
  groupByGradeAndGender: false,
}

class AppSettingsServiceSingleton extends AbstractDBService<AppSettings> {
  private _settingsRef: DocumentReference

  constructor() {
    super('appSettings')
    this._settingsRef = doc(DBService.db, 'appSettings', '1')
  }

  get settingsRef() {
    return this._settingsRef
  }

  async upsertSettings(settings: Partial<AppSettings>) {
    try {
      await setDoc(this.settingsRef, settings, { merge: true })
    } catch (error) {
      console.error(error)
      throw new Error('Something went wrong trying to update app settings')
    }
  }
}

const AppSettingsService = new AppSettingsServiceSingleton()

export default AppSettingsService

export function useAppSettings() {
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings)
  const [status, setStatus] = useState(QueryStatus.Loading)

  useEffect(() => {
    return onSnapshot(AppSettingsService.settingsRef, (snapshot) => {
      setStatus(QueryStatus.Idle)
      if (snapshot.exists()) {
        setAppSettings({ ...defaultAppSettings, ...snapshot.data() } as AppSettings)
      } else {
        setAppSettings(defaultAppSettings)
      }
    })
  }, [])

  return { appSettings, status }
}
