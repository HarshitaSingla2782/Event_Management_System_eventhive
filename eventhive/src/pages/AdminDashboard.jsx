import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useEvents } from '../context/EventsContext.jsx'
import Modal from '../components/Modal.jsx'

const emptyForm = {
  title: '', category: '', date: '', time: '', location: '',
  price: '', capacity: '', description: '', image: '',
}

const TABS = [
  { id: 'events', label: 'Manage events' },
  { id: 'categories', label: 'Manage categories' },
  { id: 'bookings', label: 'All bookings' },
  { id: 'users', label: 'Manage users' },
]

// The admin's control panel. Covers everything on the "Admin Side" of
// the spec: add/edit/delete events, manage categories, view all
// bookings with approve/reject, manage users, and a stats overview.
export default function AdminDashboard() {
  const { currentUser, users, deleteUser } = useAuth()
  const {
    events, categories, registrations,
    addEvent, updateEvent, deleteEvent,
    addCategory, deleteCategory,
    updateRegistrationStatus, getRegistrationsForEvent,
    getAdminStats,
  } = useEvents()

  const [tab, setTab] = useState('events')
  const stats = getAdminStats()

  return (
    <div className="container section">
      <h1>Admin dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card"><span>{stats.totalEvents}</span><p>Total events</p></div>
        <div className="stat-card"><span>{users.length}</span><p>Total users</p></div>
        <div className="stat-card"><span>{stats.totalBookings}</span><p>Total bookings</p></div>
        <div className="stat-card"><span>{stats.pendingBookings}</span><p>Pending approval</p></div>
      </div>

      <div className="tabs-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'events' && (
        <EventsTab
          events={events}
          categories={categories}
          addEvent={addEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          getRegistrationsForEvent={getRegistrationsForEvent}
          currentUser={currentUser}
        />
      )}

      {tab === 'categories' && (
        <CategoriesTab categories={categories} addCategory={addCategory} deleteCategory={deleteCategory} />
      )}

      {tab === 'bookings' && (
        <BookingsTab
          registrations={registrations}
          events={events}
          updateRegistrationStatus={updateRegistrationStatus}
        />
      )}

      {tab === 'users' && (
        <UsersTab users={users} currentUser={currentUser} deleteUser={deleteUser} />
      )}
    </div>
  )
}

