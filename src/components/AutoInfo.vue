<template>
  <ShowAlert v-if="loading" type="loading" />

  <section>
    <div class="profile-header">
      <h1 class="profile-title">Uw voertuig</h1>
      <span class="license">{{ props.number }}</span>
    </div>
    <ShowAlert v-if="error" :errorMessage="errormessage" :type="typeAlert" />

    <!-- Personal Information Section -->
    <div class="profile-section">
      <h2 class="section-title"><i class="fa-solid fa-car"></i> Auto Name</h2>
      <div class="form-group">
        <label for="typeAuto">Type Wagen</label>
        <input type="text" id="typeAuto" v-model="auto.typeAuto" disabled />
      </div>
      <div class="form-group">
        <label for="chassisnr">Chassisnummer</label>
        <input type="text" id="chassisnr" v-model="auto.chassisnr" disabled />
      </div>
      <div class="form-group">
        <label for="motor">Motor</label>
        <div class="input-with-icon">
          <input type="text" id="motor" v-model="auto.motor" disabled />
        </div>
      </div>
      <div class="form-group">
        <label for="co2">CO2 uitstoot</label>
        <div class="input-with-icon">
          <input type="tel" id="co2" v-model="auto.co2" disabled />
        </div>
      </div>
      <div class="form-group">
        <label for="brandstof">Brandstof</label>
        <div class="input-with-icon">
          <input type="tel" id="brandstof" v-model="auto.brandstof" disabled />
        </div>
      </div>
    </div>

    <!-- Address Section -->
    <div class="profile-section">
      <h2 class="section-title"><i class="fa-solid fa-file-signature"></i> Contract gegevens</h2>
      <div class="form-group">
        <label for="contractnr">Nummer Contract</label>
        <input type="text" id="contractnr" v-model="contract.contractnr" disabled />
      </div>
      <div class="form-group">
        <label for="startContract">Begin Contract</label>
        <input type="text" id="startContract" v-model="contract.startContract" disabled />
      </div>
      <div class="form-group">
        <label for="endContract">Einde Contract</label>
        <input type="text" id="endContract" v-model="contract.endContract" disabled />
      </div>
      <div class="form-group">
        <label for="kmsIncluded">Km Inbegrepen</label>
        <input type="text" id="kmsIncluded" v-model="contract.kmsIncluded" disabled />
      </div>
    </div>

    <!-- Password Section -->
    <div class="profile-section">
      <h2 class="section-title"><i class="fa-solid fa-square-virus"></i> Opties</h2>
      <div class="form-group checkbox-container">
        <label for="maintence">Onderhoud</label>
        <input
          class="checkbox"
          type="checkbox"
          id="maintence"
          v-model="options.maintence"
          disabled
        />
      </div>

      <div class="form-group checkbox-container">
        <label for="tires">Banden</label>
        <input class="checkbox" type="checkbox" id="tires" v-model="options.tires" disabled />
      </div>
    </div>
  </section>
</template>

<script setup>
import ShowAlert from '@/components/ShowAlert.vue'
import { ref, reactive, watch } from 'vue'
const apiBase = import.meta.env.VITE_API_BASE

const props = defineProps({
  id: Number,
  number: String,
  contractId: Number,
})
const error = ref(false)
const loading = ref(false)
// const errormessage = ref('')
// const typeAlert = ref('')

const auto = reactive({
  typeAuto: '',
  chassisnr: '',
  motor: '',
  co2: '',
  brandstof: '',
})

const contract = reactive({
  contractnr: '',
  startContract: '',
  endContract: '',
  kmsIncluded: '',
})

const options = reactive({
  maintence: false,
  tires: false,
})
fetchGetInfoAuto()
function getAPIKey() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    loading.value = false
    return null
  }
  return apiKey
}
async function fetchGetInfoAuto() {
  let apiKey = getAPIKey()
  try {
    // const res = await fetch('/api/app_webservice/auto-info.php?contract=' + props.contractId, {
    const res = await fetch(`${apiBase}/auto-info.php?contract=${props.contractId}`, {
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
      if (data.content && Object.keys(data.content).length > 0) {
        let typeAuto = data.content.Merk + ' ' + data.content.Type || ''
        auto.typeAuto = typeAuto || ''
        auto.chassisnr = data.content.ChassisNummer || ''
        auto.motor = data.content.Motor || ''
        auto.co2 = data.content.CO2 || ''
        auto.brandstof = data.content.Brandstof || ''
        contract.contractnr = data.content.ContractNummer || ''
        contract.startContract = data.content.Begindatum || ''
        contract.endContract = data.content.Einddatum || ''
        contract.kmsIncluded = data.content.InbegrepenKm || ''
        options.maintence = Number(data.content.OptieOnderhoud) === 1 || ''
        options.tires = Number(data.content.OptieWinterbandenAantal) !== 0 || ''
      }
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
  }
}

watch(
  () => props.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchGetInfoAuto()
    }
  },
  {
    immediate: true,
  },
)
</script>

