import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { seedEvents, DEFAULT_CATEGORIES } from '../data/events.js'

const EventsContext = createContext(null)

// This is the "database layer" of the app. It holds:
//  - events: every event in the system
//  - categories: the list of event categories (admin-manageable)
//  - registrations: every booking ever made (linked to an eventId + userId),
//    each with a status: 'pending' | 'confirmed' | 'rejected'
// and exposes functions for every action a user or admin can take.
export function EventsProvider({ children }) {
  const [events, setEvents] = useLocalStorage('eh_events', seedEvents)
  const [categories, setCategories] = useLocalStorage('eh_categories', DEFAULT_CATEGORIES)
  const [registrations, setRegistrations] = useLocalStorage('eh_registrations', [])

  // ---------- Events ----------
  function addEvent(event) {
    const newEvent = { ...event, id: 'evt-' + Date.now() }
    setEvents([...events, newEvent])
  }

  function updateEvent(id, updates) {
    setEvents(events.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)))
  }

  function deleteEvent(id) {
    setEvents(events.filter((ev) => ev.id !== id))
    // Also clean up any registrations tied to the deleted event.
    setRegistrations(registrations.filter((r) => r.eventId !== id))
  }

  function getEvent(id) {
    return events.find((ev) => ev.id === id)
  }

  // ---------- Categories ----------
  function addCategory(name) {
    const trimmed = name.trim()
    if (!trimmed) return { success: false, message: 'Category name cannot be empty.' }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, message: 'That category already exists.' }
    }
    setCategories([...categories, trimmed])
    return { success: true }
  }

  function deleteCategory(name) {
    const inUse = events.some((ev) => ev.category === name)
    if (inUse) {
      return { success: false, message: 'Cannot delete a category that events are still using.' }
    }
    setCategories(categories.filter((c) => c !== name))
    return { success: true }
  }

  // ---------- Registrations (bookings) ----------
  function registerForEvent(eventId, attendee) {
    const event = getEvent(eventId)
    const activeBookings = registrations.filter(
      (r) => r.eventId === eventId && r.status !== 'rejected'
    ).length
    if (event && activeBookings >= event.capacity) {
      return { success: false, message: 'Sorry, this event is fully booked.' }
    }
    const ticket = {
      id: 'TCK-' + Date.now().toString(36).toUpperCase(),
      eventId,
      status: 'pending', // an admin can approve/reject it from the admin panel
      ...attendee,
      bookedAt: new Date().toISOString(),
    }
    setRegistrations([...registrations, ticket])
    return { success: true, ticket }
  }

  // A user cancelling their own booking (removes it entirely).
  function cancelRegistration(ticketId) {
    setRegistrations(registrations.filter((r) => r.id !== ticketId))
  }

  // Admin approving or rejecting a pending booking.
  function updateRegistrationStatus(ticketId, status) {
    setRegistrations(
      registrations.map((r) => (r.id === ticketId ? { ...r, status } : r))
    )
  }

  function getRegistrationsForUser(userId) {
    return registrations.filter((r) => r.userId === userId)
  }

  function getRegistrationsForEvent(eventId) {
    return registrations.filter((r) => r.eventId === eventId)
  }

  // ---------- Stats (for the admin dashboard) ----------
  function getAdminStats() {
    const today = new Date().toISOString().split('T')[0]
    const upcoming = events.filter((ev) => ev.date >= today).length
    const past = events.length - upcoming
    return {
      totalEvents: events.length,
      totalBookings: registrations.length,
      pendingBookings: registrations.filter((r) => r.status === 'pending').length,
      upcoming,
      past,
    }
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        categories,
        registrations,
        addEvent,
        updateEvent,
        deleteEvent,
        getEvent,
        addCategory,
        deleteCategory,
        registerForEvent,
        cancelRegistration,
        updateRegistrationStatus,
        getRegistrationsForUser,
        getRegistrationsForEvent,
        getAdminStats,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  return useContext(EventsContext)
}
