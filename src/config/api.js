export const API = {
  dev: import.meta.env.VITE_API_BASE,
  emulator: import.meta.env.VITE_API_BASE_EMULATOR,
  prod: import.meta.env.VITE_API_BASE_PROD,
}

export const getApiBase = () => {
  if (window.Capacitor && window.Capacitor.isNative) return API.emulator
  if (import.meta.env.PROD) return API.prod
  return API.dev
}
