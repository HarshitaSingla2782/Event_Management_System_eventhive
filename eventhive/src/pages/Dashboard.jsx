import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEvents } from '../context/EventsContext.jsx'

// The attendee's personal dashboard: every booking they've made,
// with its approval status, and the ability to cancel one.
export default function Dashboard() {
  const { currentUser } = useAuth()
  const { getRegistrationsForUser, getEvent, cancelRegistration } = useEvents()

  const myTickets = getRegistrationsForUser(currentUser.id)

  function handleCancel(ticketId, eventTitle) {
    if (confirm(`Cancel your booking for "${eventTitle}"?`)) {
      cancelRegistration(ticketId)
    }
  }

  return (
    <div className="container section">
      <h1>My bookings</h1>
      <p className="muted">Welcome back, {currentUser.name}.</p>

      {myTickets.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any events yet.</p>
          <Link to="/events" className="btn btn-primary">Browse events</Link>
        </div>
      ) : (
        <div className="ticket-grid">
          {myTickets.map((t) => {
            const event = getEvent(t.eventId)
            if (!event) return null
            return (
              <div key={t.id} className="ticket-card">
                <div className="ticket-card-header">
                  <h3>{event.title}</h3>
                  <span className={`status-badge status-${t.status}`}>{t.status}</span>
                </div>
                <p className="muted">
                  {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' '}&middot; {event.location}
                </p>
                <div className="ticket-row"><span>Ticket ID</span><strong>{t.id}</strong></div>
                <div className="ticket-card-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">View event</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(t.id, event.title)}>
                    Cancel booking
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
