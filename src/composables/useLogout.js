import { useRouter } from 'vue-router'
import { logout } from '@/assets/JS/isAuth.js'
import { Preferences } from '@capacitor/preferences'

export function useLogout() {
  const router = useRouter()

  async function logoutUser() {
    logout()
    sessionStorage.clear()
    await Preferences.remove({ key: 'apiKey' })
    await Preferences.remove({ key: 'contactID' })
    router.push({ name: 'login' })
  }

  return {
    logoutUser,
  }
}
