<template>
  <!-- Success message -->
  <!-- <div class="success-message" id="success-message">
    <i class="fas fa-check-circle"></i> Instellingen opgeslagen.
  </div> -->

  <section>
    <ShowAlert v-if="alert" />
    <div class="settings-header">
      <h1 class="settings-title">Instellingen</h1>
      <p class="settings-subtitle">Pas uw app-voorkeuren aan</p>
    </div>

    <!-- Notifications Section -->
    <!-- <div class="settings-section">
      <h2 class="section-title"><i class="fas fa-bell"></i> Meldingen</h2>

       <NotificationSetting
        v-for="(notification, index) in notifications"
        :notification="notification"
        :key="index"
      />
    </div> -->

    <!-- Display Section -->
    <div class="settings-section">
      <h2 class="section-title"><i class="fas fa-palette"></i> Weergave</h2>

      <div class="settings-item">
        <div class="item-left">
          <div class="item-title">Thema</div>
          <div class="item-description">Kies uw app-thema</div>
        </div>
        <div class="theme-options">
          <label class="theme-option">
            <input type="radio" name="theme" value="dark" v-model="theme" />
            <span>Donker</span>
          </label>
          <label class="theme-option">
            <input type="radio" name="theme" value="light" v-model="theme" />
            <span>Licht</span>
          </label>
        </div>
      </div>

      <!-- <div class="settings-item">
        <div class="item-left">
          <div class="item-title">Tekstgrootte</div>
          <div class="item-description">Pas de tekstgrootte in de app aan</div>
        </div>
        <div class="item-selector">
          <span class="selector-value">Normaal</span>
          <i class="fas fa-chevron-right selector-arrow"></i>
        </div>
      </div> -->
    </div>

    <!-- Car Settings Section -->
    <!-- <div class="settings-section">
      <h2 class="section-title"><i class="fas fa-car"></i> Auto-instellingen</h2>

      <div class="settings-item">
        <div class="item-left">
          <div class="item-title">Afstandseenheid</div>
          <div class="item-description">Metrisch of imperial</div>
        </div>
        <div class="item-selector">
          <span class="selector-value">Kilometer</span>
          <i class="fas fa-chevron-right selector-arrow"></i>
        </div>
      </div>

      <div class="settings-item">
        <div class="item-left">
          <div class="item-title">Brandstofverbruik</div>
          <div class="item-description">Weergave van brandstofverbruik</div>
        </div>
        <div class="item-selector">
          <span class="selector-value">l/100km</span>
          <i class="fas fa-chevron-right selector-arrow"></i>
        </div>
      </div>
    </div> -->

    <!-- Action Buttons -->
    <!-- <button class="reset-settings" id="reset-button">Instellingen herstellen</button> -->
    <button @click="logoutUser" class="logout-account" id="logout-button">Afmelden</button>
  </section>

  <!-- Reset dialog -->
  <div class="overlay" id="reset-overlay">
    <div class="dialog">
      <h3 class="dialog-title">Instellingen herstellen</h3>
      <div class="dialog-content">
        Weet u zeker dat u alle instellingen wilt terugzetten naar de standaardwaarden? Deze actie
        kan niet ongedaan worden gemaakt.
      </div>
      <div class="dialog-buttons">
        <button class="dialog-btn-cancel" id="reset-cancel">Annuleren</button>
        <button class="dialog-btn-confirm" id="reset-confirm">Herstellen</button>
      </div>
    </div>
  </div>

  <!-- Delete account dialog -->
  <div class="overlay" id="delete-overlay">
    <div class="dialog">
      <h3 class="dialog-title">Account verwijderen</h3>
      <div class="dialog-content">
        Weet u zeker dat u uw account permanent wilt verwijderen? Al uw gegevens worden definitief
        gewist. Deze actie kan niet ongedaan worden gemaakt.
      </div>
      <div class="dialog-buttons">
        <button class="dialog-btn-cancel" id="delete-cancel">Annuleren</button>
        <button class="dialog-btn-confirm delete" id="delete-confirm">Verwijderen</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLogout } from '@/composables/useLogout'
import ShowAlert from '@/components/ShowAlert.vue'
import { ref, watch, onMounted } from 'vue'

const theme = ref('light')
const alert = ref(false)
const errormessage = ref('')
const typeAlert = ref('error')
const { logoutUser } = useLogout()

// const notifications = ref([
//   { title: 'Pushberichten', description: 'Ontvang meldingen op uw apparaat', enabled: true },
//   { title: 'E-mail notificaties', description: 'Ontvang updates per e-mail', enabled: true },
//   {
//     title: 'Onderhoudsmeldingen',
//     description: 'Herinnering voor onderhoud van uw auto',
//     enabled: true,
//   },
//   {
//     title: 'Keuring herinneringen',
//     description: 'Ontvang herinnering voor keuringen',
//     enabled: true,
//   },
// ])

