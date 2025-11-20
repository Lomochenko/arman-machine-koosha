# 🧪 Testing Guide - Bug Fixes Verification

## Quick Reference

| Issue | Priority | Test Time | Status |
|-------|----------|-----------|--------|
| Issue 2: Content timing | P1 | 2 min | ✅ |
| Issue 4: Mobile menu | P1 | 1 min | ✅ |
| Issue 7: GSAP erratic | P2 | 5 min | ✅ |
| Issue 5: Blue background | P2 | 2 min | ✅ |
| Issue 8: Contact image | P3 | 1 min | ✅ |
| Issue 6: Hero CTAs | P3 | 1 min | ✅ |
| Issue 1: Loader percentage | P4 | 1 min | ✅ |
| Issue 3: Footer counters | P4 | 1 min | ✅ |

**Total Test Time**: ~15 minutes

---

## Test Environment Setup

### Desktop Testing
- **Browser**: Chrome (latest)
- **Screen Size**: 1920x1080
- **DevTools**: Open (F12) to check console

### Mobile Testing
- **Browser**: Chrome Mobile or iOS Safari
- **Screen Size**: 375x667 (iPhone SE) or 360x640 (Android)
- **DevTools**: Use Chrome DevTools Device Mode

---

## Priority 1 Tests (Critical)

### Test 1.1: Content Timing (Issue 2)
**Expected**: Content appears WITH animations, not before

**Steps**:
1. Open homepage
2. Click "Services" link
3. Watch the page transition

**Pass Criteria**:
- ✅ Loader/transition covers screen
- ✅ Content appears smoothly
- ✅ Animations start immediately when content shows
- ✅ No "flash" of un-animated content
- ✅ No console errors

**Fail Indicators**:
- ❌ Content visible before animations start
- ❌ Elements "jump" into place
- ❌ Scroll is locked after transition

---

### Test 1.2: Mobile Menu Close (Issue 4)
**Expected**: Menu closes immediately on navigation

**Steps**:
1. Open site on mobile (or DevTools mobile mode)
2. Click hamburger menu (top right)
3. Menu should open
4. Click "About" link
5. Watch menu behavior

**Pass Criteria**:
- ✅ Menu closes immediately when link clicked
- ✅ Page transition starts
- ✅ Menu stays closed on new page
- ✅ Hamburger icon resets to closed state

**Fail Indicators**:
- ❌ Menu stays open during transition
- ❌ Menu visible on new page
- ❌ Need to click hamburger twice to open again

---

## Priority 2 Tests (High)

### Test 2.1: GSAP Animations - Navigation (Issue 7)
**Expected**: Animations work correctly on every navigation

**Steps**:
1. Navigate: Home → Works → About → Services → Contact
2. Watch for duplicate elements or flashing
3. Check console for errors

**Pass Criteria**:
- ✅ Smooth transitions between all pages
- ✅ No duplicate text or images
- ✅ No elements flashing on/off
- ✅ Animations play once per page
- ✅ No console errors

**Fail Indicators**:
- ❌ Text appears twice
- ❌ Elements flash and disappear
- ❌ Animations don't play
- ❌ Console shows ScrollTrigger errors

---

### Test 2.2: GSAP Animations - Language Switch (Issue 7)
**Expected**: Animations work after language switch

**Steps**:
1. Click "FA" button (top right)
2. Wait for transition
3. Navigate to different pages
4. Click "EN" button
5. Navigate to different pages

**Pass Criteria**:
- ✅ Smooth language transition
- ✅ Animations work in Persian
- ✅ Animations work after switching back to English
- ✅ No duplicate elements
- ✅ RTL layout works correctly

**Fail Indicators**:
- ❌ Animations stop working after language switch
- ❌ Elements duplicate
- ❌ Layout breaks

---

### Test 2.3: GSAP Animations - Refresh (Issue 7)
**Expected**: Animations work after page refresh

**Steps**:
1. Navigate to /about
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Watch page load

**Pass Criteria**:
- ✅ Page loads smoothly
- ✅ Animations play correctly
- ✅ No duplicate elements
- ✅ No console errors

**Fail Indicators**:
- ❌ Animations don't play
- ❌ Elements appear twice
- ❌ Console errors

---

### Test 2.4: Blue Background Bleed (Issue 5)
**Expected**: Blue background doesn't persist on other pages

**Steps**:
1. Navigate to /about
2. Scroll down to "Our Team" section (blue background)
3. While blue section is visible, click "Contact" link
4. Check background color on contact page

**Pass Criteria**:
- ✅ Contact page has white background
- ✅ No blue color visible
- ✅ Smooth transition

**Fail Indicators**:
- ❌ Contact page has blue background
- ❌ Blue color flashes then disappears
- ❌ Background color is wrong

---

## Priority 3 Tests (Medium)

### Test 3.1: Contact Page Image (Issue 8)
**Expected**: Header visible and clickable on contact page

**Steps**:
1. Navigate to /contact
2. Check header visibility
3. Try clicking hamburger menu
4. Try clicking logo

**Pass Criteria**:
- ✅ Header fully visible
- ✅ Hamburger menu clickable
- ✅ Logo clickable
- ✅ Image doesn't overlap header
- ✅ Proper spacing above image

