import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { render } from '@testing-library/react'
import SubmitAnimation, { SubmissionState } from './SubmitAnimation'

type SetupProps = {
  submissionState: SubmissionState
}

function setup({ submissionState }: SetupProps) {
  jest.useFakeTimers()
  const onAnimationFinishMock = jest.fn()
  const container = render(
    <SubmitAnimation submissionState={submissionState} onAnimationFinish={onAnimationFinishMock} />,
  )

  return { ...container, onAnimationFinishMock }
}

forEachTheme((theme) => {
  describe(`${theme} theme`, () => {
    test('should render null when submissionState is Idle', () => {
      const { container, onAnimationFinishMock } = setup({ submissionState: SubmissionState.Idle })
      expect(onAnimationFinishMock).not.toHaveBeenCalled()
      expect(container.firstChild).toBeNull()
    })

    test('should render null when submissionState is Error', () => {
      const { container, onAnimationFinishMock } = setup({ submissionState: SubmissionState.Error })
      expect(onAnimationFinishMock).not.toHaveBeenCalled()
      expect(container.firstChild).toBeNull()
    })

    test('should render LoadingAnimation when submissionState is Pending', () => {
      const { container, onAnimationFinishMock } = setup({
        submissionState: SubmissionState.Pending,
      })
      expect(onAnimationFinishMock).not.toHaveBeenCalled()
      expect(container.firstChild).toMatchSnapshot()
    })

    test('should render CheckAnimation when submissionState is Complete', () => {
      jest.mock('lottie-react')
      const { container, onAnimationFinishMock } = setup({
        submissionState: SubmissionState.Complete,
      })
      expect(container.firstChild).toMatchSnapshot()
      jest.runAllTimers()
      expect(onAnimationFinishMock).toHaveBeenCalled()
    })
  })
})
