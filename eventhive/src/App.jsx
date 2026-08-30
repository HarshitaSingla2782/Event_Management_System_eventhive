import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// This is the "router map" of the whole site.
// Every <Route> below is one page. The path is the URL, the element
// is which component gets shown. Navbar and Footer sit outside the
// <Routes> so they appear on every page.
export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Protected routes: only reachable when logged in (and, for
              the admin panel, only when the account role is "admin") */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['user', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['user', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div className="container empty-state">
      <h2>404 - Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  )
}
