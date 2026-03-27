import { connectAuthEmulator, getAuth } from 'firebase/auth'
import app from '@/config/firebaseConfig'

const auth = getAuth(app)

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
}

export default auth
