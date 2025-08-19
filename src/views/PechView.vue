<script setup>
import { ref, onMounted } from 'vue'
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const content = ref('')
const error = ref('')
const loading = ref(true)

async function fetchPech() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${apiBase}/pech.php`, {
      // const res = await fetch('/api/app_webservice/pech.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
    })
    const data = await res.json()
    if (data.success) {
      content.value = data.content
    } else {
      error.value = data.message || 'Error getting pech data.'
    }
  } catch (err) {
    error.value = 'Erro de rede: ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPech()
})
</script>

<template>
  <main id="main-content">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else v-html="content"></div>
  </main>
</template>

<style scoped>
main {
  margin: 3em 10%;
}
</style>
