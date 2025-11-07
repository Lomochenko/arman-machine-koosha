import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', () => {
  const locale = ref('en')

  const setLocale = (lang: string) => {
    locale.value = lang
    if (process.client) {
      localStorage.setItem('locale', lang)
      document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
  }

  const initLocale = () => {
    if (process.client) {
      const saved = localStorage.getItem('locale')
      if (saved) {
        locale.value = saved
        document.documentElement.dir = saved === 'fa' ? 'rtl' : 'ltr'
      }
    }
  }

  return {
    locale,
    setLocale,
    initLocale
  }
})

