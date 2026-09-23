import { useEffect, useState } from 'react'
const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const detectedCodespaceName = window.location.hostname.match(/^(.+)-5173\.app\.github\.dev$/)?.[1]
const apiBaseUrl = codespaceName || detectedCodespaceName
  ? `https://${codespaceName || detectedCodespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'
const endpoint = `${apiBaseUrl}/api/teams/`

const getItems = (payload) => Array.isArray(payload) ? payload : payload?.results ?? payload?.data ?? payload?.items ?? []

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetch(endpoint, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Unable to load teams')
      return response.json()
    }).then((payload) => setTeams(getItems(payload))).catch((requestError) => {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    })
    return () => controller.abort()
  }, [])

  return <section><h1 className="display-6 fw-bold">Teams</h1>{error && <div className="alert alert-warning">{error}</div>}<div className="row g-3">{teams.map((team, index) => <div className="col-md-6" key={team.id ?? index}><article className="card h-100"><div className="card-body"><h2 className="h5">{team.name}</h2><p className="text-secondary mb-1">Captain: {team.captain ?? 'Not assigned'}</p><strong>{team.points ?? 0} points</strong></div></article></div>)}</div>{!error && teams.length === 0 && <p className="text-secondary">No teams found.</p>}</section>
}

export default Teams