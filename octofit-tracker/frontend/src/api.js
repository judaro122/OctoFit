const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export const getResourceUrl = (resource) => `${apiBaseUrl}/api/${resource}/`

export const getResourceItems = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

export const fetchResource = async (resource, signal) => {
  const response = await fetch(getResourceUrl(resource), { signal })
  if (!response.ok) throw new Error(`Unable to load ${resource}`)
  return getResourceItems(await response.json())
}