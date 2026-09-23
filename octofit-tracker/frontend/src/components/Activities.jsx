import { useEffect, useState } from 'react'
import { fetchResource } from '../api.js'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchResource('activities', controller.signal).then(setActivities).catch((requestError) => {
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