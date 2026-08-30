import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const ThemeContext = createContext(null)

// Controls light/dark mode. It sets a data-theme attribute on the
// <html> element, and index.css has matching styles for both modes.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('eh_theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
