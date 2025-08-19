<script setup>
import SlidingMenu from '@/components/SlidingMenu.vue'
import HeaderMenu from '@/components/HeaderMenu.vue'
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/assets/JS/useTheme.js'

useTheme()

const showMenu = ref(false)
const route = useRoute()
const isLoginPage = computed(() => route.name === 'login')

const selectedVehicle = ref(sessionStorage.getItem('selectedVehicle') || '')
provide('selectedVehicleId', selectedVehicle)
</script>
<template>
  <template v-if="!isLoginPage">
    <HeaderMenu v-model:showMenu="showMenu" />
    <SlidingMenu v-model="showMenu" />
  </template>
  <router-view />
</template>

<style>
/* --------------------------------------
 * Header and logo styles
 * Controls the positioning and size of the logo
 * -------------------------------------- */
header {
  position: sticky;
  top: 0;
  background-color: var(--bg-color);
  padding-bottom: 20px 10%;
  border-bottom: var(--text-color) solid 2px;
  z-index: 10;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2em 10%;
}

.account-logo {
  display: block;
  width: 70%;
  min-width: 50px;
  max-width: 50px;
}

#caruur-logo-no-text {
  display: block;
  width: 70%;
  min-width: 50px;
  max-width: 50px;
}
</style>
