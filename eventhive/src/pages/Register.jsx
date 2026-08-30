import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    const result = register(form)
    if (!result.success) {
      setErrors({ email: result.message })
      return
    }
    navigate(form.role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="container auth-page">
      <form onSubmit={handleSubmit} className="form auth-form">
        <h1>Create your account</h1>
        <label>Full name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <fieldset className="role-select">
          <legend>I want to sign up as</legend>
          <label className="radio-label">
            <input type="radio" name="role" checked={form.role === 'user'} onChange={() => setForm({ ...form, role: 'user' })} />
            Attendee — browse and book events
          </label>
          <label className="radio-label">
            <input type="radio" name="role" checked={form.role === 'admin'} onChange={() => setForm({ ...form, role: 'admin' })} />
            Admin — create and manage events
          </label>
        </fieldset>

        <button type="submit" className="btn btn-primary full-width">Sign up</button>
        <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  )
}
