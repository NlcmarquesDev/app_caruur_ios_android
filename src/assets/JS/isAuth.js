// export function isAuthenticated() {
//   return !!sessionStorage.getItem('apiKey') // ou localStorage
// }
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'
import vehicles from '@/assets/JS/getVehicles'

export async function isAuthenticated() {
  try {
    const token = await SecureStoragePlugin.get({ key: 'access_token' })
    // return !!token?.value
    if (!token?.value) return false

    // 🔹 Verifica se existem veículos ativos
    const storedVehicles = sessionStorage.getItem('vehicles')
    let hasVehicles = false

    if (storedVehicles) {
      try {
        const parsed = JSON.parse(storedVehicles)
        hasVehicles = parsed.vehicles && parsed.vehicles.length > 0
      } catch (e) {
        hasVehicles = false
      }
    }

    if (!hasVehicles) {
      // Faz request se não houver dados no sessionStorage
      const vehicleResponse = await vehicles()
      hasVehicles = vehicleResponse.success
    }

    // Se não houver veículos → trata como não autenticado
    return hasVehicles
  } catch (err) {
    return false
  }
}

// export function logout() {
//   sessionStorage.removeItem('apiKey')
// }
