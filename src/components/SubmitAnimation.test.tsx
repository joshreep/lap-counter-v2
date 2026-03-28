import { forEachTheme } from '@/test-utils/ThemeWrapper'
import { act, render, waitFor } from '@testing-library/react'
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

    test('should render LoadingAnimation when submissionState is Pending', async () => {
      const { container, onAnimationFinishMock } = setup({
        submissionState: SubmissionState.Pending,
      })
      expect(onAnimationFinishMock).not.toHaveBeenCalled()

      await act(async () => {
        jest.runAllTimers()
      })

      await waitFor(() => {
        expect(container.firstChild).not.toBeNull()
      })

      expect(container.firstChild).toMatchSnapshot()
    })

    test('should render CheckAnimation when submissionState is Complete', async () => {
      const { container, onAnimationFinishMock } = setup({
        submissionState: SubmissionState.Complete,
      })

      await act(async () => {
        jest.runAllTimers()
      })

      await waitFor(() => {
        expect(container.firstChild).not.toBeNull()
      })

      expect(container.firstChild).toMatchSnapshot()

      await act(async () => {
        jest.runAllTimers()
      })

      expect(onAnimationFinishMock).toHaveBeenCalled()
    })
  })
})
