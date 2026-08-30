import { Link } from 'react-router-dom'
import { useEvents } from '../context/EventsContext.jsx'
import EventCard from '../components/EventCard.jsx'

export default function Home() {
  const { events, categories } = useEvents()
  const featured = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6)

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Find your next favorite event</h1>
          <p>Music shows, tech fests, hackathons, comedy nights and more — browse, book, and manage it all in one place.</p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-lg">Browse events</Link>
            <Link to="/register" className="btn btn-outline btn-lg light">Sign up</Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>Browse by category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link key={cat} to={`/events?category=${encodeURIComponent(cat)}`} className="category-chip">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-header">
          <h2>Upcoming events</h2>
          <Link to="/events" className="link-more">View all →</Link>
        </div>
        <div className="event-grid">
          {featured.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      </section>
    </div>
  )
}
