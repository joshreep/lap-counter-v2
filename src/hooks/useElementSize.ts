'use client'

import { useEffect, useState } from 'react'

export interface ElementSize {
  width: number
  height: number
}

/**
 * Tracks the content-box size of an element. Pass the returned `ref` to the element to measure;
 * it is a callback ref, so the element may mount later (or conditionally).
 */
export function useElementSize<T extends HTMLElement>() {
  const [element, ref] = useState<T | null>(null)
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

  useEffect(() => {
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [element])

  return { ref, size }
}