<style scoped>
section {
  padding: 3rem 3%;
}

/* --------------------------------------
* Profile styles - Mobile optimized
* -------------------------------------- */
.profile-header {
  margin: 1em 0;
  text-align: center;
}

.profile-title {
  color: #f99d1a;
  margin: 5px 0;
  font-size: 1.5em;
}

.profile-subtitle {
  color: #aaa;
  font-size: 0.9em;
  font-weight: normal;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #333;
  margin: 0 auto 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  color: #f99d1a;
  border: 2px solid #444;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar {
  margin-top: -10px;
  margin-bottom: 25px;
  text-align: center;
}

.edit-avatar button {
  background-color: transparent;
  border: none;
  color: #ffffff;
  font-size: 0.8em;
  cursor: pointer;
  padding: 5px 10px;
}

/* --------------------------------------
* Form styles - Mobile optimized
* -------------------------------------- */
.profile-section {
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #222;
}

.section-title {
  color: #f99d1a;
  margin-bottom: 15px;
  font-size: 1.1em;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 8px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #ccc;
  font-size: 0.9em;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #333;
  background-color: var(--bg-input);
  color: var(--bg-text);
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s ease;
  /* -webkit-appearance: none; */
  /* Removes default styling on iOS */
  /* appearance: none; */
}

/* More touch-friendly select element for mobile */
.form-group select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23F99D1A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  padding-right: 30px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #f99d1a;
  box-shadow: 0 0 0 1px rgba(249, 157, 26, 0.3);
}

.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-right: 40px;
}

.input-with-icon .icon {
  position: absolute;
  right: -10%;
  top: 125%;
  transform: translateY(-50%);
  color: #777;
  font-size: 1em;
  padding: 10px;
  /* Larger touch target for mobile */
}

/* Section actions - Mobile optimized with full-width buttons */
.section-actions {
  display: flex;
  flex-direction: column;
  /* Stack buttons on mobile for easier touch */
  gap: 10px;
  margin-top: 15px;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid #444;
  color: #ccc;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  width: 100%;
  /* Full width on mobile */
  order: 2;
  /* Moves cancel below save on mobile */
}

.save-btn {
  background-color: #f99d1a;
  border: none;
  color: #000;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  width: 100%;
  /* Full width on mobile */
  order: 1;
  /* Ensures save is on top */
}

.cancel-btn:active {
  background-color: rgba(255, 255, 255, 0.05);
}

.save-btn:active {
  background-color: #e08c15;
}

/* Password strength indicator - Mobile optimized */
.password-strength {
  margin-top: 8px;
  font-size: 0.8em;
}

.strength-meter {
  height: 5px;
  background-color: #333;
  border-radius: 3px;
  margin-bottom: 5px;
}

.strength-meter div {
  height: 100%;
  border-radius: 3px;
  width: 0%;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.strength-meter div.weak {
  background-color: #dc3545;
  width: 33%;
}

.strength-meter div.medium {
  background-color: #ffc107;
  width: 66%;
}

.strength-meter div.strong {
  background-color: #28a745;
  width: 100%;
}

.strength-text {
  color: #aaa;
}

/* Success message - Mobile optimized */
.success-message {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  padding: 12px 15px;
  border-radius: 5px;
  margin: 0 15px 20px;
  font-size: 0.9em;
  border-left: 3px solid #28a745;
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.success-message i {
  margin-right: 8px;
}

/* --------------------------------------
* Tablet and desktop styles
* -------------------------------------- */
@media (min-width: 600px) {
  header {
    margin: 20px 10% 30px;
    border-bottom: #ffffff solid 2px;
  }

  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 20px 50px;
  }

  .section-actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .cancel-btn {
    width: auto;
    padding: 10px 20px;
    margin-right: 10px;
    order: 1;
  }

  .save-btn {
    width: auto;
    padding: 10px 20px;
    order: 2;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }

  .form-group {
    flex: 1 1 calc(50% - 15px);
    min-width: 0;
  }

  .form-group.full-width {
    flex: 1 1 100%;
  }

  .success-message {
    top: 90px;
    left: auto;
    right: auto;
    max-width: 600px;
    margin: 0 auto;
  }
}
.checkbox-container {
  display: flex;
  justify-content: space-between;
}

.form-group input[type='checkbox'] {
  width: 40px;
}
.checkbox {
  appearance: auto;
  -webkit-appearance: checkbox;
  accent-color: var(--bg-input);
  height: 23px;
}
</style>
