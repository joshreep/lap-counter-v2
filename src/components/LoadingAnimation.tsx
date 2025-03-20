import animation from '@/animations/loading-animation.json'
import classNames from 'classnames'
import Lottie, { LottieComponentProps } from 'lottie-react'
import React, { FC } from 'react'

type LoadingAnimationProps = Omit<LottieComponentProps, 'animationData'> & {}

const LoadingAnimation: FC<LoadingAnimationProps> = ({ className, ...props }) => {
  return (
    <Lottie
      animationData={animation}
      autoPlay
      className={classNames('w-3xs h-3xs', className)}
      loop
      {...props}
    />
  )
}

export default LoadingAnimation
