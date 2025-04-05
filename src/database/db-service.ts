import { Firestore, getFirestore } from 'firebase/firestore'
import app from '@/config/firebaseConfig'

class DBServiceSingleton {
  private _db: Firestore

  constructor() {
    this._db = getFirestore(app)
  }

  get db() {
    return this._db
  }
}

const DBService = new DBServiceSingleton()

export default DBService