const applyTheme = (value) => {
  document.documentElement.setAttribute('data-theme', value)
}

// Quando a app carregar
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme === 'dark' || savedTheme === 'light') {
    theme.value = savedTheme
  } else {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = systemPrefersDark ? 'dark' : 'light'
  }

  applyTheme(theme.value)

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const userPref = localStorage.getItem('theme')
    if (!userPref) {
      theme.value = e.matches ? 'dark' : 'light'
      applyTheme(theme.value)
      showMessage('theme changed ', 'success')
    }
  })
})

watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem('theme', newTheme)
})

function showMessage(message, type) {
  alert.value = true
  errormessage.value = message
  typeAlert.value = type
  setTimeout(() => {
    alert.value = false
    errormessage.value = ''
  }, 5000)
}
</script>

<style scoped>
section {
  padding: 3rem 3%;
}

/* --------------------------------------
 * Settings Header
 * -------------------------------------- */
.settings-header {
  margin: 25px 0;
  text-align: center;
}

.settings-title {
  color: #f99d1a;
  margin-bottom: 5px;
  font-size: 1.5em;
}

.settings-subtitle {
  color: #aaa;
  font-size: 0.9em;
  font-weight: normal;
}

/* --------------------------------------
 * Settings Sections
 * -------------------------------------- */
.settings-section {
  background-color: (--bg-color);
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #222;
  overflow: hidden;
}

.section-title {
  color: #f99d1a;
  font-size: 1.1em;
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #222;
}

.section-title i {
  margin-right: 10px;
}

/* --------------------------------------
 * Settings List Items
 * -------------------------------------- */
.settings-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #222;
  flex-wrap: wrap;
}

.settings-item:last-child {
  border-bottom: none;
}

/* Special handling for items with theme options - mobile first approach */
.settings-item:has(.theme-options) {
  flex-direction: column;
  align-items: flex-start;
}

.item-left {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 10px;
  min-width: 0; /* Allow text to truncate if needed */
  margin-bottom: 10px; /* Space between description and theme options on mobile */
}

.item-title {
  font-size: 1em;
  margin-bottom: 4px;
}

.item-description {
  font-size: 0.85em;
  color: #aaa;
  white-space: normal;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  min-width: 50px; /* Prevent shrinking */
  flex-shrink: 0; /* Prevent shrinking */
  margin-left: 15px; /* Add space between text and toggle */
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #444;
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #f99d1a;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* Selector */
.item-selector {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.selector-value {
  color: #f99d1a;
  margin-right: 10px;
}

.selector-arrow {
  color: #999;
}

/* Radio buttons for theme selection - Mobile first */
.theme-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  width: 100%;
}

.theme-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 3px 0;
  min-width: 80px;
}

.theme-option input[type='radio'] {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #777;
  margin-right: 8px;
  position: relative;
  flex-shrink: 0;
}

.theme-option input[type='radio']:checked {
  border-color: #f99d1a;
}

.theme-option input[type='radio']:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #f99d1a;
}

.theme-option span {
  white-space: nowrap;
}

/* Reset button */
.reset-settings {
  display: block;
  background-color: transparent;
  border: 1px solid #f99d1a;
  color: #f99d1a;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s;
}

.reset-settings:hover {
  background-color: rgba(249, 157, 26, 0.1);
}

/* Delete account button */
.logout-account {
  display: block;
  background-color: transparent;
  border: 1px solid #e53935;
  color: #e53935;
  padding: 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  width: 100%;
  margin-top: 10px;
}

.delete-account:hover {
  background-color: rgba(229, 57, 53, 0.1);
}

/* --------------------------------------
 * Success message - Mobile optimized
 * -------------------------------------- */
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

/* Overlay for dialogs */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 900;
  display: none;
  align-items: center;
  justify-content: center;
}

/* Dialogs */
.dialog {
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  width: 85%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.dialog-title {
  color: #f99d1a;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.dialog-content {
  margin-bottom: 20px;
  color: #eee;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-btn-cancel {
  background-color: transparent;
  border: 1px solid #777;
  color: #ccc;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.dialog-btn-confirm {
  background-color: #f99d1a;
  border: none;
  color: black;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.dialog-btn-confirm.delete {
  background-color: #e53935;
}

/* --------------------------------------
 * Tablet and desktop styles
 * -------------------------------------- */
@media (min-width: 340px) {
  /* For screens >= 380px, reset the theme options layout */
  .settings-item:has(.theme-options) {
    flex-direction: row;
    align-items: center;
  }

  .item-left {
    margin-bottom: 0;
  }

  .theme-options {
    width: auto;
    justify-content: flex-end;
  }
}

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

  .success-message {
    top: 90px;
    left: auto;
    right: auto;
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
