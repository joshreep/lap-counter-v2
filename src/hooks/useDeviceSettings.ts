'use client'

import { useCallback, useEffect, useState } from 'react'

export interface DeviceSettings {
  useExperimentalTracker: boolean
  trackerRangeStart: number | null
  trackerRangeEnd: number | null
}

const STORAGE_KEY = 'deviceSettings'

const defaultDeviceSettings: DeviceSettings = {
  useExperimentalTracker: false,
  trackerRangeStart: null,
  trackerRangeEnd: null,
}

function readDeviceSettings(): DeviceSettings {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultDeviceSettings, ...JSON.parse(stored) } : defaultDeviceSettings
  } catch {
    return defaultDeviceSettings
  }
}

/**
 * Settings persisted in this device's localStorage, so they are not shared between devices or logins.
 * Values are read after mount to avoid a server/client hydration mismatch.
 */
export function useDeviceSettings() {
  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings>(defaultDeviceSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setDeviceSettings(readDeviceSettings())
    setIsLoaded(true)
  }, [])

  const updateDeviceSettings = useCallback((updates: Partial<DeviceSettings>) => {
    const next = { ...readDeviceSettings(), ...updates }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch (error) {
      console.error(error)
    }
    setDeviceSettings(next)
  }, [])

  return { deviceSettings, updateDeviceSettings, isLoaded }
}
