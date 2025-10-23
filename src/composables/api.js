import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

async function refreshAccessToken() {
  const { value: refresh } = await SecureStoragePlugin.get({ key: 'refresh_token' })
  if (!refresh) return false

  const res = await fetch(`${apiBase}/refresh.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  })

  const data = await res.json()
  if (data.access_token) {
    await SecureStoragePlugin.set({ key: 'access_token', value: data.access_token })
    return true
  }

  return false
}

async function apiFetch(endpoint, options = {}) {
  const token = await getAccessToken()

  const res = await fetch(`${apiBase}/${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) throw new Error('Session expired')
    return apiFetch(endpoint, options)
  }

  return res.json()
}

async function getAccessToken() {
  const { value } = await SecureStoragePlugin.get({ key: 'access_token' })
  return value
}
export { apiFetch, getAccessToken }
