# 🔧 Critical Bug Fixes - Implementation Guide

## Priority Order (Based on Severity & Impact)

### **PRIORITY 1 - CRITICAL (Blocking Functionality)**

#### Issue 2: Content appears before animations ready ✅
**Severity**: CRITICAL - Affects all pages, poor UX
**Root Cause**: ScrollTrigger instances disabled during page load, animations not initialized before content shows
**Fix**: Ensure animations initialize BEFORE removing loading class

#### Issue 4: Mobile menu doesn't close on navigation ✅  
**Severity**: CRITICAL - Blocks mobile navigation
**Root Cause**: No cleanup in router hooks
**Fix**: Add menu close logic in `beforeEach` router hook

---

### **PRIORITY 2 - HIGH (Major UX Issues)**

#### Issue 7: GSAP animations erratic ✅
**Severity**: HIGH - Affects all pages, multiple scenarios
**Root Cause**: ScrollTrigger instances not properly cleaned up, double initialization
**Fix**: Proper cleanup in barba hooks, prevent double initialization

#### Issue 5: Blue background bleeds ✅
**Severity**: HIGH - Visual bug affecting navigation
**Root Cause**: GSAP background color not reset on route leave
**Fix**: Add cleanup in about.vue onUnmounted

---

### **PRIORITY 3 - MEDIUM (Specific Page Issues)**

#### Issue 8: Contact page image overlaps header ✅
**Severity**: MEDIUM - Blocks header on one page
**Root Cause**: Image z-index higher than header, no top margin
**Fix**: Adjust z-index and add proper spacing

#### Issue 6: Hero CTAs below viewport on mobile ✅
**Severity**: MEDIUM - Affects homepage mobile UX
**Root Cause**: Fixed positioning not accounting for mobile viewport
**Fix**: Use CSS to position CTAs at bottom of viewport

---

### **PRIORITY 4 - LOW (Enhancements)**

#### Issue 1: Mobile loader percentage not visible ✅
**Severity**: LOW - Minor visual issue
**Root Cause**: Font size too small or positioning off-screen on mobile
**Fix**: Adjust CSS for mobile viewport

#### Issue 3: Footer counters not animating ✅
**Severity**: LOW - Enhancement (already partially implemented)
**Root Cause**: useCountUp composable exists but may need fixes
**Fix**: Verify and fix counter animation logic

---

## Detailed Fixes

### Fix 1: Content Appears Before Animations Ready (PRIORITY 1)

**Problem**: Loader disappears, content visible, then GSAP animations start seconds later.

**Root Cause**: 
- `scripts.js` line ~10642 sets `winLoaded = true` but ScrollTrigger instances are disabled during page load
- Animations initialize after content is already visible

**Solution**:

```typescript
// In plugins/barba-router-integration.client.ts - afterRouteComplete()

function afterRouteComplete() {
  // DON'T remove loading class yet
  // document.documentElement.classList.remove('loading'); // REMOVE THIS LINE
  
  // Enable scroll AFTER animations are ready
  if (typeof window.enableScroll === 'function') {
    window.enableScroll();
  }

  nextTick(() => {
    // Initialize ALL animations FIRST
    if (typeof window.naylaTextAnims === 'function') {
      window.naylaTextAnims();
    }
    
    // ... all other animation initializations ...
    
    // CRITICAL: Wait for ScrollTrigger to be ready
    if (window.ScrollTrigger) {
      window.ScrollTrigger.refresh(true);
      
      // Enable all ScrollTrigger instances
      const instances = window.ScrollTrigger.getAll();
      instances.forEach((st: any) => st.enable());
    }
    
    // ONLY NOW remove loading class and show content
    setTimeout(() => {
      document.documentElement.classList.remove('loading');
      
      const pageElement = document.getElementById('page');
      if (pageElement && window.gsap) {
        window.gsap.to(pageElement, {
          opacity: 1,
          visibility: 'visible',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      
      isTransitioning = false;
    }, 300); // Wait for animations to initialize
  });
}
```

---

### Fix 2: Mobile Menu Doesn't Close on Navigation (PRIORITY 1)

**Problem**: Menu stays open after clicking navigation link on mobile.

**Root Cause**: No cleanup logic in router hooks.

**Solution**:

```typescript
// In plugins/barba-router-integration.client.ts - router.beforeEach()

router.beforeEach((to: any, from: any, next: any) => {
  // ... existing code ...
  
  // CRITICAL: Close mobile menu before navigation
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-navigation');
  const body = document.body;
  
  if (menuToggle && menu) {
    menuToggle.classList.remove('active');
    menu.classList.remove('active');
    body.classList.remove('menu-open');
    
    // Reset menu toggle data
    if (window.$) {
      window.$(menuToggle).data('clicks', false);
    }
  }
  
  // ... rest of existing code ...
});
```

---

### Fix 3: GSAP Animations Erratic (PRIORITY 2)

**Problem**: Elements duplicate, flash, don't animate properly on navigation/refresh/language switch.

**Root Cause**: 
- ScrollTrigger instances not killed properly
- SplitText not reverted
- Double initialization

**Solution**:

```typescript
// In plugins/barba-router-integration.client.ts - router.beforeEach()

router.beforeEach((to: any, from: any, next: any) => {
  // ... existing code ...
  
  // CRITICAL: Kill ALL ScrollTrigger instances
  if (window.ScrollTrigger) {
    const all = window.ScrollTrigger.getAll();
    all.forEach((st: any) => {
      st.kill(true); // true = remove from DOM
    });
  }
  
  // CRITICAL: Revert ALL SplitText instances
  if (window.$ && window.SplitText) {
    // Find all elements that might have SplitText
    const splitElements = window.$('.has-anim-text, .menu-link, .project-title');
    splitElements.each(function() {
      const splits = window.$(this).data('splitText');
      if (splits && splits.revert) {
        splits.revert();
      }
    });
  }
  
  // CRITICAL: Kill all GSAP tweens and timelines
  if (window.gsap) {
    window.gsap.globalTimeline.clear();
    window.gsap.killTweensOf('*');
  }
  
  // ... rest of existing code ...
});
```

---

### Fix 4: Blue Background Bleeds (PRIORITY 2)

**Problem**: Blue background from /about team section persists on other pages.

**Root Cause**: GSAP background color animation not reset on route leave.

**Solution**: Already implemented in about.vue, but ensure it's working:

```typescript
// In pages/about.vue - onUnmounted()

onUnmounted(() => {
  if (!process.client) return
  
  // Revert GSAP context
  if (gsapContext) {
    gsapContext.revert()
  }
  
  // CRITICAL: Reset background colors
  const { $gsap } = useNuxtApp()
  if ($gsap) {
    // Reset body background
    $gsap.set(document.body, { 
      backgroundColor: '#ffffff',
      clearProps: 'backgroundColor' 
    })
    
    // Reset html background
    $gsap.set(document.documentElement, { 
      backgroundColor: '#ffffff',
      clearProps: 'backgroundColor' 
    })
    
    // Reset any sections with blue background
    const blueSections = document.querySelectorAll('.anim-bg, .section[style*="background"]')
    blueSections.forEach(section => {
      $gsap.set(section, { clearProps: 'backgroundColor' })
    })
  }
})
```

---

### Fix 5: Contact Page Image Overlaps Header (PRIORITY 3)

**Problem**: Image covers hamburger menu and logo on /contact page.

**Root Cause**: Image has no top margin, z-index issue.

**Solution**:

```vue
<!-- In pages/contact.vue -->

<template>
  <div class="page-content">
    <div class="section fullscreen">
      <!-- Add proper spacing for header -->
      <span class="empty-space" style="height: 120px"></span>
      
      <div class="wrapper-full" style="min-height: 90vh">
        <div class="c-col-12">
          <!-- Fix z-index and positioning -->
          <div class="single-image contact-hero-image" style="--height: 50vh">
            <img alt="Contact" src="/img/photog_contact.jpg">
          </div>
        </div>
        <!-- ... rest of content ... -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-hero-image {
  position: relative;
  z-index: 1; /* Below header which is z-index: 999 */
  margin-top: 2rem;
}

/* Ensure header stays on top */
:deep(.site-header) {
  z-index: 999;
  position: relative;
}
</style>
```

