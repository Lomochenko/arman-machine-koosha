# Testing Instructions - Critical Bug Fixes

## Quick Test (5 minutes)

### Mobile Loader Test (Issue 1)
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Hard refresh (Ctrl+Shift+R)
5. **VERIFY**: Loader percentage (0% → 100%) is visible and large
6. **VERIFY**: Column overlay animation plays (expanding columns)

### Mobile Menu Test (Issue 2)
1. Stay in mobile view
2. Navigate to any page (click a link)
3. **VERIFY**: Menu does NOT appear during transition
4. Click hamburger icon
5. **VERIFY**: Menu opens smoothly
6. Click a menu link
7. **VERIFY**: Menu closes before transition starts
8. **VERIFY**: Menu does NOT reappear on new page

### Footer Counter Test (Issue 3)
1. Navigate to home page
2. Scroll down to footer
3. **VERIFY**: "22+" counter animates from 0 to 22
4. **VERIFY**: "84+" counter animates from 0 to 84
5. Refresh page and scroll to footer again
6. **VERIFY**: Counters animate again (not stuck at 0 or 22/84)

### Transition Test (Issue 5)
1. Navigate between pages (Home → Services → About)
2. **VERIFY**: NO blue background flash during transitions
3. **VERIFY**: Dark columns animate smoothly
4. **VERIFY**: Transition caption visible and readable

### Animation Test (Issue 7)
1. Navigate to home page
2. Scroll down slowly
3. **VERIFY**: Text animations trigger smoothly
4. **VERIFY**: Image animations work
5. Navigate to another page and back
6. **VERIFY**: Animations still work (no duplicates)
7. Check console (F12)
8. **VERIFY**: No GSAP errors

---

## Full Test (20 minutes)

### Desktop Testing

#### Chrome
- [ ] Loader displays correctly
- [ ] Menu toggle works
- [ ] Footer counters animate
- [ ] No blue flash in transitions
- [ ] All GSAP animations smooth
- [ ] No console errors

#### Firefox
- [ ] Same as Chrome checklist

#### Safari (Mac only)
- [ ] Same as Chrome checklist

#### Edge
- [ ] Same as Chrome checklist

### Mobile Testing

#### iOS Safari (iPhone)
- [ ] Loader percentage visible (60px font)
- [ ] Loader columns animate
- [ ] Menu hidden on page load
- [ ] Menu hidden during transitions
- [ ] Menu opens/closes correctly
- [ ] Footer counters animate
- [ ] No blue flash
- [ ] Smooth scrolling works

#### Android Chrome
- [ ] Same as iOS checklist

#### Tablet (iPad/Android)
- [ ] Loader works at tablet size
- [ ] Menu behavior correct
- [ ] All animations smooth

### Page-by-Page Testing

#### Home Page (/)
- [ ] Hero section loads correctly
- [ ] "Arman Machine Koosha" text animates
- [ ] Scroll animations work
- [ ] Team section animates
- [ ] Footer counters work

#### Services Page (/services)
- [ ] Page loads without menu flash
- [ ] Service cards animate
- [ ] No blue background flash

#### About Page (/about)
- [ ] Team section loads
- [ ] No blue background leak
- [ ] Animations work

#### Contact Page (/contact)
- [ ] Form displays correctly
- [ ] No image overlap issues
- [ ] Contact info visible

#### Works Page (/works)
- [ ] Portfolio items load
- [ ] Hover effects work
- [ ] Transitions smooth

### Navigation Testing

#### Forward Navigation
1. Home → Services → About → Contact → Works
2. **VERIFY**: Each transition smooth
3. **VERIFY**: No menu flashes
4. **VERIFY**: No blue flashes
5. **VERIFY**: Animations work on each page

#### Backward Navigation
1. Click browser back button 4 times
2. **VERIFY**: Transitions work in reverse
3. **VERIFY**: No errors in console

#### Direct URL Access
1. Type `/services` in address bar
2. **VERIFY**: Loader shows correctly
3. **VERIFY**: Menu hidden on load
4. Type `/about` in address bar
5. **VERIFY**: Same as above

#### Refresh Testing
1. On home page, press F5
2. **VERIFY**: Loader shows
3. **VERIFY**: Menu hidden
4. On services page, press Ctrl+Shift+R (hard refresh)
5. **VERIFY**: Same as above

---

## Regression Testing

### Things That Should NOT Break

- [ ] Language switcher (EN ↔ FA)
- [ ] RTL layout for Persian
- [ ] Header sticky behavior
- [ ] Back to top button
- [ ] Smooth scrolling
- [ ] Image lazy loading
- [ ] Form submissions
- [ ] External links
- [ ] Social media links

---

## Performance Testing

### Lighthouse Audit
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit for mobile
4. **VERIFY**: Performance score > 80
5. Run audit for desktop
6. **VERIFY**: Performance score > 90

### Network Throttling
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Refresh page
4. **VERIFY**: Loader shows while loading
5. **VERIFY**: Page eventually loads
6. **VERIFY**: No infinite loader hang

---

## Error Testing

### Console Errors
1. Open DevTools console (F12)
2. Navigate through all pages
3. **VERIFY**: No red errors
4. **VERIFY**: No GSAP warnings
5. **VERIFY**: No ScrollTrigger errors

### Network Errors
1. Open DevTools → Network tab
2. Navigate through all pages
3. **VERIFY**: No 404 errors
4. **VERIFY**: All images load
5. **VERIFY**: All CSS/JS files load

---

## Edge Cases

### Rapid Navigation
1. Click links rapidly (5 clicks in 2 seconds)
2. **VERIFY**: Transitions queue properly
3. **VERIFY**: No broken states
4. **VERIFY**: Eventually settles on correct page

### Menu Spam
1. Click hamburger icon rapidly (10 times)
2. **VERIFY**: Menu opens/closes correctly
3. **VERIFY**: No stuck states

### Scroll During Transition
1. Start navigating to new page
2. Scroll immediately during transition
3. **VERIFY**: Scroll locked during transition
4. **VERIFY**: Scroll works after transition

### Resize During Load
1. Start loading page
2. Resize browser window during loader
3. **VERIFY**: Loader adapts to new size
4. **VERIFY**: Page loads correctly

---

## Acceptance Criteria

### Issue 1: Mobile Loader ✅
- [x] Loader percentage visible on mobile (60px font)
- [x] Loader columns animate on mobile
- [x] Works on all mobile devices (320px - 768px)

### Issue 2: Mobile Menu ✅
- [x] Menu NOT visible on page load
- [x] Menu NOT visible during transitions
- [x] Menu opens/closes correctly when toggled
- [x] No flash or flicker

### Issue 3: Footer Counters ✅
- [x] Counters animate from 0 to target value
- [x] Animation smooth (2.5s duration)
- [x] Works on scroll into view
- [x] Works after page navigation

### Issue 5: Blue Flash ✅
- [x] NO blue background during transitions
- [x] Dark columns animate smoothly
- [x] Transition caption visible

### Issue 7: GSAP Animations ✅
- [x] Animations work consistently
- [x] No duplicate animations
- [x] ScrollTrigger works on all pages
- [x] No console errors

---

## Sign-Off

After completing all tests:

- [ ] All quick tests passed
- [ ] All full tests passed
- [ ] All regression tests passed
- [ ] All edge cases handled
- [ ] All acceptance criteria met
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable

**Tested by**: _______________  
**Date**: _______________  
**Environment**: ☐ Staging ☐ Production  
**Approved for deployment**: ☐ Yes ☐ No  

**Notes**:
