import { useEffect, useState } from 'react'
const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const apiBaseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000'
const endpoint = `${apiBaseUrl}/api/users/`

const getItems = (payload) => Array.isArray(payload) ? payload : payload?.results ?? payload?.data ?? payload?.items ?? []

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    fetch(endpoint, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Unable to load users')
      return response.json()
    }).then((payload) => setUsers(getItems(payload))).catch((requestError) => {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    })
    return () => controller.abort()
  }, [])

  return <section><h1 className="display-6 fw-bold">Users</h1>{error && <div className="alert alert-warning">{error}</div>}<div className="table-responsive"><table className="table align-middle"><thead><tr><th>Name</th><th>Email</th><th>Fitness level</th></tr></thead><tbody>{users.map((user, index) => <tr key={user.id ?? index}><td>{user.name ?? '-'}</td><td>{user.email ?? '-'}</td><td>{user.fitnessLevel ?? '-'}</td></tr>)}</tbody></table></div>{!error && users.length === 0 && <p className="text-secondary">No users found.</p>}</section>
}

export default Users