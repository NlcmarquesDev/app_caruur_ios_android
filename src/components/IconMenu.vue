<template>
  <router-link :to="path">
    <img class="icon" :src="imagePath" alt="pech icon" />
    <span v-if="!alert">{{ name }}</span>
    <span v-else class="notification"
      >meldingen
      <span
        v-show="Number(notification) >= 1"
        v-if="notification !== 0"
        class="notification-ball"
        >{{ notification }}</span
      ></span
    >
  </router-link>
</template>

<script setup>
import { defineProps, computed } from 'vue'
// const baseUrl = import.meta.env.BASE_URL
const props = defineProps({
  path: String,
  sourceIcon: String,
  name: String,
  notification: {
    type: [Number, String],
    default: 0,
  },
})
// const imagePath = computed(() => `${baseUrl}src/assets/images/${props.sourceIcon}`)
const imagePath = computed(() => {
  return new URL(`/src/assets/images/${props.sourceIcon}`, import.meta.url).href
})
const alert = computed(() => props.notification !== 0)
</script>

<style scoped>
main a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--text-color);
  padding: 10px 5px;
  text-align: center;
  transition:
    background-color 0.2s,
    color 0.2s;
  border-radius: 5px;
}
.notification {
  position: relative;
}

.notification-ball {
  right: -20px;
  width: 25px;
  height: 25px;
  padding: 5px;
  background-color: #f89c2d;
  position: absolute;
  border-radius: 50%;
  top: -25px;
  font-size: 14px;
  font-weight: 600;
}
</style>
