import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Wraps a page so it's only reachable when logged in, and (optionally)
// only when the logged-in user's role is in the allowed `roles` list.
// Example: <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
export default function ProtectedRoute({ roles, children }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
