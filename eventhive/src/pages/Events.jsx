import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEvents } from '../context/EventsContext.jsx'
import EventCard from '../components/EventCard.jsx'

export default function Events() {
  const { events, categories } = useEvents()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('date')

  // Reading the category straight from the URL (?category=...) means
  // links from the Home page and Footer can "deep link" straight into
  // a filtered view of this page.
  const category = searchParams.get('category') || 'All'

  function setCategory(value) {
    if (value === 'All') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', value)
    }
    setSearchParams(searchParams)
  }

  // useMemo re-runs this filtering/sorting logic only when one of its
  // dependencies actually changes, instead of on every render.
  const filtered = useMemo(() => {
    let list = events.filter((ev) => category === 'All' || ev.category === category)
    list = list.filter((ev) => ev.title.toLowerCase().includes(search.toLowerCase()))
    if (sortBy === 'date') list = [...list].sort((a, b) => new Date(a.date) - new Date(b.date))
    if (sortBy === 'price-low') list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [events, category, search, sortBy])

  return (
    <div className="container section">
      <h1>All events</h1>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search events by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
          <option value="All">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
          <option value="date">Sort: date</option>
          <option value="price-low">Sort: price (low to high)</option>
          <option value="price-high">Sort: price (high to low)</option>
        </select>
      </div>

      <p className="result-count">{filtered.length} event{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div className="empty-state">No events match your search.</div>
      ) : (
        <div className="event-grid">
          {filtered.map((ev) => <EventCard key={ev.id} event={ev} />)}
        </div>
      )}
    </div>
  )
}
