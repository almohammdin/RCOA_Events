(() => {
  'use strict';
  const quickStyle = document.createElement('style');
  quickStyle.textContent = '.eyebrow::before{display:none!important}';
  document.head.appendChild(quickStyle);

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'assets/overrides.css';
  document.head.appendChild(style);

  const sectionText = document.querySelector('.section-heading p');
  if (sectionText) sectionText.textContent = 'اختر المناسبة وسجل مقعدك مباشرة.';

  const script = document.createElement('script');
  script.src = 'assets/app-v2.js';
  script.defer = true;
  document.body.appendChild(script);
})();
