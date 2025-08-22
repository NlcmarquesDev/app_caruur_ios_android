<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import LoadingAuto from '@/components/LoadingAuto.vue'
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const content = ref('')
const error = ref('')
const loading = ref(true)
const month = ref('')
const day = ref('')
const year = ref('')
const kms = ref('')
const nextMaintence = ref('')
const showOnderhoud = ref(false)
const showLastOnderhoud = ref(false)
const showGeenOnderhoud = ref(false)
const selectedVehicle = inject('selectedVehicleId')

function resetData() {
  month.value = ''
  day.value = ''
  year.value = ''
  kms.value = ''
  nextMaintence.value = ''
  showOnderhoud.value = false
  showLastOnderhoud.value = false
  showGeenOnderhoud.value = false
  error.value = ''
  content.value = ''
}

const latestMaintence = async () => {
  resetData()
  loading.value = true
  const apiKey = sessionStorage.getItem('apiKey')

  if (!apiKey) {
    console.warn('API key not found.')
    return
  }
  const vehicleID = selectedVehicle.value

  try {
    const response = await fetch(`${apiBase}/onderhoud.php?vehicleId=${vehicleID}`, {
      // const response = await fetch('/api/app_webservice/onderhoud.php?vehicleId=' + vehicleID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
    })

    if (!response.ok) {
      console.error('Error getting vehicles:', response.status)
      return
    }
    loading.value = false
    const data = await response.json()

    //JS to create the calenders

    if (data['lastMaintence'].length !== 0) {
      const lastMaintence = data['lastMaintence'][0]['Van']
      const lastDate = new Date(lastMaintence)
      month.value = lastDate.toLocaleString('default', { month: 'long' })
      day.value = lastDate.getDate()
      year.value = lastDate.getFullYear()

      showOnderhoud.value = true
      showLastOnderhoud.value = true
      // const onderhoud = !data['lastMaintence'][0]['Onderhoud'] ?? "20000"
      const onderhoud = parseInt(data['lastMaintence'][0]['Onderhoud'] || 20000)
      const actualKms = parseInt(data['lastMaintence'][0]['KMStand'])
      kms.value = actualKms
      nextMaintence.value = onderhoud + actualKms
    } else {
      showGeenOnderhoud.value = true
    }
  } catch (error) {
    console.error('Error in the request:', error)
  }
}

onMounted(() => {
  latestMaintence()
})
watch(selectedVehicle, () => {
  latestMaintence()
})
</script>

<template>
  <main id="main-content">
    <div v-if="loading" class="loading">
      <LoadingAuto />
    </div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else v-html="content"></div>
    <section class="onderhoud" v-show="showOnderhoud">
      <h2>Volgende onderhoud</h2>
      <div class="onderhoud-container">
        <div class="onderhoud-calender">
          <span class="onderhoud-calender-month">{{ month }}</span>
          <span class="onderhoud-calender-day">{{ day }}</span>
          <span class="onderhoud-calender-year">{{ year + 1 }}</span>
        </div>
        <div>OF</div>
        <div class="onderhoud-row">
          <h3>Kilometerstand</h3>
          <p id="onderhoud-row-next">{{ nextMaintence }}</p>
          <span> km</span>
        </div>
      </div>
    </section>
    <section class="last-onderhoud" v-show="showLastOnderhoud">
      <h2>Laatste onderhoud</h2>
      <div class="last-onderhoud-container">
        <div class="last-onderhoud-calender">
          <span class="last-onderhoud-calender-month">{{ month }}</span>
          <span class="last-onderhoud-calender-day">{{ day }}</span>
          <span class="last-onderhoud-calender-year">{{ year }}</span>
        </div>
        <div class="last-onderhoud-row">
          <h3>Kilometerstand</h3>
          <p id="last-onderhoud-row-next">{{ kms }}</p>
          <span> km</span>
        </div>
      </div>
    </section>
    <section class="onderhoud-geen" v-show="showGeenOnderhoud">
      <h2>Geen Onderhoud</h2>
    </section>

    <h1 class="orange">Wat te doen voor onderhoud?</h1>
    <p>De wagen moet elk onderhoud krijgen zoals voorzien door de constructeur.</p>
    <p>
      In het onderhoudsboekje van de wagen kan u terugvinden om de hoeveel kilometer dit moet
      gebeuren. Gelieve dit strikt op te volgen om problemen bij eventuele herstellingen onder
      waarborg te voorkomen.
    </p>
    <p>Gelieve het onderhoud ook te laten uitvoeren bij een officiële dealer of onderagent.</p>
  </main>
</template>

<style scoped>
main {
  margin: 3em 10%;
}
.onderhoud h2,
.last-onderhoud h2,
.onderhoud-geen h2 {
  text-align: center;
}

.onderhoud-geen {
  margin: 20px 0;
}

.onderhoud-container,
.last-onderhoud-container {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.onderhoud-calender,
.last-onderhoud-calender {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid var(--text-color); */
  border-radius: 5px;
  gap: 5px;
  background-color: white;
}

.onderhoud-calender-month,
.last-onderhoud-calender-month {
  /* background-color: #4a8bf7; */
  background-color: var(--primary-color);
  color: white;
  padding: 5px 15px;
  border-radius: 5px 5px 0px 0px;
  text-transform: capitalize;
}

.onderhoud-calender-day,
.onderhoud-calender-year,
.last-onderhoud-calender-day,
.last-onderhoud-calender-year {
  color: black;
}

#last-onderhoud-row-next,
#onderhoud-row-next {
  text-align: center;
  width: 80px;
  margin-top: 19px;
  display: inline-block;
  position: relative;
  background: #444;
  border: 1px solid #444;
  color: #fff;
  border-radius: 4px 0 0 4px;
  height: 24px;
  font-size: 14px;
  line-height: 24px;
  padding: 0px 5px 0px 9px;
  text-align: right;
  letter-spacing: 2px;
}

.last-onderhoud-row span,
.onderhoud-row span {
  color: var(--text-color);
  font-size: 14px;
  border: 2px solid #444;
  padding: 3px 4px 1px 0;
  border-radius: 0px 6px 6px 0px;
}

.last-onderhoud-row,
.onderhoud-row {
  text-align: center;
}

.onderhoud-calender-year,
.last-onderhoud-calender-year {
  border-top: 1px dotted black;
  font-size: 14px;
  padding: 3px 0;
}
</style>
