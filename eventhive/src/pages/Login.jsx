import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const result = login(form.email, form.password)
    if (!result.success) {
      setError(result.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="container auth-page">
      <form onSubmit={handleSubmit} className="form auth-form">
        <h1>Log in</h1>
        <p className="muted small">Demo admin account: admin@eventhive.com / admin123</p>
        {error && <p className="field-error">{error}</p>}
        <label>Email
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
        </label>
        <label>Password
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
        </label>
        <button type="submit" className="btn btn-primary full-width">Log in</button>
        <p className="muted">No account? <Link to="/register">Sign up</Link></p>
      </form>
    </div>
  )
}
