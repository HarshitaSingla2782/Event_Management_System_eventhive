import { Link } from 'react-router-dom'

// Static footer shown on every page.
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h3><span className="brand-mark">EH</span> EventHive</h3>
          <p className="muted">Discover, book, and manage events all in one place.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/events">All events</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/events?category=Music%20Shows">Music shows</Link>
          <Link to="/events?category=Tech%20Fests">Tech fests</Link>
          <Link to="/events?category=Hackathons">Hackathons</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </div>
      </div>
      <p className="footer-bottom">© {new Date().getFullYear()} EventHive. Built as a student project.</p>
    </footer>
  )
}
