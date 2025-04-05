import { getAuth } from 'firebase/auth'
import app from '@/config/firebaseConfig'

const auth = getAuth(app)

export default auth
