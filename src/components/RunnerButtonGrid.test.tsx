import RunnersService from '@/database/runners-service'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import RunnerButtonGrid, { LAP_DEBOUNCE_MS } from './RunnerButtonGrid'

jest.mock('@/database/runners-service', () => ({
  __esModule: true,
  default: { incrementRunnerLap: jest.fn().mockResolvedValue(undefined) },
  useRunners: () => ({
    status: 'IDLE',
    data: [
      { runnerId: '1', grade: '3', lapCount: 4 },
      { runnerId: '3', grade: '3', lapCount: 0 },
    ],
  }),
}))

jest.mock('@/hooks/useDeviceSettings', () => ({
  useDeviceSettings: () => ({
    isLoaded: true,
    deviceSettings: { useExperimentalTracker: true, trackerRangeStart: 1, trackerRangeEnd: 3 },
  }),
}))

describe('RunnerButtonGrid', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('shows a button for every number in the range, including runners that do not exist yet', () => {
    render(<RunnerButtonGrid />)

    expect(screen.getByRole('button', { name: 'Add a lap for runner 1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add runner 2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add a lap for runner 3' })).toBeTruthy()
  })

  test('only saves the lap once the debounce elapses', () => {
    render(<RunnerButtonGrid />)

    fireEvent.click(screen.getByRole('button', { name: 'Add a lap for runner 1' }))
    expect(screen.getByRole('button', { name: 'Undo lap for runner 1' }).textContent).toContain('5')
    expect(RunnersService.incrementRunnerLap).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(LAP_DEBOUNCE_MS)
    })

    expect(RunnersService.incrementRunnerLap).toHaveBeenCalledWith('1')
    expect(RunnersService.incrementRunnerLap).toHaveBeenCalledTimes(1)
  })

  test('undo cancels the pending lap', () => {
    render(<RunnerButtonGrid />)

    fireEvent.click(screen.getByRole('button', { name: 'Add a lap for runner 1' }))
    fireEvent.click(screen.getByRole('button', { name: 'Undo lap for runner 1' }))
    act(() => {
      jest.advanceTimersByTime(LAP_DEBOUNCE_MS)
    })

    expect(RunnersService.incrementRunnerLap).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Add a lap for runner 1' })).toBeTruthy()
  })

  test('saves pending laps when leaving the page', () => {
    const { unmount } = render(<RunnerButtonGrid />)

    fireEvent.click(screen.getByRole('button', { name: 'Add a lap for runner 3' }))
    unmount()

    expect(RunnersService.incrementRunnerLap).toHaveBeenCalledWith('3')
  })

  test('tapping a number with no runner opens the add form for it', () => {
    render(<RunnerButtonGrid />)

    fireEvent.click(screen.getByRole('button', { name: 'Add runner 2' }))

    expect(useRouter().push).toHaveBeenCalledWith('/add?runnerId=2')
  })
})