// ---------- Manage events ----------
function EventsTab({ events, categories, addEvent, updateEvent, deleteEvent, getRegistrationsForEvent, currentUser }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm, category: categories[0] || '' })
  const [viewingRegs, setViewingRegs] = useState(null)

  function openAdd() {
    setEditingId(null)
    setForm({ ...emptyForm, category: categories[0] || '' })
    setShowForm(true)
  }

  function openEdit(event) {
    setEditingId(event.id)
    setForm(event)
    setShowForm(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      capacity: Number(form.capacity) || 0,
      image: form.image || `https://picsum.photos/seed/${encodeURIComponent(form.title)}/800/500`,
      organizerId: currentUser.id,
    }
    if (editingId) {
      updateEvent(editingId, payload)
    } else {
      addEvent(payload)
    }
    setShowForm(false)
  }

  function handleDelete(id) {
    if (confirm('Delete this event? This also removes its bookings.')) {
      deleteEvent(id)
    }
  }

  return (
    <div>
      <div className="section-header">
        <h2>All events</h2>
        <button className="btn btn-primary" onClick={openAdd}>+ Add new event</button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">No events yet.</div>
      ) : (
        <div className="organizer-table">
          {events.map((ev) => (
            <div key={ev.id} className="organizer-row">
              <div>
                <strong>{ev.title}</strong>
                <p className="muted">{ev.category} &middot; {ev.date}</p>
              </div>
              <div className="organizer-row-actions">
                <button className="btn btn-sm btn-outline" onClick={() => setViewingRegs(ev.id)}>
                  Bookings ({getRegistrationsForEvent(ev.id).length})
                </button>
                <button className="btn btn-sm btn-outline" onClick={() => openEdit(ev)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ev.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <Modal title={editingId ? 'Edit event' : 'Add new event'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="form">
            <label>Title
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
            </label>
            <label>Category
              <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <div className="form-row">
              <label>Date
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
              </label>
              <label>Time
                <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input" />
              </label>
            </div>
            <label>Location
              <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" />
            </label>
            <div className="form-row">
              <label>Price (₹, 0 = free)
                <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" />
              </label>
              <label>Capacity
                <input type="number" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input" />
              </label>
            </div>
            <label>Description
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" />
            </label>
            <button type="submit" className="btn btn-primary full-width">{editingId ? 'Save changes' : 'Add event'}</button>
          </form>
        </Modal>
      )}

      {viewingRegs && (
        <Modal title="Bookings" onClose={() => setViewingRegs(null)}>
          <RegistrationsList eventId={viewingRegs} getRegistrationsForEvent={getRegistrationsForEvent} />
        </Modal>
      )}
    </div>
  )
}

function RegistrationsList({ eventId, getRegistrationsForEvent }) {
  const regs = getRegistrationsForEvent(eventId)
  if (regs.length === 0) return <p className="muted">No bookings yet.</p>
  return (
    <div className="regs-list">
      {regs.map((r) => (
        <div key={r.id} className="regs-row">
          <div>
            <strong>{r.name}</strong>
            <p className="muted">{r.email} &middot; {r.phone}</p>
          </div>
          <span className={`status-badge status-${r.status}`}>{r.status}</span>
        </div>
      ))}
    </div>
  )
}

// ---------- Manage categories ----------
function CategoriesTab({ categories, addCategory, deleteCategory }) {
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const result = addCategory(newCategory)
    if (!result.success) {
      setError(result.message)
      return
    }
    setNewCategory('')
    setError('')
  }

  function handleDelete(name) {
    const result = deleteCategory(name)
    if (!result.success) {
      alert(result.message)
    }
  }

  return (
    <div>
      <h2>Event categories</h2>
      <form onSubmit={handleAdd} className="category-form">
        <input
          className="input"
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Add category</button>
      </form>
      {error && <p className="field-error">{error}</p>}

      <div className="organizer-table">
        {categories.map((c) => (
          <div key={c} className="organizer-row">
            <strong>{c}</strong>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- All bookings, approve/reject ----------
function BookingsTab({ registrations, events, updateRegistrationStatus }) {
  function eventTitle(eventId) {
    return events.find((ev) => ev.id === eventId)?.title || 'Unknown event'
  }

  if (registrations.length === 0) {
    return <div className="empty-state">No bookings yet.</div>
  }

  return (
    <div>
      <h2>All bookings</h2>
      <div className="organizer-table">
        {registrations.map((r) => (
          <div key={r.id} className="organizer-row">
            <div>
              <strong>{r.name}</strong>
              <p className="muted">{eventTitle(r.eventId)} &middot; {r.email}</p>
            </div>
            <div className="organizer-row-actions">
              <span className={`status-badge status-${r.status}`}>{r.status}</span>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => updateRegistrationStatus(r.id, 'confirmed')}
                disabled={r.status === 'confirmed'}
              >
                Approve
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => updateRegistrationStatus(r.id, 'rejected')}
                disabled={r.status === 'rejected'}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- Manage users ----------
function UsersTab({ users, currentUser, deleteUser }) {
  function handleDelete(user) {
    if (user.id === currentUser.id) {
      alert("You can't delete your own account while logged in.")
      return
    }
    if (confirm(`Remove ${user.name}'s account?`)) {
      deleteUser(user.id)
    }
  }

  return (
    <div>
      <h2>All users</h2>
      <div className="organizer-table">
        {users.map((u) => (
          <div key={u.id} className="organizer-row">
            <div>
              <strong>{u.name}</strong>
              <p className="muted">{u.email} &middot; {u.role}</p>
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
