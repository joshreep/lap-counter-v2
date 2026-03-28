'use client'

import animation from '@/animations/loading-animation.json'
import classNames from 'classnames'
import { LottieComponentProps } from 'lottie-react'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'

const Lottie = dynamic(() => import('lottie-react').then((mod) => mod.default), { ssr: false })

type LoadingAnimationProps = Omit<LottieComponentProps, 'animationData'> & {}

const LoadingAnimation: FC<LoadingAnimationProps> = ({ className, ...props }) => {
  return (
    <Lottie
      animationData={animation}
      autoPlay={true}
      className={classNames('w-3xs h-3xs', className)}
      loop={true}
      {...props}
    />
  )
}

export default LoadingAnimation
