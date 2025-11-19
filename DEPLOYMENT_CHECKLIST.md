# 🚀 Deployment Checklist

## Pre-Deployment Verification

### ✅ Code Quality
- [x] All 10 production issues fixed
- [x] No console errors in production build
- [x] All images loading correctly (no 404s)
- [x] GSAP animations working properly
- [x] No memory leaks (proper cleanup on unmount)

### ✅ Functionality
- [x] Hamburger menu works on mobile
- [x] Back-to-top button works
- [x] Language switcher (EN ↔ FA) works
- [x] Footer counters animate (22 & 84)
- [x] Page transitions smooth
- [x] Loader shows and hides correctly
- [x] Persian text displays correctly in RTL

### ✅ Performance
- [x] Images optimized (WebP format)
- [x] CSS minified
- [x] JavaScript bundled
- [x] Lazy loading enabled
- [x] Proper caching headers

### ✅ SEO
- [x] Meta tags configured
- [x] Sitemap generated
- [x] Robots.txt present
- [x] Favicon configured
- [x] Theme color set

### ✅ Mobile
- [x] Responsive design working
- [x] Touch interactions working
- [x] No tap highlight
- [x] Address bar color matches brand
- [x] Tested on iOS Safari
- [x] Tested on Android Chrome

### ✅ Browser Compatibility
- [x] Chrome (latest)
- [x] Firefox (latest)
- [x] Safari (latest)
- [x] Edge (latest)

## Deployment Commands

### Build for Production
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```

### Generate Static Site (SSG)
```bash
npm run generate
```

## Vercel Deployment

### Environment Variables
No environment variables required for this project.

### Build Settings
- **Framework Preset**: Nuxt.js
- **Build Command**: `npm run build`
- **Output Directory**: `.output/public`
- **Install Command**: `npm install --legacy-peer-deps`
- **Node Version**: 18.x or higher

### Deployment Steps
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings (above)
4. Deploy
5. Verify all functionality on live URL

## Post-Deployment Testing

### Critical Tests
1. **First Visit Test**
   - Clear browser cache
   - Visit site
   - Verify loader appears and disappears
   - Check for 404 errors in console
   - Verify images load

2. **Navigation Test**
   - Navigate to all pages: Home → Works → About → Services → Contact
   - Verify page transitions work
   - Check that images load on each page
   - Verify no background color leaks

3. **Mobile Test**
   - Open on mobile device
   - Test hamburger menu
   - Test back-to-top button
   - Verify no tap highlight
   - Check address bar color

4. **Language Test**
   - Click FA button
   - Verify text changes to Persian
   - Verify RTL layout
   - Verify loader text in Persian
   - Switch back to EN

5. **Animation Test**
   - Scroll through pages
   - Verify GSAP animations trigger
   - Check footer counters animate
   - Verify no double animations
   - Check scroll is not locked

## Monitoring

### Key Metrics to Watch
- **Page Load Time**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **Largest Contentful Paint**: < 2.5 seconds

### Error Monitoring
- Check Vercel logs for errors
- Monitor browser console for warnings
- Watch for 404 errors
- Check for GSAP warnings

## Rollback Plan

If issues occur:
1. Revert to previous Vercel deployment
2. Check error logs
3. Fix issues locally
4. Test thoroughly
5. Redeploy

## Support Contacts

- **Developer**: [Your Name]
- **Client**: Arman Machine Koosha
- **Hosting**: Vercel
- **Repository**: GitHub

## Notes

- All fixes documented in `FIXES_APPLIED.md`
- GSAP premium plugins loaded from `/js/gsap.js`
- Images served from `/public/img/`
- i18n configured for EN and FA
- SSR disabled (SPA mode) for better compatibility with legacy scripts

---

**Deployment Status**: ✅ Ready for Production
**Last Verified**: 2025-01-19
**Version**: 1.0.0
