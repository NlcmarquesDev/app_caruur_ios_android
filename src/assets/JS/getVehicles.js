'use strict'

// let apiBase = import.meta.env.VITE_API_BASE

import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const vehicles = async () => {
  const apiKey = sessionStorage.getItem('apiKey')

  if (!apiKey) {
    console.warn('API key not found.')
    return
  }

  try {
    const response = await fetch(`${apiBase}/vehicles.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
    })

    if (!response.ok) {
      console.error('Error getting vehicles:', response.status)
      return
    }
    const data = await response.json()
    sessionStorage.setItem('vehicles', JSON.stringify(data))
    sessionStorage.setItem('selectedVehicle', data.vehicles[0].ID)
    return data
  } catch (error) {
    console.error('Error in the request:', error)
  }
}

export default vehicles
