import { useEffect, useRef, useState } from 'react'

export enum TimerFormat {
  Raw = 'Raw',
  Formatted = 'Formatted',
}
export default function usePreciseTimer(targetTime: number, format: TimerFormat.Raw): number
export default function usePreciseTimer(targetTime: number, format?: TimerFormat.Formatted): string
export default function usePreciseTimer(
  targetTime: number,
  format = TimerFormat.Formatted,
): number | string {
  const [remainingTime, setRemainingTime] = useState(targetTime - Date.now())
  const requestRef = useRef<number>(null)
  const previousTimeRef = useRef<number>(null)

  useEffect(() => {
    setRemainingTime(targetTime - Date.now())
    previousTimeRef.current = null
  }, [targetTime])

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current != null) {
        const deltaTime = time - previousTimeRef.current
        setRemainingTime((prevTime) => prevTime - deltaTime)
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [])

  const rawTime = remainingTime > 0 ? remainingTime : 0

  switch (format) {
    case TimerFormat.Raw:
      return rawTime
    case TimerFormat.Formatted:
      return formatTimer(rawTime)
    default:
      throw new Error(`Unrecognized format "${format}`)
  }
}

export function formatTimer(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes) {
    return `${zeroPadNumber(minutes, 2)}:${zeroPadNumber(seconds, 2)}`
  }

  return `${zeroPadNumber(seconds, 2)}`
}

function zeroPadNumber(number: number, padding: number) {
  return number.toString().padStart(padding, '0')
}
