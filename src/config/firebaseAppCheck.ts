'use client'

import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import app from './firebaseConfig'

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'true') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  })
}
