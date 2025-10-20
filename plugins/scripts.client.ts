export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
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
        // When all scripts are loaded, trigger initialization
        if (loadedCount === scripts.length) {
          setTimeout(() => {
            if (typeof window !== 'undefined' && (window as any).jQuery) {
              const $ = (window as any).jQuery;
              $(window).trigger('load');
            }
          }, 100);
        }
      };

      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
      };

      document.head.appendChild(script);
    });
  }
});

