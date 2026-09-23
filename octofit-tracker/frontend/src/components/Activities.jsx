import { useEffect, useState } from 'react'
const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const detectedCodespaceName = window.location.hostname.match(/^(.+)-5173\.app\.github\.dev$/)?.[1]
const apiBaseUrl = codespaceName || detectedCodespaceName
  ? `https://${codespaceName || detectedCodespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'
const endpoint = `${apiBaseUrl}/api/activities/`

const getItems = (payload) => Array.isArray(payload) ? payload : payload?.results ?? payload?.data ?? payload?.items ?? []

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch(endpoint, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Unable to load activities')
      return response.json()
    }).then((payload) => setActivities(getItems(payload))).catch((requestError) => {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    })
    return () => controller.abort()
  }, [])

  return <ResourceTable title="Activities" error={error} items={activities} columns={['type', 'durationMinutes', 'calories']} />
}

function ResourceTable({ title, error, items, columns }) {
  return (
    <section>
      <h1 className="display-6 fw-bold">{title}</h1>
      {error && <div className="alert alert-warning">{error}</div>}
      {!error && items.length === 0 ? <p className="text-secondary">No activities found.</p> : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>{items.map((item, index) => <tr key={item.id ?? index}>{columns.map((column) => <td key={column}>{item[column] ?? '-'}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Activities