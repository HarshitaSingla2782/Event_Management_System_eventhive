import { useState, useEffect } from 'react'

// A small reusable hook: works exactly like useState, but also saves
// the value to the browser's localStorage so it survives a page refresh.
// This is what lets "logged in" state, events, and ticket bookings
// persist without needing a real backend/database.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
