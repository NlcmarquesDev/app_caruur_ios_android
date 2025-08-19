import { ref, watchEffect, onMounted } from 'vue'

const theme = ref('light')

export function useTheme() {
  const setTheme = (value) => {
    theme.value = value
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem('theme', value)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')

    if (saved) {
      setTheme(saved)
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(systemDark ? 'dark' : 'light')
    }

    // Detectar alteração no sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const systemPref = e.matches ? 'dark' : 'light'
      const savedTheme = localStorage.getItem('theme')

      if (!savedTheme) {
        setTheme(systemPref)
      }
    })
  })

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}
