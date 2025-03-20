import animation from '@/animations/check-animation.json'
import classNames from 'classnames'
import Lottie, { LottieComponentProps } from 'lottie-react'
import React, { FC } from 'react'

type CheckAnimationProps = Omit<LottieComponentProps, 'animationData'> & {}

const CheckAnimation: FC<CheckAnimationProps> = ({ className, ...props }) => {
  return (
    <Lottie
      animationData={animation}
      autoPlay
      className={classNames('w-3xs h-3xs', className)}
      loop={false}
      {...props}
    />
  )
}

export default CheckAnimation
