<script setup>
import { provide, ref } from 'vue'
// import vehicles from './../assets/JS/getVehicles.js'

// vehicles()
const selectedVehicle = ref(sessionStorage.getItem('selectedVehicle') || '')
provide('selectedVehicle', selectedVehicle)
</script>

<template>
  <slot />
</template>
