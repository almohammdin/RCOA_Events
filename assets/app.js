(() => {
  'use strict';
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'assets/overrides.css';
  document.head.appendChild(style);

  const script = document.createElement('script');
  script.src = 'assets/app-v2.js';
  script.defer = true;
  document.body.appendChild(script);
})();
