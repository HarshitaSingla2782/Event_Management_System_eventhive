import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.message.trim()) e.message = 'Message cannot be empty.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setSent(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="container section">
      <h1>Contact us</h1>
      <p className="muted">Questions about an event or your booking? Send us a message.</p>

      {sent && <p className="success-banner">Thanks! Your message has been sent.</p>}

      <form onSubmit={handleSubmit} className="form contact-form">
        <label>Name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>Message
          <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" />
          {errors.message && <span className="field-error">{errors.message}</span>}
        </label>
        <button type="submit" className="btn btn-primary">Send message</button>
      </form>
    </div>
  )
}
