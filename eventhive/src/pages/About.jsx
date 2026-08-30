export default function About() {
  return (
    <div className="container section about-page">
      <h1>About EventHive</h1>
      <p>EventHive is a student-built platform that helps people discover and book events like music shows, tech fests, hackathons, comedy nights, workshops, sports events, and parties — while giving admins the tools to create and manage them.</p>

      <div className="about-grid">
        <div className="about-card">
          <h3>For attendees</h3>
          <p>Search and filter events, view full details, and book your ticket in a few clicks. Track every booking's status, cancel if plans change, and manage your profile — all from your dashboard.</p>
        </div>
        <div className="about-card">
          <h3>For admins</h3>
          <p>Create, edit, and delete events, manage categories, approve or reject bookings, oversee registered users, and see stats about the whole platform at a glance.</p>
        </div>
      </div>
    </div>
  )
}
