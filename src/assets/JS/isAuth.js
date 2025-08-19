export function isAuthenticated() {
  return !!sessionStorage.getItem('apiKey') // ou localStorage
}

export function logout() {
  sessionStorage.removeItem('apiKey')
}
