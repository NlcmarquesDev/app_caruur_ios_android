'use strict'

// let apiBase = import.meta.env.VITE_API_BASE

// import { getApiBase } from '@/config/api'
import { apiFetch } from '@/composables/api'

// const apiBase = getApiBase()

const vehicles = async () => {
  // const apiKey = sessionStorage.getItem('apiKey')
  // if (!apiKey) {
  //   console.warn('API key not found.')
  //   return
  // }
  // try {
  //   const response = await fetch(`${apiBase}/vehicles.php`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: 'Bearer ' + apiKey,
  //     },
  //   })
  //   if (!response.ok) {
  //     console.error('Error getting vehicles:', response.status)
  //     return
  //   }
  //   const data = await response.json()
  //   sessionStorage.setItem('vehicles', JSON.stringify(data))
  //   let vehiclesSelected = data.vehicles && data.vehicles.length > 0 ? data.vehicles[0].ID : null
  //   sessionStorage.setItem('selectedVehicle', vehiclesSelected)
  //   return data
  // } catch (error) {
  //   console.error('Error in the request:', error)
  // }

  const data = await apiFetch('vehicles.php', { method: 'GET' })
  if (!data)
    return {
      success: false,
      message: 'Er is een fout opgetreden bij het ophalen van de voertuigen.',
    }

  if (!data.vehicles || data.vehicles.length === 0) {
    // Geen actieve voertuigen
    return {
      success: false,
      message: 'Er zijn geen actieve voertuigen gekoppeld aan deze account.',
    }
  }
  // if (!data) return

  sessionStorage.setItem('vehicles', JSON.stringify(data))
  let vehiclesSelected = data.vehicles && data.vehicles.length > 0 ? data.vehicles[0].ID : null
  sessionStorage.setItem('selectedVehicle', vehiclesSelected)
  return data
}

export default vehicles
