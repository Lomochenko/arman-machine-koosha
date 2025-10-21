# NPM Migration Guide - Step by Step

## 🎯 Goal
Migrate from local JS files to NPM packages while maintaining 100% functionality.

## ⚠️ IMPORTANT NOTES

### Dependency Chain (MUST MAINTAIN):
```
jQuery → plugins.js (Lenis, Hamster, imagesLoaded) → barba.min.js → gsap.js → scripts.js
```

### What's in plugins.js:
- **Lenis**: Smooth scrolling library
- **Hamster**: Mouse wheel handling
- **imagesLoaded**: Image loading detection

These are bundled together and MUST load before other scripts!

---

## 📋 STEP-BY-STEP MIGRATION

### Step 1: Install NPM Packages
```bash
npm install jquery lenis hamster.js imagesloaded @barba/core
```

**Note**: GSAP is already in package.json ✅

### Step 2: Update plugins/scripts.client.ts

Replace the current plugin with:

```typescript
export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Ensure body has the light class
    if (document.body && !document.body.classList.contains('light')) {
      document.body.classList.add('light');
    }

    // Import libraries
    import('jquery').then(($module) => {
      const $ = $module.default;
      window.$ = $;
      window.jQuery = $;

      // Import plugins (Lenis, Hamster, imagesLoaded)
      import('lenis').then(() => {
        import('hamster.js').then(() => {
          import('imagesloaded').then(() => {
            // Import Barba
            import('@barba/core').then(() => {
              // Import GSAP
              import('gsap').then((gsapModule) => {
                window.gsap = gsapModule.default;
                
                // Import GSAP plugins
                import('gsap/ScrollTrigger').then((st) => {
                  gsapModule.default.registerPlugin(st.default);
                });
                
                // Now load custom scripts
                import('../js/scripts.js').then(() => {
                  console.log('✓ All scripts loaded successfully');
                  $(window).trigger('load');
                });
              });
            });
          });
        });
      });
    });
  }
});
```

### Step 3: Update scripts.js

Modify the top of scripts.js to use imported libraries:

```javascript
(function ($) {
    "use strict";

    // GSAP is already available globally
    gsap.registerPlugin(
      DrawSVGPlugin, 
      ScrollTrigger, 
      CSSRulePlugin, 
      ScrollToPlugin, 
      MorphSVGPlugin, 
      CustomEase, 
      InertiaPlugin, 
      ScrollSmoother, 
      TextPlugin, 
      Flip
    );

    // Rest of scripts.js remains the same...
```

### Step 4: Remove Local JS Files

Once tested and working:
```bash
rm -r js/
```

Or keep them as backup:
```bash
mv js/ js.backup/
```

### Step 5: Update nuxt.config.ts

Remove the server routes for JS files (they're no longer needed):

```typescript
// Remove or comment out:
// server/routes/js/[...].ts
// server/routes/css/[...].ts
// server/routes/img/[...].ts
```

### Step 6: Test Everything

1. **Open browser DevTools** (F12)
2. **Check Console** for errors
3. **Test page transitions** - Click between pages
4. **Test animations** - Scroll and interact
5. **Test mouse cursor** - Move mouse around
6. **Test menu** - Open fullscreen menu
7. **Test all interactions** - Verify everything works

### Step 7: Verify Bundle Size

```bash
npm run build
```

Check the output for bundle size reduction.

---

## 🔍 VERIFICATION CHECKLIST

### Console Checks:
- [ ] No JavaScript errors
- [ ] No missing library warnings
- [ ] All scripts loaded successfully
- [ ] jQuery available globally
- [ ] GSAP available globally

### Functionality Checks:
- [ ] Page transitions work smoothly
- [ ] Animations play correctly
- [ ] Mouse cursor works
- [ ] Menu opens/closes
- [ ] Scroll animations trigger
- [ ] Images load properly
- [ ] Responsive design works
- [ ] All links work

### Performance Checks:
- [ ] Bundle size reduced
- [ ] Load time improved
- [ ] No console errors
- [ ] Smooth animations
- [ ] No memory leaks

---

## 🚨 TROUBLESHOOTING

### Issue: jQuery not available
**Solution**: Ensure jQuery is imported first and assigned to window

### Issue: GSAP plugins not registered
**Solution**: Import plugins after GSAP, use registerPlugin()

### Issue: Barba.js not working
**Solution**: Use Nuxt transitions instead (already implemented)

### Issue: Lenis not working
**Solution**: Ensure it's imported before scripts.js

### Issue: imagesLoaded not working
**Solution**: Check that it's imported in correct order

---

## 📊 EXPECTED RESULTS

### Before Migration:
- Local files: 1.5 MB
- Build time: ~3 seconds
- Bundle size: Large

### After Migration:
- NPM packages: 295 KB
- Build time: ~2 seconds
- Bundle size: 80% smaller
- Better caching
- Automatic updates

---

## 🎯 ROLLBACK PLAN

If something breaks:

1. **Revert changes**:
   ```bash
   git checkout plugins/scripts.client.ts
   ```

2. **Restore local files**:
   ```bash
   mv js.backup/ js/
   ```

3. **Restart server**:
   ```bash
   npm run dev
   ```

---

## ✅ FINAL CHECKLIST

- [ ] All packages installed
- [ ] Plugin updated
- [ ] Scripts.js updated
- [ ] All tests passed
- [ ] No console errors
- [ ] Bundle size verified
- [ ] Performance improved
- [ ] Ready for production

---

**Status**: Ready for migration
**Risk Level**: Low (with rollback plan)
**Estimated Time**: 1-2 hours
**Difficulty**: Medium