---

### Fix 6: Hero CTAs Below Viewport on Mobile (PRIORITY 3)

**Problem**: "Start a Project" and "Works" buttons not visible on mobile without scrolling.

**Root Cause**: Fixed positioning doesn't account for mobile viewport height.

**Solution**:

```vue
<!-- In components/home/HeroSection.vue -->

<style scoped>
.hero-ctas {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
  z-index: 10;
}

@media (max-width: 768px) {
  .hero-ctas {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 400px;
  }
}

/* Ensure hero section has proper height */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
```

---

### Fix 7: Mobile Loader Percentage Not Visible (PRIORITY 4)

**Problem**: Percentage counter not visible on mobile.

**Root Cause**: Font size too small or element positioned off-screen.

**Solution**:

```css
/* Add to assets/css/custom.css */

@media (max-width: 450px) {
  .page-loader-percentage {
    font-size: 60px !important; /* Increase from default */
    bottom: 60px !important; /* Adjust position */
  }
  
  .page-loader-count {
    font-size: 60px !important;
  }
  
  .count_0, .count_20, .count_40, .count_60, .count_80, .count_100 {
    font-size: 60px !important;
  }
}
```

---

### Fix 8: Footer Counters Not Animating (PRIORITY 4)

**Problem**: Numbers appear instantly without count-up animation.

**Root Cause**: useCountUp composable may have issues with GSAP access.

**Solution**: Already implemented, but verify:

```typescript
// In composables/useCountUp.ts - ensure GSAP is accessed correctly

export const useCountUp = (targetRef: Ref<HTMLElement | null>, endValue: number) => {
  let observer: IntersectionObserver | null = null
  let hasAnimated = false

  onMounted(() => {
    if (!process.client || !targetRef.value) return

    // CRITICAL: Access GSAP from window, not useNuxtApp
    const gsap = (window as any).gsap
    if (!gsap) {
      console.error('GSAP not available for counter animation')
      return
    }

    const counter = { value: 0 }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true
            gsap.to(counter, {
              value: endValue,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                if (targetRef.value) {
                  targetRef.value.textContent = Math.round(counter.value).toString()
                }
              },
            })
          }
        })
      },
      { threshold: 0.3 } // Trigger earlier
    )

    if (targetRef.value) {
      observer.observe(targetRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}
```

---

## Testing Checklist

After implementing fixes:

- [ ] **Issue 2**: Navigate to /services - content should only appear AFTER animations are ready
- [ ] **Issue 4**: Open mobile menu, click link - menu should close immediately
- [ ] **Issue 7**: Navigate between pages multiple times - no duplicate elements or flashing
- [ ] **Issue 7**: Switch language EN↔FA - animations work correctly
- [ ] **Issue 7**: Refresh page - animations work correctly
- [ ] **Issue 5**: Navigate from /about (while blue section visible) to another page - white background
- [ ] **Issue 8**: Visit /contact on mobile - header visible and clickable
- [ ] **Issue 6**: Visit homepage on mobile - CTAs visible without scrolling
- [ ] **Issue 1**: Visit homepage on mobile - loader percentage visible
- [ ] **Issue 3**: Scroll to footer - numbers animate from 0 to 22 and 84

---

## Implementation Order

1. **Fix Issue 4** (Mobile menu) - Quick win, critical for mobile users
2. **Fix Issue 2** (Content timing) - Most impactful for UX
3. **Fix Issue 7** (GSAP cleanup) - Prevents cascading issues
4. **Fix Issue 5** (Blue background) - Already mostly done
5. **Fix Issue 8** (Contact image) - Simple CSS fix
6. **Fix Issue 6** (Hero CTAs) - CSS positioning
7. **Fix Issue 1** (Loader percentage) - CSS adjustment
8. **Fix Issue 3** (Footer counters) - Verify existing implementation

---

**Status**: Ready for implementation
**Estimated Time**: 2-3 hours for all fixes
**Risk Level**: Low (all fixes are isolated and well-tested patterns)
