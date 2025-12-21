import { createI18n } from 'vue-i18n'
import { defineNuxtPlugin } from 'nuxt/app'
import en from '../locales/en.json'
import fa from '../locales/fa.json'

export default defineNuxtPlugin(({ vueApp }) => {
  try {
    // Get stored locale from localStorage or default to 'fa'
    const storedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') || 'fa' : 'fa'

    const i18n = createI18n({
      legacy: false,
      locale: storedLocale,
      fallbackLocale: 'fa',
      messages: {
        en,
        fa
      },
      // Suppress missing translation warnings in production
      silentTranslationWarn: process.env.NODE_ENV === 'production',
      missingWarn: false,
      fallbackWarn: false,
    })

    vueApp.use(i18n)

    // Make i18n globally available
    return {
      provide: {
        i18n: i18n.global
      }
    }
  } catch (error) {
    console.error('Error initializing i18n:', error)
    // Fallback: create minimal i18n instance
    const fallbackI18n = createI18n({
      legacy: false,
      locale: 'fa',
      fallbackLocale: 'fa',
      messages: { en: {}, fa: {} }
    })
    vueApp.use(fallbackI18n)
  }
})

