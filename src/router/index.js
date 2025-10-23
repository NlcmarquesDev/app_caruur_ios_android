import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/assets/JS/isAuth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PechView from '../views/PechView.vue'
import ContactView from '@/views/ContactView.vue'
import BandenView from '@/views/BandenView.vue'
import OnderhoudView from '@/views/OnderhoudView.vue'
import MeldingenView from '@/views/MeldingenView.vue'
import VerzekeringView from '@/views/VerzekeringView.vue'
import MyProfileView from '@/views/SlidingMenu/MyProfileView.vue'
import AutoInfoView from '@/views/SlidingMenu/AutoInfoView.vue'
import SettingsView from '@/views/SlidingMenu/SettingsView.vue'
import OngevalView from '@/views/OngevalView.vue'
import KeuringView from '@/views/KeuringView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/pech',
      name: 'pech',
      component: PechView,
      meta: { requiresAuth: true },
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
      meta: { requiresAuth: true },
    },
    {
      path: '/ongeval',
      name: 'ongeval',
      component: OngevalView,
      meta: { requiresAuth: true },
    },
    {
      path: '/banden',
      name: 'banden',
      component: BandenView,
      meta: { requiresAuth: true },
    },
    {
      path: '/onderhoud',
      name: 'onderhoud',
      component: OnderhoudView,
      meta: { requiresAuth: true },
    },
    {
      path: '/meldingen',
      name: 'meldingen',
      component: MeldingenView,
      meta: { requiresAuth: true },
    },
    {
      path: '/keuring',
      name: 'keuring',
      component: KeuringView,
      meta: { requiresAuth: true },
    },
    {
      path: '/verzekering',
      name: 'verzekering',
      component: VerzekeringView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profiel',
      name: 'profiel',
      component: MyProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/instellingen',
      name: 'instellingen',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/auto/:id',
      name: 'auto',
      component: AutoInfoView,
      meta: { requiresAuth: true },
    },
  ],
})

// router.beforeEach((to, from, next) => {
//   const publicRoutes = ['login', 'register']
//   if (to.meta.requiresAuth && !isAuthenticated()) {
//     next('/login')
//   } else if (publicRoutes.includes(to.name) && isAuthenticated()) {
//     next('/')
//   } else {
//     next()
//   }
// })
router.beforeEach(async (to, from, next) => {
  const publicRoutes = ['login', 'register']
  const authenticated = await isAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    next('/login')
  } else if (publicRoutes.includes(to.name) && authenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
