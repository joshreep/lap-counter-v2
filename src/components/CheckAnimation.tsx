'use client'

import animation from '@/animations/check-animation.json'
import classNames from 'classnames'
import { LottieComponentProps } from 'lottie-react'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type CheckAnimationProps = Omit<LottieComponentProps, 'animationData'> & {}

const CheckAnimation: FC<CheckAnimationProps> = ({ className, ...props }) => {
  return (
    <Lottie
      animationData={animation}
      autoPlay={true}
      className={classNames('w-3xs h-3xs', className)}
      loop={false}
      {...props}
    />
  )
}

export default CheckAnimation
