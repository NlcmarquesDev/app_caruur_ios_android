// export function isAuthenticated() {
//   return !!sessionStorage.getItem('apiKey') // ou localStorage
// }
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'

export async function isAuthenticated() {
  try {
    const token = await SecureStoragePlugin.get({ key: 'access_token' })
    return !!token?.value
  } catch (err) {
    return false
  }
}

// export function logout() {
//   sessionStorage.removeItem('apiKey')
// }
