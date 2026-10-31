'use client'

import RunnersService, { useRunners } from '@/database/runners-service'
import { QueryStatus } from '@/database/types'
import { useDeviceSettings } from '@/hooks/useDeviceSettings'
import { useElementSize } from '@/hooks/useElementSize'
import { getGridLayout } from '@/utils/tracker-grid'
import { getTrackerRunnerNumbers } from '@/utils/tracker-range'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const LAP_DEBOUNCE_MS = 5000
const LAP_DEBOUNCE_SECONDS = LAP_DEBOUNCE_MS / 1000
const GRID_GAP_PX = 12

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Dims the button and fills it left to right over the debounce, like a progress bar. */
const DebounceProgress: FC = () => {
  const fillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const animation = fillRef.current?.animate?.(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: LAP_DEBOUNCE_MS, easing: 'linear', fill: 'forwards' },
    )
    return () => animation?.cancel()
  }, [])

  return (
    <>
      <span aria-hidden className="absolute inset-0 bg-black/45" />
      <span
        aria-hidden
        className="absolute inset-0 bg-secondary"
        ref={fillRef}
        style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
      />
    </>
  )
}

const RunnerButtonGrid: FC = () => {
  const router = useRouter()
  const { ref: gridAreaRef, size: gridArea } = useElementSize<HTMLDivElement>()
  const { data: runners, status } = useRunners()
  const { deviceSettings, isLoaded } = useDeviceSettings()
  const [pending, setPending] = useState<Record<string, true>>({})
  const [error, setError] = useState<string>()
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  // Laps still waiting out their debounce are committed rather than lost when leaving the page
  useEffect(() => {
    const pendingTimers = timers.current
    return () => {
      pendingTimers.forEach((timer, runnerId) => {
        clearTimeout(timer)
        RunnersService.incrementRunnerLap(runnerId).catch(console.error)
      })
      pendingTimers.clear()
    }
  }, [])

  const clearPending = useCallback((runnerId: string) => {
    setPending((prev) => {
      const next = { ...prev }
      delete next[runnerId]
      return next
    })
  }, [])

  const startPending = useCallback(
    (runnerId: string) => {
      setError(undefined)
      setPending((prev) => ({ ...prev, [runnerId]: true }))
      timers.current.set(
        runnerId,
        setTimeout(async () => {
          timers.current.delete(runnerId)
          clearPending(runnerId)
          try {
            await RunnersService.incrementRunnerLap(runnerId)
          } catch (e) {
            console.error(e)
            setError(e instanceof Error ? e.message : 'Something went wrong adding a lap.')
          }
        }, LAP_DEBOUNCE_MS),
      )
    },
    [clearPending],
  )

  const undoPending = useCallback(
    (runnerId: string) => {
      clearTimeout(timers.current.get(runnerId))
      timers.current.delete(runnerId)
      clearPending(runnerId)
    },
    [clearPending],
  )

  const runnersByNumber = useMemo(
    () => new Map(runners.map((runner) => [Number(runner.runnerId), runner])),
    [runners],
  )

  const handleClick = (runnerNumber: number) => {
    const runner = runnersByNumber.get(runnerNumber)
    if (!runner) return router.push(`/add?runnerId=${runnerNumber}`)

    if (pending[runner.runnerId]) undoPending(runner.runnerId)
    else startPending(runner.runnerId)
  }

  if (!isLoaded || status === QueryStatus.Loading) return null

  const runnerNumbers = getTrackerRunnerNumbers(
    runners,
    deviceSettings.trackerRangeStart,
    deviceSettings.trackerRangeEnd,
  )

  const layout = getGridLayout(runnerNumbers.length, gridArea.width, gridArea.height, GRID_GAP_PX)
  const cellSize = Math.min(layout.cellWidth, layout.cellHeight)

  if (runnerNumbers.length === 0) {
    return (
      <p className="text-center text-lg text-disabled-text">
        No runners in the selected tracker range.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <p className="text-left text-sm text-disabled-text">
        Tap a number to count a lap. The button fills in green over {LAP_DEBOUNCE_SECONDS} seconds,
        and you can tap it again any time before it finishes to undo. Gray numbers aren&apos;t
        registered yet. Tap one to add that runner.
      </p>
      {error && <p className="text-error text-center">{error}</p>}
      <div className="flex-1 min-h-0" ref={gridAreaRef}>
        <div
          className="grid"
          style={{
            gap: GRID_GAP_PX,
            gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
            ...(layout.scrolls
              ? { gridAutoRows: layout.cellHeight }
              : { gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`, height: '100%' }),
          }}
        >
          {runnerNumbers.map((runnerNumber) => {
            const runner = runnersByNumber.get(runnerNumber)
            const isPending = !!runner && !!pending[runner.runnerId]
            const lapCount = (runner?.lapCount ?? 0) + (isPending ? 1 : 0)

            return (
              <button
                key={runnerNumber}
                type="button"
                aria-label={
                  isPending
                    ? `Undo lap for runner ${runnerNumber}`
                    : runner
                      ? `Add a lap for runner ${runnerNumber}`
                      : `Add runner ${runnerNumber}`
                }
                className={classNames(
                  'relative overflow-hidden rounded-2xl border-none text-white shadow-md',
                  'transition-transform duration-150 active:scale-90 cursor-pointer',
                  runner ? 'bg-primary' : 'bg-disabled-text',
                )}
                onClick={() => handleClick(runnerNumber)}
              >
                {isPending && <DebounceProgress />}
                <span
                  className="relative font-bold"
                  style={{ fontSize: clamp(cellSize * 0.38, 18, 72) }}
                >
                  {runnerNumber}
                </span>
                {runner && (
                  <span
                    className="absolute top-1.5 right-2 font-semibold opacity-90"
                    style={{ fontSize: clamp(cellSize * 0.14, 11, 20) }}
                  >
                    {lapCount}
                  </span>
                )}
                {isPending && (
                  <FontAwesomeIcon
                    aria-hidden
                    className="absolute top-1.5 left-2"
                    style={{ fontSize: clamp(cellSize * 0.14, 11, 20) }}
                    icon={faRotateLeft}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RunnerButtonGrid
