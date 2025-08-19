<script setup>
import { ref, onMounted } from 'vue'

const content = ref('')
const error = ref('')
const loading = ref(true)
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

async function fetchContact() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    loading.value = false
    return
  }

  try {
    // const res = await fetch('/api/app_webservice/contact.php', {
    const res = await fetch(`${apiBase}/contact.php`, {
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
      error.value = data.message || 'Error getting contact.'
    }
  } catch (err) {
    error.value = 'Neteork error: ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchContact()
})
</script>
<template>
  <main id="main-content">
    <div v-if="loading">Carregando...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else v-html="content"></div>
  </main>
</template>

<style scoped>
main {
  margin: 3em 10%;
}
.error-message {
  background-color: rgba(220, 53, 69, 0.1);
  color: #ff6b6b;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 0.9em;
  border-left: 4px solid #ff6b6b;
}
.contact-info {
  margin-bottom: 20px;
}
</style>
