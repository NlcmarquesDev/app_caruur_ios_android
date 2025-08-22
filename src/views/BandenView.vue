<script setup>
import { ref, onMounted, computed } from 'vue'
import LoadingAuto from '@/components/LoadingAuto.vue'
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const content = ref('')
const infoBanden = ref('')
const error = ref('')
const loading = ref(true)
const carModel = sessionStorage.getItem('selectedVehicle')

function getAPIKey() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    loading.value = false
    return null
  }
  return apiKey
}

async function fetchInfoBanden() {
  let apiKey = getAPIKey()
  try {
    // const res = await fetch('/api/app_webservice/banden.php?action=info&carModel=' + carModel, {
    const res = await fetch(`${apiBase}/banden.php?action=info&carModel=${carModel}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
    })
    const data = await res.json()
    if (data.success) {
      let html = ''
      if (data.content === null || data.content.length === 0) {
        if (data.aantalBanden === 0) {
          infoBanden.value = 'No tires registered for this vehicle.'
        } else {
          html += `
        <div class="banden-aantal">
          <h3>Aantal Banden :  ${data.aantalBanden}</h3>
          </div>
        `
          html += `<p><strong> TOTAAL: </strong>${data.aantalBanden} banden (0 resterend) </p>`
          infoBanden.value = html
        }
      } else {
        let total = ''
        let aantal_verbruikte_banden = 0
        html += `
        <div class="banden-aantal">
          <h3>Aantal Banden :  ${data.aantalBanden}</h3>
          </div>
        `

        html += data.content
          .map((item) => {
            let bandenType = ''
            if (!item.BandenSeizoen) {
              return ''
            }

            if (item.BandenSeizoen === 'Z') {
              bandenType = 'Zomerbanden'
            } else if (item.BandenSeizoen === 'W') {
              bandenType = 'Winterbanden'
            } else if (item.BandenSeizoen === '4') {
              bandenType = '4-Seizoensbanden'
            } else {
              bandenType = 'Onbekend type'
            }
            aantal_verbruikte_banden += parseInt(item.BandenAantal) || 0
            return `
          <div class="banden-item">
            <p><strong> ${item.FactuurDatum}: </strong>${item.BandenAantal} ${bandenType}</p>
          </div> `
          })
          .join('')
        let resterend_aantal_banden = data.aantalBanden
        resterend_aantal_banden = parseInt(resterend_aantal_banden)
        if (isNaN(resterend_aantal_banden)) resterend_aantal_banden = 0
        resterend_aantal_banden = resterend_aantal_banden - aantal_verbruikte_banden

        if (aantal_verbruikte_banden == 0) {
          total = `<p><strong> TOTAAL: </strong>Geen banden opgenomen</p>`
          ;('geen banden opgenomen<br>')
        } else {
          total = `<p><strong> TOTAAL: </strong>${aantal_verbruikte_banden} banden (${resterend_aantal_banden} resterend) </p>`
        }
        html += ` <div class="banden-item">
                    ${total}
                  </div>`
        infoBanden.value = html
      }

      loading.value = false
    } else {
      error.value = data.message || 'Error getting info from the tires.'
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
  } finally {
    loading.value = false
  }
}

async function fetchBanden() {
  let apiKey = getAPIKey()

  try {
    // const res = await fetch('/api/app_webservice/banden.php?action=message', {
    const res = await fetch(`${apiBase}/banden.php?action=message`, {
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
      error.value = data.message || 'Error  getting the tires.'
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBanden()
  fetchInfoBanden()
})
const renderedContent = computed(() => {
  return content.value.replace('[CODE]', infoBanden.value)
})
</script>

<template>
  <main id="main-content">
    <div v-if="loading" class="loading">
      <LoadingAuto />
    </div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else v-html="renderedContent"></div>
  </main>

  <main></main>
</template>

<style>
main {
  margin: 3em 10%;
}
.banden-aantal {
  margin-bottom: 20px;
}
.banden-item p {
  font-size: 16px;
}
</style>
