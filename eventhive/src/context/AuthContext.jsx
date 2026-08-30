import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const AuthContext = createContext(null)

// Handles sign up, log in, log out, "who is currently logged in", and
// profile/user management. Two roles exist: 'user' (attendee) and 'admin'.
// NOTE: for a real product, passwords must never be stored like this
// (plain text, in the browser). This is simplified on purpose for a
// student project that has no backend/server.
export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('eh_users', [
    {
      id: 'admin-1',
      name: 'Demo Admin',
      email: 'admin@eventhive.com',
      password: 'admin123',
      role: 'admin',
    },
  ])
  const [currentUser, setCurrentUser] = useLocalStorage('eh_current_user', null)

  function register({ name, email, password, role }) {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' }
    }
    const newUser = { id: 'user-' + Date.now(), name, email, password, role }
    setUsers([...users, newUser])
    setCurrentUser(newUser)
    return { success: true }
  }

  function login(email, password) {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { success: false, message: 'Incorrect email or password.' }
    }
    setCurrentUser(found)
    return { success: true }
  }

  function logout() {
    setCurrentUser(null)
  }

  // Used by the Profile page: lets a logged-in user update their own
  // name / email / password.
  function updateProfile(id, updates) {
    if (updates.email) {
      const taken = users.some(
        (u) => u.id !== id && u.email.toLowerCase() === updates.email.toLowerCase()
      )
      if (taken) {
        return { success: false, message: 'That email is already in use.' }
      }
    }
    const updated = users.map((u) => (u.id === id ? { ...u, ...updates } : u))
    setUsers(updated)
    if (currentUser?.id === id) {
      setCurrentUser({ ...currentUser, ...updates })
    }
    return { success: true }
  }

  // Used by the admin's "Manage users" panel.
  function deleteUser(id) {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <AuthContext.Provider
      value={{ users, currentUser, register, login, logout, updateProfile, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Any component can call useAuth() to read currentUser or call login/logout.
export function useAuth() {
  return useContext(AuthContext)
}
