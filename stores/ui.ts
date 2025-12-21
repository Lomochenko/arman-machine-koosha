import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const isMenuOpen = ref(false)
  const isLoading = ref(false)

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  return {
    isMenuOpen,
    isLoading,
    toggleMenu,
    setLoading
  }
})

