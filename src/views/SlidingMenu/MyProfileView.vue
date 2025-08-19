<template>
  <div class="success-message" id="success-message">
    <i class="fas fa-check-circle"></i> Uw profiel is succesvol bijgewerkt.
  </div>

  <section>
    <div class="profile-header">
      <h1 class="profile-title">Mijn Profiel</h1>
    </div>

    <!-- <div class="profile-avatar">
      <i class="fas fa-user"></i>
    </div>

    <div class="edit-avatar">
      <button type="button"><i class="fas fa-camera"></i> Foto Uploaden</button>
    </div> -->

    <!-- Personal Information Section -->
    <div class="profile-section">
      <h2 class="section-title"><i class="fas fa-user-circle"></i> Persoonlijke Gegevens</h2>
      <form id="personal-form">
        <div class="form-group">
          <label for="firstName">Voornaam</label>
          <input type="text" id="firstName" v-model="firstName" disabled />
        </div>
        <div class="form-group">
          <label for="lastName">Achternaam</label>
          <input type="text" id="lastName" v-model="lastName" disabled />
        </div>
        <div class="form-group">
          <label for="email">E-mailadres</label>
          <div class="input-with-icon">
            <input type="email" id="email" v-model="email" disabled />
            <i class="fas fa-envelope icon"></i>
          </div>
        </div>
        <div class="form-group">
          <label for="phone">Telefoonnummer</label>
          <div class="input-with-icon">
            <input type="tel" id="phone" v-model="phone" disabled />
            <i class="fas fa-phone icon"></i>
          </div>
        </div>
        <!-- <div class="section-actions">
          <button type="button" class="cancel-btn">Annuleren</button>
          <button type="submit" class="save-btn">Opslaan</button>
        </div> -->
      </form>
    </div>

    <!-- Address Section -->
    <div class="profile-section">
      <h2 class="section-title"><i class="fas fa-home"></i> Adresgegevens</h2>
      <form id="address-form">
        <div class="form-group">
          <label for="street">Straat en huisnummer</label>
          <input type="text" id="street" v-model="street" disabled />
        </div>
        <div class="form-group">
          <label for="postalCode">Postcode</label>
          <input type="text" id="postalCode" v-model="postalCode" disabled />
        </div>
        <div class="form-group">
          <label for="city">Woonplaats</label>
          <input type="text" id="city" v-model="city" disabled />
        </div>
        <div class="form-group">
          <label for="country">Land</label>
          <select id="country" v-model="country" disabled>
            <option value="be">België</option>
            <option value="nl">Nederland</option>
            <option value="de">Duitsland</option>
            <option value="fr">Frankrijk</option>
          </select>
        </div>
        <!-- <div class="section-actions">
          <button type="button" class="cancel-btn">Annuleren</button>
          <button type="submit" class="save-btn">Opslaan</button>
        </div> -->
      </form>
    </div>
    <ShowAlert v-if="error" :errorMessage="errormessage" :type="typeAlert" />
    <!-- Password Section -->
    <div class="profile-section">
      <h2 class="section-title"><i class="fas fa-lock"></i> Wachtwoord Wijzigen</h2>
      <form id="password-form">
        <div class="form-group">
          <label for="currentPassword">Huidig wachtwoord</label>
          <div class="input-with-icon">
            <input type="password" id="currentPassword" v-model="currentPass" />
            <i class="fas fa-eye-slash icon toggle-password" data-for="currentPassword"></i>
          </div>
        </div>

        <div class="form-group">
          <label for="newPassword">Nieuw wachtwoord</label>
          <div class="input-with-icon">
            <input type="password" id="newPassword" v-model="newPass" />
            <i class="fas fa-eye-slash icon toggle-password" data-for="newPass"></i>
          </div>
          <div class="password-strength">
            <div class="strength-meter">
              <div id="strength-bar"></div>
            </div>
            <div class="strength-text" id="strength-text">Voer een nieuw wachtwoord in</div>
          </div>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Herhaal nieuw wachtwoord</label>
          <div class="input-with-icon">
            <input type="password" id="confirmPassword" v-model="confirmPass" />
            <i class="fas fa-eye-slash icon toggle-password" data-for="confirmPassword"></i>
          </div>
        </div>
        <div class="section-actions">
          <ButtonInput :classes="cancelBtn"> Annuleren </ButtonInput>
          <ButtonInput :classes="saveBtn" @click="handleNewPass"> Wachtwoord Wijzigen </ButtonInput>
          <!-- <button type="button" class="cancel-btn">Annuleren</button>
          <button type="button" class="save-btn" @click="handleNewPass">Wachtwoord Wijzigen</button> -->
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import ButtonInput from '@/components/ButtonInput.vue'
import ShowAlert from '@/components/ShowAlert.vue'
import { ref, onMounted } from 'vue'
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()

const error = ref('')
const errormessage = ref('')
const typeAlert = ref('error')
const loading = ref(true)
const currentPass = ref('')
const newPass = ref('')
const confirmPass = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const street = ref('')
const postalCode = ref('')
const city = ref('')
const country = ref('')
const cancelBtn = 'cancel-btn'
const saveBtn = 'save-btn'

function getAPIKey() {
  const apiKey = sessionStorage.getItem('apiKey')
  if (!apiKey) {
    error.value = 'API key not found.'
    loading.value = false
    return null
  }
  return apiKey
}
async function fetchGetInfoUser() {
  let apiKey = getAPIKey()
  let contactID = sessionStorage.getItem('contactID')
  try {
    const res = await fetch(
      // '/api/app_webservice/settings.php?action=getInfo&contact=' + contactID,
      `${apiBase}/settings.php?action=getInfo&contact=` + contactID,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
      },
    )
    const data = await res.json()
    if (data.success) {
      if (data.content !== null || data.content.length !== 0) {
        firstName.value = data.content.FirstName || data.content.CompanyName
        lastName.value = data.content.LastName || ''
        email.value = data.content.EmailAddress || ''
        phone.value = data.content.CellPhoneNumber || ''
        street.value = data.content.AddressLine1 || ''
        postalCode.value = data.content.PostalCode || ''
        city.value = data.content.City || ''
        country.value = (data.content.CountryCode || '').toLowerCase()
      }
    }
  } catch (err) {
    error.value = 'Network error: ' + err.message
  }
}

async function handleNewPass() {
  let apiKey = getAPIKey()
  if (!newPass.value || !confirmPass.value || !currentPass.value) {
    showMessage('all need to be insert')
    return
  }

  if (newPass.value !== confirmPass.value) {
    showMessage('the new and reaped pass dont match')
    return
  }
  try {
    // const res = await fetch('/api/app_webservice/newPassword.php', {
    const res = await fetch(`${apiBase}/newPassword.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        currentPass: currentPass.value,
        newPassword: newPass.value,
      }),
    })

    const data = await res.json()

    if (data.success) {
      showMessage(data.content, 'success')
    } else {
      showMessage('The current pass not match')
    }
  } catch (err) {
    console.error(err)
    showMessage()
  }
}
function showMessage(message, type) {
  error.value = true
  errormessage.value = message
  typeAlert.value = type
  setTimeout(() => {
    error.value = false
    errormessage.value = ''
  }, 5000)
}

onMounted(() => {
  fetchGetInfoUser()
})
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
  color: white;
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s ease;
  -webkit-appearance: none;
  /* Removes default styling on iOS */
  appearance: none;
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
  right: 1%;
  top: 51%;
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
</style>
