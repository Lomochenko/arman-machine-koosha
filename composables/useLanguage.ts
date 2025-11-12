/**
 * Language Switching Composable with RTL Support
 * Handles language switching, RTL/LTR direction, and localStorage persistence
 */

import { useI18n } from 'vue-i18n'

export const useLanguage = () => {
  const { locale } = useI18n()
  
  /**
   * Switch language with transition animation
   */
  const switchLanguage = async () => {
    try {
      // Get current locale
      const currentLocale = locale.value
      
      // Toggle between 'en' and 'fa'
      const newLocale = currentLocale === 'en' ? 'fa' : 'en'
      
      // Add transition class to trigger animation
      if (process.client) {
        const pageTransition = document.querySelector('.nayla-page-transition')
        if (pageTransition) {
          pageTransition.classList.add('active')
        }
        
        // Wait for transition animation (500ms)
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Change locale
        locale.value = newLocale
        
        // Update HTML dir attribute for RTL/LTR
        updateDirection(newLocale)
        
        // Store locale in localStorage
        localStorage.setItem('locale', newLocale)
        
        // Wait a bit before removing transition
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Remove transition class
        if (pageTransition) {
          pageTransition.classList.remove('active')
        }
      }
    } catch (error) {
      console.error('Error switching language:', error)
    }
  }
  
  /**
   * Update HTML direction attribute based on locale
   */
  const updateDirection = (localeValue: string) => {
    if (process.client) {
      const html = document.documentElement
      if (localeValue === 'fa') {
        html.setAttribute('dir', 'rtl')
        html.classList.add('rtl')
      } else {
        html.setAttribute('dir', 'ltr')
        html.classList.remove('rtl')
      }
    }
  }
  
  /**
   * Initialize direction on mount
   */
  const initializeDirection = () => {
    if (process.client) {
      updateDirection(locale.value)
    }
  }
  
  /**
   * Get current language display name
   */
  const getCurrentLanguage = () => {
    return locale.value === 'en' ? 'EN' : 'FA'
  }
  
  return {
    locale,
    switchLanguage,
    updateDirection,
    initializeDirection,
    getCurrentLanguage
  }
}

