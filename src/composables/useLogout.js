import { useRouter } from 'vue-router'
import { logout } from '@/assets/JS/isAuth.js'

export function useLogout() {
  const router = useRouter()

  function logoutUser() {
    logout()
    router.push({ name: 'login' })
  }

  return {
    logoutUser,
  }
}
