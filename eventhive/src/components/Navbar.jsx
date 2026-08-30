import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

// Responsive navigation bar shown on every page.
// On small screens, links collapse behind a hamburger button (see .nav-toggle in CSS).
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">EH</span> EventHive
        </Link>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/events" onClick={() => setOpen(false)}>Events</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>

          {currentUser && (
            <NavLink to="/dashboard" onClick={() => setOpen(false)}>My bookings</NavLink>
          )}
          {currentUser && (
            <NavLink to="/profile" onClick={() => setOpen(false)}>Profile</NavLink>
          )}
          {currentUser?.role === 'admin' && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>Admin panel</NavLink>
          )}

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>

          {!currentUser ? (
            <>
              <Link to="/login" className="btn btn-outline" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          ) : (
            <button className="btn btn-outline" onClick={handleLogout}>Log out</button>
          )}
        </nav>
      </div>
    </header>
  )
}
