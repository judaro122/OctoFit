import { useEffect, useState } from 'react'
import { fetchResource } from '../api.js'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetchResource('leaderboard', controller.signal).then(setEntries).catch((requestError) => {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    })
    return () => controller.abort()
  }, [])

  return <section><h1 className="display-6 fw-bold">Leaderboard</h1>{error && <div className="alert alert-warning">{error}</div>}{!error && entries.length === 0 ? <p className="text-secondary">No leaderboard entries found.</p> : <div className="list-group">{entries.map((entry, index) => <div className="list-group-item d-flex justify-content-between" key={entry.id ?? index}><span><strong>#{entry.rank ?? index + 1}</strong> {entry.name ?? entry.userId}</span><strong>{entry.points ?? 0} pts</strong></div>)}</div>}</section>
}

export default Leaderboard