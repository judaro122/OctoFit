import { useEffect, useState } from 'react'
const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const detectedCodespaceName = window.location.hostname.match(/^(.+)-5173\.app\.github\.dev$/)?.[1]
const endpoint = codespaceName || detectedCodespaceName
  ? `https://${codespaceName || detectedCodespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

const getItems = (payload) => Array.isArray(payload) ? payload : payload?.results ?? payload?.data ?? payload?.items ?? []

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetch(endpoint, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Unable to load leaderboard')
      return response.json()
    }).then((payload) => setEntries(getItems(payload))).catch((requestError) => {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    })
    return () => controller.abort()
  }, [])

  return <section><h1 className="display-6 fw-bold">Leaderboard</h1>{error && <div className="alert alert-warning">{error}</div>}{!error && entries.length === 0 ? <p className="text-secondary">No leaderboard entries found.</p> : <div className="list-group">{entries.map((entry, index) => <div className="list-group-item d-flex justify-content-between" key={entry.id ?? index}><span><strong>#{entry.rank ?? index + 1}</strong> {entry.name ?? entry.userId}</span><strong>{entry.points ?? 0} pts</strong></div>)}</div>}</section>
}

export default Leaderboard