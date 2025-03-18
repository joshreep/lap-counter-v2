'use client'

import { View } from '@/components/Themed'
import { SplashScreenImage } from './styles'

export default function Home() {
  return (
    <View $rootBackground>
      <SplashScreenImage
        src="/images/splash.png"
        alt="Splash Screen Image"
        height={2778}
        width={1284}
      />
    </View>
  )
}
