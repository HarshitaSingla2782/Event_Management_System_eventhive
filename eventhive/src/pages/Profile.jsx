import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

// Lets a logged-in user (attendee or admin) update their own name,
// email, and optionally password.
export default function Profile() {
  const { currentUser, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    setSaved(false)
    if (!validate()) return

    const updates = { name: form.name, email: form.email }
    if (form.password) updates.password = form.password

    const result = updateProfile(currentUser.id, updates)
    if (!result.success) {
      setErrors({ email: result.message })
      return
    }
    setForm({ ...form, password: '' })
    setSaved(true)
  }

  return (
    <div className="container auth-page">
      <form onSubmit={handleSubmit} className="form auth-form">
        <h1>My profile</h1>
        <p className="muted small">Signed in as {currentUser.role === 'admin' ? 'an admin' : 'an attendee'}.</p>

        {saved && <p className="success-banner">Your profile has been updated.</p>}

        <label>Full name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>New password (leave blank to keep current)
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <button type="submit" className="btn btn-primary full-width">Save changes</button>
      </form>
    </div>
  )
}
