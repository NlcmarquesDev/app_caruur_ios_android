<script setup>
// const apiBase = import.meta.env.VITE_API_BASE

import ButtonStandart from '@/components/ButtonStandart.vue'
import LoadingAuto from '@/components/LoadingAuto.vue'
import { ref, onMounted } from 'vue'
import { getApiBase } from '@/config/api'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { Filesystem, Directory } from '@capacitor/filesystem'

const apiBase = getApiBase()
const content = ref('')
const error = ref('')
const loading = ref(true)
const isNative = Capacitor.isNativePlatform()

const handlerdownload = async () => {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    return
  }
  try {
    const res = await fetch(`${apiBase}/aanrijdings-formulier.php`, {
      // const res = await fetch('/api/app_webservice/aanrijdings-formulier.php', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
    })

    const data = await res.json()

    const base64String = data.formulier
    const mimeType = 'application/pdf'
    const fileName = 'aanrijdings-formulier.pdf'

    if (isNative) {
      // 📱 Mobile (Capacitor) → guarda no Filesystem
      await Filesystem.writeFile({
        path: fileName,
        data: base64String,
        directory: Directory.Documents, // ou Directory.Downloads (Android)
      })
      alert(`Bestand opgeslagen als ${fileName}`)
    } else {
      const byteCharacters = atob(base64String)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })

      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = 'aanrijdings-formulier.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(blobUrl)
    }
  } catch (error) {
    console.error('Error making the download:', error)
  }
}

async function fetchContact() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    loading.value = false
    return
  }

  try {
    const res = await fetch(`${apiBase}/ongeval.php`, {
      // const res = await fetch('/api/app_webservice/ongeval.php', {
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
      error.value = data.message || 'Error gwtting the data.'
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
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
    <h1>Ongeval</h1>
    <div class="btn-group">
      <!-- <span @click="handlerdownload"
        >AANRIJDINGSFORMULIER <br />
        DOWNLOADEN</span
      > -->
      <ButtonStandart @click="handlerdownload"
        >AANRIJDINGSFORMULIER<br />
        DOWNLOADEN</ButtonStandart
      >
    </div>
    <div v-if="loading" class="loading">
      <LoadingAuto />
    </div>
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
.btn-group {
  display: flex;
  justify-content: end;
  margin: 20px 0;
}
.btn-group span {
  border: 2px solid #f29200;
  border-radius: 3px;
  padding: 15px 30px;
  color: #f29200;
  text-align: center;
}
</style>
