'use client'

import { useState, useCallback } from 'react'

export interface UseLocationInputOptions {
  initialLocations?: string[]
  maxLocations?: number
}

export interface UseLocationInputReturn {
  locations: string[]
  locationInput: string
  setLocationInput: (value: string) => void
  addLocation: () => void
  removeLocation: (location: string) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  clearLocations: () => void
  setLocations: React.Dispatch<React.SetStateAction<string[]>>
}

export function useLocationInput(
  options: UseLocationInputOptions = {}
): UseLocationInputReturn {
  const { initialLocations = [], maxLocations = 10 } = options

  const [locations, setLocations] = useState<string[]>(initialLocations)
  const [locationInput, setLocationInput] = useState('')

  const addLocation = useCallback(() => {
    const trimmed = locationInput.trim()
    if (trimmed && !locations.includes(trimmed) && locations.length < maxLocations) {
      setLocations(prev => [...prev, trimmed])
      setLocationInput('')
    }
  }, [locationInput, locations, maxLocations])

  const removeLocation = useCallback((location: string) => {
    setLocations(prev => prev.filter(l => l !== location))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addLocation()
    }
  }, [addLocation])

  const clearLocations = useCallback(() => {
    setLocations([])
    setLocationInput('')
  }, [])

  return {
    locations,
    locationInput,
    setLocationInput,
    addLocation,
    removeLocation,
    handleKeyDown,
    clearLocations,
    setLocations,
  }
}
