/**
 * Locale Route Middleware
 * Detects Persian slugs and sets locale accordingly
 */

export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    const path = to.path
    
    // Persian routes
    const persianRoutes = ['/درباره-ما', '/بازرگانی', '/تعمیرات', '/محصولات', '/تماس-با-ما']
    const englishRoutes = ['/about', '/commercial', '/repair', '/products', '/contact']
    
    // Set locale based on route
    if (persianRoutes.includes(path)) {
      localStorage.setItem('locale', 'fa')
    } else if (englishRoutes.includes(path)) {
      localStorage.setItem('locale', 'en')
    }
  }
})
