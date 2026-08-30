# EventHive — Event Management System

A multi-page React app for browsing, booking, and managing events
(music shows, tech fests, hackathons, comedy shows, workshops, sports
events, and parties). Built with React, React Router, and plain CSS —
no backend required, data is kept in the browser's localStorage.

## How to run it

1. Install Node.js (v18 or later) if you don't already have it.
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open the URL it prints (usually http://localhost:5173).

A demo admin account is pre-loaded so you can see the admin side immediately:
- Email: `admin@eventhive.com`
- Password: `admin123`

Or click "Sign up" and create your own attendee or admin account.

## File structure

```
eventhive/
├── index.html                 entry HTML page
├── package.json                dependencies + npm scripts
├── vite.config.js               build tool config
└── src/
    ├── main.jsx                 app entry point, wraps App in providers
    ├── App.jsx                  route map (all pages live here)
    ├── index.css                 all styling (variables, layout, dark mode)
    │
    ├── context/                 global state, shared across all pages
    │   ├── AuthContext.jsx        sign up / log in / log out / profile / manage users
    │   ├── EventsContext.jsx      events, categories, bookings (the "database")
    │   └── ThemeContext.jsx       light / dark mode toggle
    │
    ├── hooks/
    │   └── useLocalStorage.js    saves state to the browser so it persists
    │
    ├── data/
    │   └── events.js              starting (seed) event data + default categories
    │
    ├── components/               small reusable pieces
    │   ├── Navbar.jsx              responsive nav bar (all pages)
    │   ├── Footer.jsx               footer (all pages)
    │   ├── EventCard.jsx            one event's preview card
    │   ├── Modal.jsx                 popup dialog used for forms/tickets
    │   └── ProtectedRoute.jsx       blocks a page unless logged in / right role
    │
    └── pages/                    one file per page/route
        ├── Home.jsx                "/"           hero + featured events
        ├── Events.jsx               "/events"     full listing, search, filter
        ├── EventDetails.jsx        "/events/:id"  details + booking flow
        ├── Login.jsx                 "/login"
        ├── Register.jsx              "/register"
        ├── Contact.jsx                "/contact"
        ├── About.jsx                   "/about"
        ├── Dashboard.jsx              "/dashboard"  user's bookings + cancel
        ├── Profile.jsx                  "/profile"    edit name/email/password
        └── AdminDashboard.jsx        "/admin"      events, categories, bookings, users
```

## Feature checklist

**User side**
- Registration & login
- View upcoming events (Home + Events)
- Search & filter events (by name and category, on the Events page)
- Event details page
- Book / register for an event (with form validation)
- View my bookings (Dashboard), each showing its approval status
- Cancel a booking
- Profile management (update name, email, password)

**Admin side**
- Admin login (role-based, same login form)
- Add new event
- Edit / delete event
- Manage event categories (add / delete, with delete blocked while in use)
- View all bookings across every event
- Approve / reject bookings (each booking starts "pending")
- Manage users (view all, remove an account)
- Dashboard: total events, total users, total bookings, pending approvals

## How the "system" part works

**Attendee flow**: Browse (`/events`) → search/filter → open an event
(`/events/:id`) → read details → click "Register / book ticket" → fill
the form (validated) → get a confirmation with a generated ticket ID
(status starts as "pending") → track it under "My bookings"
(`/dashboard`) → cancel it there if needed.

**Admin flow**: Log in with the admin role → `/admin` → four tabs:
*Manage events* (add/edit/delete + see bookings per event), *Manage
categories* (add/delete), *All bookings* (approve/reject any pending
booking), and *Manage users* (view/remove accounts). Stat cards at the
top give a live overview.

Under the hood, `EventsContext.jsx` is the single source of truth for
events, categories, and bookings (like a mini database), and
`AuthContext.jsx` is the source of truth for accounts. Every page just
calls their functions (`addEvent`, `registerForEvent`,
`updateRegistrationStatus`, `updateProfile`, etc.) instead of managing
that data itself.

## Notes for your submission

- This uses `localStorage` instead of a real backend/database — that's
  intentional for a beginner/coursework project with no server. If your
  requirements call for a real backend, the next step would be Node +
  Express + MongoDB (or similar), and the same context functions would
  just call an API instead of localStorage.
- Passwords are stored in plain text in the browser for simplicity —
  fine for a demo, never do this in a real product.
