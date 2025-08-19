<script setup>
import IconMenu from '@/components/IconMenu.vue'
import { onMounted, ref } from 'vue'
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const notification = ref('')

const getLastNotification = async () => {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    console.err('API key not found.')
    return
  }

  try {
    // const res = await fetch('/api/app_webservice/meldingen-notifcations.php?action=info', {
    const res = await fetch(`${apiBase}/meldingen-notifcations.php?action=info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
    })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const data = await res.json()
    if (data.success) {
      let lastNotificationSeen = data.messages || 0
      let lastNotificationWrite = data.lastMessage

      let differencelastMessage = lastNotificationWrite - lastNotificationSeen
      if (differencelastMessage > 100) {
        notification.value = '+99'
      } else {
        notification.value = differencelastMessage
      }
    }
  } catch (err) {
    console.error('Network error:', err.message)
  }
}
onMounted(() => {
  getLastNotification()
})
</script>

<template>
  <main>
    <section id="main-icons">
      <IconMenu path="/pech" sourceIcon="pech.svg" name="Pech" />
      <IconMenu path="/ongeval" sourceIcon="ongeval.svg" name="Ongeval" />
      <IconMenu path="/banden" sourceIcon="banden.svg" name="Banden" />
      <IconMenu path="/verzekering" sourceIcon="verzekering.svg" name="Verzekering" />
      <IconMenu path="/onderhoud" sourceIcon="onderhoud.svg" name="Onderhoud" />
      <IconMenu path="/keuring" sourceIcon="keuring.svg" name="Keuring" />
      <IconMenu
        path="/meldingen"
        sourceIcon="meldingen.svg"
        name="meldingen"
        :notification="Number(notification)"
      />
      <IconMenu path="/contact" sourceIcon="contact.svg" name="Contact" />
    </section>
  </main>
</template>

<style scoped>
/* --------------------------------------
 * Main content using flexbox
 * Creates a flexible, wrapped layout for navigation icons
 * -------------------------------------- */

main span {
  font-size: 14px;
  letter-spacing: 2px;
  font-weight: bold;
}
#main-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  margin: 0 10%;
}
/* Estilos para orientação horizontal (landscape) */

/* Estilos para orientação vertical (portrait) */
@media (orientation: portrait) {
  main {
    max-width: 400px;
    margin: 0 auto;
  }
}

/* Opcional: Para telas menores em modo retrato, você pode querer um ícone por linha */
@media (max-width: 600px) and (orientation: portrait) {
  main {
    width: calc(100% - 15px);
  }
}

/* --------------------------------------
 * Navigation item styling
 * Controls layout and interaction states for navigation links
 * -------------------------------------- */
</style>
