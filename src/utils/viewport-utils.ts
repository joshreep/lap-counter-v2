import { useEffect, useState } from 'react'

export enum Orientation {
  Portrait = 'Portrait',
  Landscape = 'Landscape',
  Square = 'Square',
}

export function getOrientation(): Orientation {
  const aspectRatio = getVW() / getVH()

  if (aspectRatio > 1) return Orientation.Portrait

  if (aspectRatio < 1) return Orientation.Landscape

  return Orientation.Square
}

/**
 * Gets the View Width with cross-browser compatibility
 */
export function getVW(): number {
  try {
    return Math.max(document.documentElement.clientWidth ?? 0, window.innerWidth ?? 0)
  } catch {
    return 0
  }
}

/**
 * Gets the View Height with cross-browser compatibility
 */
export function getVH(): number {
  try {
    return Math.max(document.documentElement.clientHeight ?? 0, window.innerHeight ?? 0)
  } catch {
    return 0
  }
}

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState(getOrientation())

  useEffect(() => {
    const listener = () => setOrientation(getOrientation())

    window.addEventListener('resize', listener)

    return () => {
      window.removeEventListener('resize', listener)
    }
  }, [])

  return orientation
}

export function useViewport(): number {
  const [vw, setVw] = useState(getVW())

  useEffect(() => {
    const listener = () => setVw(getVW)

    window.addEventListener('resize', listener)

    return () => window.removeEventListener('resize', listener)
  }, [])

  return vw
}
