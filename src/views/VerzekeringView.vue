<script setup>
import ButtonStandart from '@/components/ButtonStandart.vue'
import { inject } from 'vue'
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const selectedVehicle = inject('selectedVehicleId')

const apiKey = sessionStorage.getItem('apiKey')

const handlerPreview = async (selectedVehicle) => {
  if (selectedVehicle) {
    const res = await fetch(
      `${apiBase}/insurance-green-card.php?vehicleId=${selectedVehicle}`,
      // '/api/app_webservice/insurance-green-card.php?vehicleId=' + selectedVehicle,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
      },
    )

    const data = await res.json()
    if (data.success) {
      const greenCard = data.greencard
      const mimeType = 'application/pdf'

      const byteCharacters = atob(greenCard)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: mimeType })

      const blobUrl = URL.createObjectURL(blob)

      window.open(blobUrl, '_blank')
    }
  } else {
    alert('Selecteer eerst een voertuig.')
  }
}
const handlerDownload = async (selectedVehicle) => {
  try {
    const res = await fetch(
      `${apiBase}/insurance-green-card.php?vehicleId=${selectedVehicle}`,
      // '/api/app_webservice/insurance-green-card.php?vehicleId=' + selectedVehicle,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
      },
    )

    const data = await res.json()

    const base64String = data.greencard
    const mimeType = 'application/pdf'
    const fileName = selectedVehicle + 'green-card.pdf'

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
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error making the download:', error)
  }
}
</script>
<template>
  <main id="main-content">
    <section id="content-greencard">
      <h1>Verzekering</h1>
      <div class="box-greencard">
        <ButtonStandart @click="() => handlerPreview(selectedVehicle)">Bekijken</ButtonStandart>
        <ButtonStandart @click="() => handlerDownload(selectedVehicle)">Download</ButtonStandart>
        <!-- <span @click="() => handlerPreview(selectedVehicle)">Bereeken</span>
        <span @click="() => handlerDownload(selectedVehicle)">Download</span> -->
      </div>
    </section>
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
main-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
#content-greencard {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 100px;
  max-height: 500px;
}
#content-greencard h1 {
  margin-top: 50px;
}
.box-greencard {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.box-greencard span {
  border: 2px solid #f29200;
  border-radius: 3px;
  padding: 15px 30px;
  color: #f29200;
}
</style>
