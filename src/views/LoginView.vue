<template>
  <div class="logo-container">
    <img class="logo" src="./../assets/images/logo-without-text.jpg" alt="Caruur logo" />
  </div>

  <div class="login-container">
    <h1 class="login-title">Inloggen bij Caruur</h1>

    <p v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i> Ongeldige inloggegevens. Probeer het opnieuw.
    </p>

    <form class="login-form" id="login-form" @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">E-mailadres</label>
        <div class="input-group">
          <input v-model="email" type="email" id="email" required autocomplete="email" />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Wachtwoord</label>
        <div class="input-group">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            required
            autocomplete="current-password"
          />
          <button type="button" @click="togglePassword" class="toggle-password">
            <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
          </button>
        </div>
      </div>

      <div class="remember-forgot">
        <div class="remember-me">
          <input type="checkbox" id="remember" v-model="remember" />
          <label for="remember">Onthoud mij</label>
        </div>
        <a href="#" class="forgot-password">Wachtwoord vergeten?</a>
      </div>

      <button type="submit" class="login-button">Inloggen</button>
      <!--
            <div class="register-link">
                Nog geen account? <a href="#">Registreer nu</a>
            </div> -->
    </form>
  </div>

  <footer>&copy; 2025 Caruur. Alle rechten voorbehouden.</footer>
</template>

<script setup>
// const apiBase = import.meta.env.VITE_API_BASE
import { getApiBase } from '@/config/api'

const apiBase = getApiBase()
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref(false)
const remember = ref(false)

function togglePassword() {
  showPassword.value = !showPassword.value
}
onMounted(() => {
  const savedEmail = localStorage.getItem('savedEmail')
  if (savedEmail) {
    email.value = savedEmail
    remember.value = true
  }
})

async function handleLogin() {
  if (remember.value) {
    localStorage.setItem('savedEmail', email.value)
  } else {
    localStorage.removeItem('savedEmail')
  }

  try {
    // const res = await fetch('/api/app_webservice/authenticate.php', {
    const res = await fetch(`${apiBase}/authenticate.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (data.success) {
      sessionStorage.setItem('apiKey', data.api_key)
      sessionStorage.setItem('contactID', data.user['ContactID'])
      router.push({ name: 'home' })
    } else {
      showError()
    }
  } catch (err) {
    console.error(err)
    showError()
  }
}

function showError() {
  error.value = true
  setTimeout(() => {
    error.value = false
  }, 5000)
}
</script>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  padding: 120px 0 20px;
}

.logo {
  width: 120px;
  height: auto;
}

/* --------------------------------------
         * Login form styles
         * -------------------------------------- */
.login-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.login-title {
  color: #f99d1a;
  margin-bottom: 30px;
  text-align: center;
  font-size: 1.8em;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 1.1em;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #333;
  background-color: var(--bg-color);
  color: var(--text-color);
  border-radius: 5px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #f99d1a;
}

.input-group .toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #777;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 0.9em;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 8px;
  accent-color: #f99d1a;
}

.forgot-password {
  color: #f99d1a;
  text-decoration: none;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: #f99d1a;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button a {
  color: #000;
  text-decoration: none;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  font-size: 1em;
}
.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

/* Fix for autofill background color in Chrome, Edge, Safari */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #1a1a1a inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* Fix for Firefox */
input:autofill {
  background-color: #1a1a1a !important;
  color: white !important;
}

/* --------------------------------------
* Footer styles
* -------------------------------------- */
footer {
  text-align: center;
  padding: 20px;
  font-size: 0.8em;
  color: #777;
  margin-top: auto;
}
</style>