**Fail Indicators**:
- ❌ Image covers header
- ❌ Can't click hamburger or logo
- ❌ Header partially hidden

---

### Test 3.2: Hero CTAs on Mobile (Issue 6)
**Expected**: CTAs visible without scrolling on mobile

**Steps**:
1. Open homepage on mobile (or DevTools mobile mode)
2. Don't scroll
3. Look for "Start a Project" and "Works" buttons

**Pass Criteria**:
- ✅ Both buttons visible without scrolling
- ✅ Buttons at bottom of screen
- ✅ Buttons centered horizontally
- ✅ Buttons clickable

**Fail Indicators**:
- ❌ Need to scroll to see buttons
- ❌ Buttons cut off
- ❌ Buttons not centered

---

## Priority 4 Tests (Low)

### Test 4.1: Mobile Loader Percentage (Issue 1)
**Expected**: Loader percentage visible on mobile

**Steps**:
1. Open homepage on mobile (or DevTools mobile mode)
2. Hard refresh to see loader
3. Watch percentage counter

**Pass Criteria**:
- ✅ Percentage numbers visible
- ✅ Numbers large enough to read
- ✅ Numbers positioned correctly
- ✅ Counter animates 0% → 100%

**Fail Indicators**:
- ❌ Numbers too small
- ❌ Numbers off-screen
- ❌ Numbers not visible

---

### Test 4.2: Footer Counters (Issue 3)
**Expected**: Numbers animate from 0 to target value

**Steps**:
1. Navigate to any page
2. Scroll to footer
3. Watch the two numbers (Years and Projects)

**Pass Criteria**:
- ✅ "Years" counter animates 0 → 22
- ✅ "Projects" counter animates 0 → 84
- ✅ Animation smooth (not instant)
- ✅ Animation takes ~2 seconds
- ✅ Animation triggers when footer enters viewport

**Fail Indicators**:
- ❌ Numbers appear instantly
- ❌ Numbers don't animate
- ❌ Numbers show 0 permanently

---

## Regression Tests

### Test R1: Existing Features Still Work
**Expected**: All existing features unaffected

**Steps**:
1. Test smooth scroll
2. Test page transitions
3. Test image animations
4. Test text animations
5. Test hover effects

**Pass Criteria**:
- ✅ All existing features work
- ✅ No new bugs introduced
- ✅ Performance not degraded

---

### Test R2: All Pages Load
**Expected**: Every page loads without errors

**Steps**:
1. Visit each page: Home, Works, About, Services, Contact
2. Check console for errors
3. Check that content displays

**Pass Criteria**:
- ✅ All pages load
- ✅ No console errors
- ✅ All content visible

---

## Performance Tests

### Test P1: Page Load Speed
**Expected**: Pages load quickly

**Steps**:
1. Open DevTools Network tab
2. Hard refresh homepage
3. Check load time

**Pass Criteria**:
- ✅ Page loads in < 3 seconds
- ✅ No excessive requests
- ✅ No failed requests

---

### Test P2: Animation Performance
**Expected**: Animations run at 60fps

**Steps**:
1. Open DevTools Performance tab
2. Start recording
3. Navigate between pages
4. Stop recording
5. Check FPS

**Pass Criteria**:
- ✅ Consistent 60fps
- ✅ No frame drops
- ✅ No jank

---

## Browser Compatibility Tests

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

---

## Test Results Template

```markdown
## Test Results - [Date]

### Environment
- Browser: [Chrome/Firefox/Safari/etc]
- Device: [Desktop/Mobile/Tablet]
- Screen Size: [1920x1080/375x667/etc]

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| 1.1 Content Timing | ✅/❌ | |
| 1.2 Mobile Menu | ✅/❌ | |
| 2.1 GSAP Navigation | ✅/❌ | |
| 2.2 GSAP Language | ✅/❌ | |
| 2.3 GSAP Refresh | ✅/❌ | |
| 2.4 Blue Background | ✅/❌ | |
| 3.1 Contact Image | ✅/❌ | |
| 3.2 Hero CTAs | ✅/❌ | |
| 4.1 Loader Percentage | ✅/❌ | |
| 4.2 Footer Counters | ✅/❌ | |

### Issues Found
[List any issues discovered]

### Overall Status
✅ All tests passed / ❌ Some tests failed

### Tester
[Your name]
```

---

## Automated Testing (Future)

### E2E Tests (Playwright/Cypress)
```javascript
// Example test for mobile menu
test('mobile menu closes on navigation', async ({ page }) => {
  await page.goto('/');
  await page.click('.menu-toggle');
  await expect(page.locator('#site-navigation')).toHaveClass(/active/);
  await page.click('a[href="/about"]');
  await expect(page.locator('#site-navigation')).not.toHaveClass(/active/);
});
```

### Unit Tests (Vitest)
```javascript
// Example test for counter composable
test('useCountUp animates to target value', async () => {
  const ref = ref(document.createElement('span'));
  useCountUp(ref, 22);
  await waitFor(() => expect(ref.value.textContent).toBe('22'));
});
```

---

**Testing Status**: Ready for QA
**Estimated Test Time**: 15-20 minutes (full suite)
**Last Updated**: 2025-01-19
