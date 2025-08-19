<script setup>
import CardMessages from '@/components/CardMessages.vue'
import { ref, onMounted } from 'vue'
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const error = ref('')
const loading = ref(true)
const cards = ref([])

function UpdateMessageCount() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    console.error('API key not found.')
    return
  }

  // fetch('/api/app_webservice/meldingen-notifcations.php?action=update', {
  fetch(`${apiBase}/meldingen-notifcations.php?action=update`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Message count updated:', data)
    })
    .catch((err) => console.error('Network error:', err.message))
}

async function fetchNews() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${apiBase}/get-meldingen.php`, {
      // const res = await fetch('/api/app_webservice/get-meldingen.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
    })
    const data = await res.json()
    if (data.success) {
      if (!data.messages || data.messages.length === 0) {
        error.value = 'Geen berichten gevonden.'
        return
      }
      loading.value = false
      cards.value = data.messages
    } else {
      error.value = data.message || 'Errorm  getting the news.'
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNews()
  UpdateMessageCount()
})
</script>

<template>
  <main id="main-content">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <section id="main-icons">
        <h1>
          <i
            class="fa-solid fa-bullhorn"
            style="color: var(--primary-color); padding-right: 10px"
          ></i>
          Meldingen
        </h1>
      </section>
      <div id="card-container">
        <CardMessages v-for="(card, index) in cards" :card="card" :key="index" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main h1 {
  margin-top: 20px;
}
main {
  margin: 3em 10%;
}
</style>
