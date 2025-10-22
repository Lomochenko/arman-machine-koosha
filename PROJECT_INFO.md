# Arman Machine Koosha - Nuxt.js Project

## Project Overview
This is a Nuxt.js 3 conversion of the Arman Machine Koosha creative portfolio template. The project maintains all original functionality from the static HTML version while leveraging Nuxt.js for better performance and maintainability.

## Technology Stack
- **Framework**: Nuxt.js 3.9.0
- **Vue**: 3.4.0
- **JavaScript Libraries**:
  - jQuery (loaded from /js/)
  - GSAP with plugins (ScrollTrigger, ScrollSmoother, DrawSVG, MorphSVG, etc.)
  - Barba.js (page transitions)
  - Lenis (smooth scrolling)
  - Other plugins in plugins.js

## Project Structure
```
├── app.vue                 # Main app layout with Barba.js integration
├── components/
│   ├── Header.vue         # Site header
│   └── Footer.vue         # Site footer
├── pages/
│   ├── index.vue          # Home page
│   ├── about.vue          # About page
│   ├── services.vue       # Services page
│   ├── works.vue          # Works/portfolio page
│   └── contact.vue        # Contact page
├── plugins/
│   └── scripts.client.ts  # Loads JavaScript libraries in correct order
├── public/
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript libraries
│   └── img/               # Images
└── static version/        # Original static HTML files for reference
```

## Key Features
- **Barba.js Integration**: Smooth page transitions with GSAP animations
- **GSAP Animations**: ScrollTrigger, parallax effects, and custom animations
- **Smooth Scrolling**: Lenis smooth scroll integration
- **Responsive Design**: Mobile-friendly layout
- **Dark/Light Mode**: Theme switching capability

## Important Implementation Details

### Barba.js Setup
The app uses Barba.js for page transitions. Key attributes:
- `data-barba="wrapper"` on the main app div
- `data-barba="container"` on the main content area
- Barba.js is loaded in `plugins/scripts.client.ts` before `scripts.js`

### JavaScript Loading Order
Scripts are loaded in this specific order (critical for proper functionality):
1. jQuery
2. plugins.js (Lenis, imagesLoaded, etc.)
3. GSAP
4. Barba.js
5. scripts.js (main initialization)

### GSAP Animation Lifecycle
- Initial page load: Animations triggered by jQuery `$(window).trigger('load')`
- Page transitions: Barba.js hooks handle animation killing and re-initialization
- ScrollTrigger: Automatically refreshed on page transitions

## Development

### Start Development Server
```bash
npm run dev
```
Server runs on: http://localhost:3016

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Known Issues & Solutions

### Issue: GSAP Animations Not Playing on Navigation
**Cause**: Barba.js not properly integrated with Vue Router
**Solution**: Ensure Barba.js is loaded and `data-barba` attributes are present in app.vue

### Issue: JavaScript Files Not Loading
**Cause**: Incorrect script loading order or missing files
**Solution**: Check `plugins/scripts.client.ts` and verify all files exist in `/public/js/`

### Issue: Scroll Position Not Resetting
**Cause**: Barba.js hooks not properly configured
**Solution**: Verify Barba.js initialization in `public/js/scripts.js`

## Migration to NPM Packages (Planned)
Currently, JavaScript libraries are loaded from local files in `/public/js/`. Future enhancement will migrate these to NPM packages for better dependency management.

## Testing Checklist
- [ ] Home page loads correctly
- [ ] Navigation between pages works smoothly
- [ ] GSAP animations play on page load
- [ ] GSAP animations play after navigation
- [ ] Scroll position resets on navigation
- [ ] Smooth scrolling works
- [ ] Mobile responsive
- [ ] No console errors

## Server Configuration
- **SSR**: Disabled (`ssr: false` in nuxt.config.ts)
- **Port**: 3016
- **Host**: 0.0.0.0 (accessible from network)

## CSS Files
All CSS is imported in `nuxt.config.ts`:
- plugins.css (third-party plugin styles)
- style.css (main theme styles)

## Contact
For questions or issues, refer to the original static HTML files in the `static version/` folder.

