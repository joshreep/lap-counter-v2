import { LottieComponentProps } from 'lottie-react'
import { FC, useCallback } from 'react'
import LoadingAnimation from './LoadingAnimation'
import CheckAnimation from './CheckAnimation'

export enum SubmissionState {
  Idle,
  Pending,
  Complete,
  Error,
}

interface SubmitAnimationProps extends Omit<LottieComponentProps, 'animationData'> {
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

  if (submissionState === SubmissionState.Pending) return <LoadingAnimation />

  if (submissionState === SubmissionState.Complete)
    return <CheckAnimation onComplete={onCheckAnimationFinished} />

  return null
}

export default SubmitAnimation
