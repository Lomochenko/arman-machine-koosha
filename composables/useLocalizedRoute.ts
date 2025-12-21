/**
 * Localized Routing Composable
 * Maps routes between English and Persian (Farsi) slugs
 */

import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// Route mapping: English slug -> Persian slug
const routeMap: Record<string, { en: string; fa: string }> = {
  home: { en: '/', fa: '/' },
  about: { en: '/#', fa: '/#' },
  commercial: { en: '/#', fa: '/#' },
  repair: { en: '/#', fa: '/#' },
  products: { en: '/#', fa: '/#' },
  contact: { en: '/#', fa: '/#' },
}

export const useLocalizedRoute = () => {
  const { locale } = useI18n()
  const router = useRouter()

  /**
   * Get localized path for a given route key
   */
  const getLocalizedPath = (routeKey: string): string => {
    const route = routeMap[routeKey]
    if (!route) return '/'
    return locale.value === 'fa' ? route.fa : route.en
  }

  /**
   * Get route key from current path
   */
  const getRouteKey = (path: string): string | null => {
    for (const [key, routes] of Object.entries(routeMap)) {
      if (routes.en === path || routes.fa === path) {
        return key
      }
    }
    return null
  }

  /**
   * Get English path from Persian path (for internal routing)
   */
  const getEnglishPath = (persianPath: string): string | null => {
    for (const routes of Object.values(routeMap)) {
      if (routes.fa === persianPath) {
        return routes.en
      }
    }
    return null
  }

  /**
   * Navigate to localized route
   */
  const navigateToLocalized = (routeKey: string) => {
    const path = getLocalizedPath(routeKey)
    router.push(path)
  }

  return {
    getLocalizedPath,
    getRouteKey,
    getEnglishPath,
    navigateToLocalized,
    routeMap,
  }
}
