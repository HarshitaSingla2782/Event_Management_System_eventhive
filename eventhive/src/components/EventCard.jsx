import { Link } from 'react-router-dom'

// A single event card used in grids across Home and Events pages.
// The whole card is a link to the event's details page.
export default function EventCard({ event }) {
  const dateLabel = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <div className="event-card-image" style={{ backgroundImage: `url(${event.image})` }}>
        <span className="event-card-category">{event.category}</span>
      </div>
      <div className="event-card-body">
        <h3>{event.title}</h3>
        <p className="event-card-meta">{dateLabel} &middot; {event.location}</p>
        <div className="event-card-footer">
          <span className="event-card-price">{event.price === 0 ? 'Free' : `₹${event.price}`}</span>
          <span className="btn btn-sm btn-primary">View details</span>
        </div>
      </div>
    </Link>
  )
}
