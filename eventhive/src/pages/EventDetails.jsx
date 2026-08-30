import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEvents } from '../context/EventsContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Modal from '../components/Modal.jsx'

export default function EventDetails() {
  const { id } = useParams()
  const { getEvent, registerForEvent, getRegistrationsForEvent } = useEvents()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const event = getEvent(id)
  const [showForm, setShowForm] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [form, setForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', phone: '' })
  const [errors, setErrors] = useState({})

  if (!event) {
    return (
      <div className="container empty-state">
        <h2>Event not found</h2>
        <Link to="/events" className="btn btn-primary">Back to events</Link>
      </div>
    )
  }

  const seatsTaken = getRegistrationsForEvent(event.id).length
  const seatsLeft = event.capacity - seatsTaken
  const dateLabel = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleBook() {
    // Booking requires an account, so we send guests to log in first.
    if (!currentUser) {
      navigate('/login')
      return
    }
    setShowForm(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const result = registerForEvent(event.id, { ...form, userId: currentUser.id })
    if (result.success) {
      setTicket(result.ticket)
      setShowForm(false)
    } else {
      alert(result.message)
    }
  }

  return (
    <div>
      <div className="event-banner" style={{ backgroundImage: `url(${event.image})` }}>
        <div className="event-banner-overlay">
          <div className="container">
            <span className="event-card-category">{event.category}</span>
            <h1>{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container section event-details-grid">
        <div className="event-details-main">
          <h2>About this event</h2>
          <p>{event.description}</p>

          <div className="details-list">
            <div><strong>Date</strong><span>{dateLabel}</span></div>
            <div><strong>Time</strong><span>{event.time}</span></div>
            <div><strong>Location</strong><span>{event.location}</span></div>
            <div><strong>Seats left</strong><span>{seatsLeft > 0 ? seatsLeft : 'Sold out'}</span></div>
          </div>
        </div>

        <aside className="event-details-side">
          <div className="booking-card">
            <p className="price-tag">{event.price === 0 ? 'Free' : `₹${event.price}`}</p>
            {event.price > 0 && <p className="muted">per ticket</p>}
            <button
              className="btn btn-primary btn-lg full-width"
              onClick={handleBook}
              disabled={seatsLeft <= 0}
            >
              {seatsLeft <= 0 ? 'Sold out' : 'Register / book ticket'}
            </button>
            {!currentUser && <p className="muted small">You'll need to log in first.</p>}
          </div>
        </aside>
      </div>

      {showForm && (
        <Modal title="Register for this event" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="form">
            <label>Full name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label>Email
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>
            <label>Phone number
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="10-digit number" />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>
            <button type="submit" className="btn btn-primary full-width">Confirm booking</button>
          </form>
        </Modal>
      )}

      {ticket && (
        <Modal title="Booking confirmed" onClose={() => setTicket(null)}>
          <div className="ticket">
            <p className="ticket-success">You're registered for {event.title}!</p>
            <p className="muted small">Your booking is pending admin approval — you can track its status under "My bookings".</p>
            <div className="ticket-row"><span>Ticket ID</span><strong>{ticket.id}</strong></div>
            <div className="ticket-row"><span>Name</span><strong>{ticket.name}</strong></div>
            <div className="ticket-row"><span>Date</span><strong>{dateLabel}</strong></div>
            <div className="ticket-row"><span>Location</span><strong>{event.location}</strong></div>
            <Link to="/dashboard" className="btn btn-primary full-width">View my bookings</Link>
          </div>
        </Modal>
      )}
    </div>
  )
}
