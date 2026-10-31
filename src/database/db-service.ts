import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore'
import app from '@/config/firebaseConfig'

class DBServiceSingleton {
  private _db: Firestore

  constructor() {
    this._db = getFirestore(app)
    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
      connectFirestoreEmulator(this._db, '127.0.0.1', 8080)
    }
  }

  get db() {
    return this._db
  }
}

const DBService = new DBServiceSingleton()

export default DBService
