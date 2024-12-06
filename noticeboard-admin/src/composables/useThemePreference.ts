import { onMounted, ref } from 'vue'

export function useThemePreference() {
  const isDark = ref(false)
  const userPreference = ref<'dark' | 'light' | 'system'>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (localStorage.getItem('theme-preference') as any) || 'system',
  )

  const applyTheme = (dark: boolean) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const storedPreference = userPreference.value

    if (storedPreference === 'system') {
      applyTheme(mediaQuery.matches)
    } else {
      applyTheme(storedPreference === 'dark')
    }

    mediaQuery.addEventListener('change', (e) => {
      if (userPreference.value === 'system') {
        applyTheme(e.matches)
      }
    })
  })

  const setPreference = (preference: 'dark' | 'light' | 'system') => {
    userPreference.value = preference
    localStorage.setItem('theme-preference', preference)

    if (preference === 'system') {
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
    } else {
      applyTheme(preference === 'dark')
    }
  }

  return { isDark, userPreference, setPreference }
}
