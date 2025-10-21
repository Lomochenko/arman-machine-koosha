export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    // Ensure body has the light class
    if (document.body && !document.body.classList.contains('light')) {
      document.body.classList.add('light');
    }

    // Load scripts in order
    const scripts = [
      '/js/jquery.min.js',
      '/js/plugins.js',
      '/js/barba.min.js',
      '/js/gsap.js',
      '/js/scripts.js',
    ];

    let loadedCount = 0;

    scripts.forEach((src, index) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.defer = false;

      script.onload = () => {
        loadedCount++;
        console.log(`✓ Loaded: ${src}`);

        // When all scripts are loaded, trigger initialization
        if (loadedCount === scripts.length) {
          console.log('✓ All scripts loaded successfully');
          setTimeout(() => {
            if (typeof window !== 'undefined' && (window as any).jQuery) {
              const $ = (window as any).jQuery;
              console.log('✓ jQuery ready, triggering load event');
              $(window).trigger('load');
            }
          }, 100);
        }
      };

      script.onerror = () => {
        console.error(`✗ Failed to load script: ${src}`);
      };

      document.head.appendChild(script);
    });
  }
});

