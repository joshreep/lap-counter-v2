import checkAnimation from '@/animations/check-animation.json'
import loadingAnimation from '@/animations/loading-animation.json'
import { LottieComponentProps } from 'lottie-react'
import { FC, useCallback } from 'react'
import { CheckAnimation, LoadingAnimation } from './styles'

export enum SubmissionState {
  Idle,
  Pending,
  Complete,
  Error,
}

interface SubmitAnimationProps extends Omit<LottieComponentProps, 'source'> {
  submissionState: SubmissionState
  onAnimationFinish: NonNullable<LottieComponentProps['onComplete']>
}

const SubmitAnimation: FC<SubmitAnimationProps> = (props) => {
  const { onAnimationFinish, submissionState } = props
  const onCheckAnimationFinished = useCallback(() => {
    setTimeout(() => {
      onAnimationFinish(undefined)
    }, 150)
  }, [onAnimationFinish])

  if (submissionState === SubmissionState.Pending)
    return <LoadingAnimation animationData={loadingAnimation} />

  if (submissionState === SubmissionState.Complete)
    return <CheckAnimation animationData={checkAnimation} onComplete={onCheckAnimationFinished} />

  return null
}

export default SubmitAnimation
