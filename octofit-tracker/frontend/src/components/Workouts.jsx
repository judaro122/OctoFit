import { useEffect, useState } from 'react'
import { fetchResource } from '../api.js'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchResource('workouts', controller.signal).then(setWorkouts).catch((requestError) => {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    })
    return () => controller.abort()
  }, [])

  return <section><h1 className="display-6 fw-bold">Workouts</h1>{error && <div className="alert alert-warning">{error}</div>}<div className="row g-3">{workouts.map((workout, index) => <div className="col-md-6" key={workout.id ?? index}><article className="card h-100"><div className="card-body"><h2 className="h5">{workout.title}</h2><p className="text-secondary">{workout.description ?? 'Training session for your next goal.'}</p><span className="badge text-bg-light me-2">{workout.difficulty ?? 'all levels'}</span><span className="text-secondary">{workout.durationMinutes ?? '-'} min</span></div></article></div>)}</div>{!error && workouts.length === 0 && <p className="text-secondary">No workouts found.</p>}</section>
}

export default Workouts