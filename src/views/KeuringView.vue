<script setup>
import { ref, onMounted, inject, watch } from 'vue'

const content = ref('')
const error = ref('')
const loading = ref(true)
const month = ref('')
const day = ref('')
const year = ref('')
const monthNext = ref('')
const dayNext = ref('')
const yearNext = ref('')
const showkeuring = ref(false)
const showLastkeuring = ref(false)
const showGeenkeuring = ref(false)
const selectedVehicle = inject('selectedVehicleId')
const geenMessage = ref('Geen keuring')
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

function resetData() {
  month.value = ''
  day.value = ''
  year.value = ''
  monthNext.value = ''
  dayNext.value = ''
  yearNext.value = ''
  showkeuring.value = false
  showLastkeuring.value = false
  showGeenkeuring.value = false
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
    // const response = await fetch('/api/app_webservice/keuring.php?model=' + vehicleID, {
    const response = await fetch(`${apiBase}/keuring.php?model=${vehicleID}`, {
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
    console.log(data.content[0])

    //JS to create the calenders
    if (data.content[0].length !== 0) {
      const lastMaintence = data.content[0]['DatumTechnischeControle']
      console.log('Last Maintence:', lastMaintence)
      if (lastMaintence !== null && lastMaintence !== '') {
        const lastDate = new Date(lastMaintence)
        const currentDate = new Date()

        const tenYearsAgo = new Date()
        tenYearsAgo.setFullYear(currentDate.getFullYear() - 10)
        if (lastDate < tenYearsAgo) {
          geenMessage.value = 'Geen keuring beschikbaar'
          showGeenkeuring.value = true
        } else {
          month.value = lastDate.toLocaleString('default', { month: 'long' })
          day.value = lastDate.getDate()
          year.value = lastDate.getFullYear()
          showLastkeuring.value = true
        }
      }
      const NextMaintence = data.content[0]['NextInspectionDate']
      console.log('Next Maintence:', NextMaintence)
      if (NextMaintence !== null && NextMaintence !== '') {
        const NextDate = new Date(NextMaintence)
        monthNext.value = NextDate.toLocaleString('default', { month: 'long' })
        dayNext.value = NextDate.getDate()
        yearNext.value = NextDate.getFullYear()
        showkeuring.value = true
      }
    } else {
      showGeenkeuring.value = true
    }
  } catch (error) {
    console.error('Error in the request:', error)
  }
}

onMounted(() => {
  latestMaintence()
})
watch(selectedVehicle, (newId, oldId) => {
  console.log('Numberplate changed:', oldId, '→', newId)
  latestMaintence()
})
</script>

<template>
  <main id="main-content">
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else v-html="content"></div>
    <section class="keuring" v-show="showkeuring">
      <h2>Volgende keuring</h2>
      <div class="keuring-container">
        <div class="keuring-calender">
          <span class="keuring-calender-month">{{ monthNext }}</span>
          <span class="keuring-calender-day">{{ dayNext }}</span>
          <span class="keuring-calender-year">{{ yearNext }}</span>
        </div>
      </div>
    </section>
    <section class="last-keuring" v-show="showLastkeuring">
      <h2>Laatste keuring</h2>
      <div class="last-keuring-container">
        <div class="last-keuring-calender">
          <span class="last-keuring-calender-month">{{ month }}</span>
          <span class="last-keuring-calender-day">{{ day }}</span>
          <span class="last-keuring-calender-year">{{ year }}</span>
        </div>
      </div>
    </section>
    <section class="keuring-geen" v-show="showGeenkeuring">
      <h2>{{ geenMessage }}</h2>
    </section>

    <h1 class="orange">Wat te doen voor keuring?</h1>
    <p>De wagen moet elk keuring krijgen zoals voorzien door de constructeur.</p>
    <p>
      In het keuringsboekje van de wagen kan u terugvinden om de hoeveel kilometer dit moet
      gebeuren. Gelieve dit strikt op te volgen om problemen bij eventuele herstellingen onder
      waarborg te voorkomen.
    </p>
    <p>Gelieve het keuring ook te laten uitvoeren bij een officiële dealer of onderagent.</p>
  </main>
</template>

<style scoped>
main {
  margin: 3em 10%;
}
.keuring h2,
.last-keuring h2,
.keuring-geen h2 {
  text-align: center;
}

.keuring-geen {
  margin: 20px 0;
}

.keuring-container,
.last-keuring-container {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
}

.keuring-calender,
.last-keuring-calender {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--text-color);
  border-radius: 5px;
  gap: 5px;
  background-color: white;
  min-width: 80px;
}

.keuring-calender-month,
.last-keuring-calender-month {
  background-color: #4a8bf7;
  color: white;
  padding: 5px 15px;
  border-radius: 5px 5px 0px 0px;
  text-transform: capitalize;
  text-align: center;
  width: 100%;
}

.keuring-calender-day,
.keuring-calender-year,
.last-keuring-calender-day,
.last-keuring-calender-year {
  color: black;
}

#last-keuring-row-next,
#keuring-row-next {
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

.last-keuring-row span,
.keuring-row span {
  color: var(--text-color);
  font-size: 14px;
  border: 2px solid #444;
  padding: 3px 4px 1px 0;
  border-radius: 0px 6px 6px 0px;
}

.last-keuring-row,
.keuring-row {
  text-align: center;
}

.keuring-calender-year,
.last-keuring-calender-year {
  border-top: 1px dotted black;
  font-size: 14px;
  padding: 3px 0;
}
</style>
