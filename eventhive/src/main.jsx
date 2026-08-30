import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { EventsProvider } from './context/EventsContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'

// This is the entry point of the whole app.
// We wrap <App /> with three "providers" so that every page can access
// auth info, event data, and theme (light/dark) without passing props
// down manually through every component (this is called "prop drilling").
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <EventsProvider>
            <App />
          </EventsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
