import Lottie, { LottieComponentProps } from 'lottie-react'
import { useEffect } from 'react'

const MockLottieView = ({ onComplete, ...props }: LottieComponentProps) => {
  useEffect(() => {
    onComplete?.(undefined)
  }, [onComplete])

  return <Lottie {...props} />
}

export default MockLottieView
