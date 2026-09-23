import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

function App() {
  const links = [
    ['/', 'Overview'],
    ['/activities', 'Activities'],
    ['/leaderboard', 'Leaderboard'],
    ['/teams', 'Teams'],
    ['/users', 'Users'],
    ['/workouts', 'Workouts'],
  ]

  return (
    <div className="container py-4">
      <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <NavLink to="/" className="text-decoration-none">
          <span className="h1 mb-0">OctoFit Tracker</span>
        </NavLink>
        <nav className="nav nav-pills" aria-label="Main navigation">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className="nav-link">
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

function Dashboard() {
  return (
    <section className="py-5">
      <p className="text-uppercase text-secondary small fw-semibold mb-2">Fitness, together</p>
      <h1 className="display-4 fw-bold">Your team&apos;s next personal best.</h1>
      <p className="lead text-secondary col-lg-7">
        Track movement, find your people, and keep the leaderboard moving.
      </p>
      <div className="row g-3 mt-4">
        {[
          ['Activities', '/activities', 'Log and review recent training.'],
          ['Leaderboard', '/leaderboard', 'See how your team is performing.'],
          ['Workouts', '/workouts', 'Choose your next session.'],
        ].map(([title, to, description]) => (
          <div className="col-md-4" key={to}>
            <NavLink to={to} className="card h-100 text-decoration-none shadow-sm">
              <div className="card-body">
                <h2 className="h5 text-dark">{title}</h2>
                <p className="text-secondary mb-0">{description}</p>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  )
}

export default App
