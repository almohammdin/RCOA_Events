(() => {
  'use strict';

  const STORAGE_KEY = 'rcoa_events_state_v2';
  const MIGRATION_KEY = 'rcoa_events_demo_seed_v3';
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeOh-2IDRUmDtlxD0l7jFsbHYQpnuhbfrYQhMT13jwCc3_vHw/viewform?usp=preview';

  // Load the layout layer used by the published page.
  const layout = document.createElement('link');
  layout.rel = 'stylesheet';
  layout.href = 'assets/overrides.css?v=3';
  document.head.appendChild(layout);

  // One-time reset of the old prototype seed so the six new demo events appear.
  if (!localStorage.getItem(MIGRATION_KEY)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(MIGRATION_KEY, '1');
  }

  const style = document.createElement('style');
  style.textContent = `
    .eyebrow::before{display:none!important}
    .naif-footer-identity{border-right:1px solid rgba(255,255,255,.13);padding-right:22px;display:grid;gap:9px;align-items:center}
    .naif-footer-main{display:flex;align-items:center;gap:10px;min-width:0}
    .naif-footer-main img{width:116px!important;height:48px!important;object-fit:contain!important;object-position:center!important;border:0!important;border-radius:0!important;background:transparent!important;padding:0!important;box-shadow:none!important}
    .naif-footer-main strong{font-size:12px;color:#fff;font-weight:700}
    .naif-footer-social{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
    .naif-footer-social>strong{font-size:10px;color:#dcc681;margin-left:3px;direction:ltr}
    .naif-footer-social a{width:28px;height:28px;border:1px solid rgba(255,255,255,.14);border-radius:9px;display:grid;place-items:center;color:#dbe5e4;background:rgba(255,255,255,.035);transition:.16s ease}
    .naif-footer-social a:hover{background:#fff;color:#132f32;transform:translateY(-1px)}
    .naif-footer-social svg{width:14px;height:14px;fill:currentColor}
    .suggestion-card-icon{width:42px!important;height:42px!important;min-width:42px!important;border-radius:13px!important;display:grid!important;place-items:center!important;background:#eef5f4!important;color:#1f4649!important;font-size:0!important}
    .suggestion-card-icon svg{width:22px!important;height:22px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
    .riyal-money{display:inline-flex;align-items:center;gap:.26em;direction:ltr;white-space:nowrap}
    .riyal-symbol{display:inline-block;width:.72em;height:.82em;flex:0 0 .72em;background:currentColor;-webkit-mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat;mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat}
    .riyal-value{font-variant-numeric:tabular-nums}
    @media(max-width:760px){.naif-footer-identity{border-right:0;padding-right:0;border-top:1px solid rgba(255,255,255,.1);padding-top:13px}.naif-footer-main img{width:100px!important;height:42px!important}}
  `;
  document.head.appendChild(style);

  // Naif identity: same treatment as tawassu_branch, no photo and no circle.
  const naif = document.querySelector('.naif-signature');
  if (naif) {
    naif.className = 'naif-signature naif-footer-identity';
    naif.innerHTML = `
      <div class="naif-footer-main">
        <img src="https://raw.githubusercontent.com/almohammdin/tawassu_branch/main/naif-logo-v2.png" alt="شعار نايف المحمدي">
        <strong>إعداد نايف المحمدي</strong>
      </div>
      <div class="naif-footer-social" aria-label="حسابات نايف المحمدي">
        <strong>Almohammdin</strong>
        <a href="https://x.com/almohammdin" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.2 2H22l-8.3 9.5L23.5 22h-7.7l-6-7.9L2.9 22H-.9l8.9-10.2L-1.4 2h7.9l5.4 7.2L18.2 2Zm-1.3 18h2.1L5.4 3.9H3.2L16.9 20Z"/></svg></a>
        <a href="https://www.linkedin.com/in/almohammdin/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M5.3 7.9H1.7V22h3.6V7.9ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22 13.9c0-4.2-2.2-6.2-5.2-6.2-2.4 0-3.5 1.3-4.1 2.2v-2H9.1V22h3.6v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H22v-8.1Z"/></svg></a>
        <a href="https://www.snapchat.com/add/almohammdin" target="_blank" rel="noopener" aria-label="Snapchat"><svg viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg></a>
        <a href="https://linktr.ee/almohammdin" target="_blank" rel="noopener" aria-label="Linktree"><svg viewBox="0 0 24 24"><path d="M13.736 5.852 17.644 2l1.92 1.92-3.852 3.736h5.644v2.736h-5.66l3.868 3.752-1.92 1.92-5.276-5.28-5.276 5.28-1.92-1.92 3.868-3.752H3.38V7.656h5.644L5.172 3.92 7.092 2l3.932 3.852V0h2.712v5.852ZM11.024 24v-8.604h2.712V24h-2.712Z"/></svg></a>
      </div>`;
  }

  // Compact "اقترح مناسبة" card with a calendar-plus icon; no oversized modal icon.
  const suggestion = document.querySelector('.suggestion-card');
  if (suggestion) {
    const icon = suggestion.querySelector('.suggestion-card-icon');
    if (icon) icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2"></rect><path d="M7 3v5M17 3v5M3.5 10h17M12 13v5M9.5 15.5h5"></path></svg>';
    const button = suggestion.querySelector('[data-action="suggestion"]');
    if (button) {
      const link = document.createElement('a');
      link.className = button.className;
      link.href = FORM_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'اقترح مناسبة';
      button.replaceWith(link);
    }
  }
  document.getElementById('suggestionModal')?.remove();

  const headingText = document.querySelector('.section-heading p');
  if (headingText) headingText.textContent = 'اختر المناسبة وسجل مقعدك مباشرة.';
  const version = document.querySelector('.footer-bottom span:last-child');
  if (version) version.textContent = 'الإصدار 0.3.0';

  function applyRiyal(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !/SAR\s+[0-9]/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,.riyal-money')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const pieces = node.nodeValue.split(/(SAR\s+[0-9][0-9,]*)/g);
      if (pieces.length < 2) return;
      const fragment = document.createDocumentFragment();
      pieces.forEach(piece => {
        const match = piece.match(/^SAR\s+([0-9][0-9,]*)$/);
        if (!match) return fragment.appendChild(document.createTextNode(piece));
        const money = document.createElement('span');
        money.className = 'riyal-money';
        money.setAttribute('aria-label', `${match[1]} ريال سعودي`);
        money.innerHTML = `<span class="riyal-symbol" aria-hidden="true"></span><span class="riyal-value">${match[1]}</span>`;
        fragment.appendChild(money);
      });
      node.replaceWith(fragment);
    });
  }

  applyRiyal();
  const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) applyRiyal(node.parentElement);
    if (node.nodeType === Node.ELEMENT_NODE) applyRiyal(node);
  })));
  observer.observe(document.body, {childList:true, subtree:true});

  const script = document.createElement('script');
  script.src = 'assets/app-v2.js?v=3';
  script.defer = true;
  script.onload = () => setTimeout(() => {
    applyRiyal();
    if (!document.querySelector('#eventsGrid .event-card') && !sessionStorage.getItem('rcoa_demo_reload_v3')) {
      sessionStorage.setItem('rcoa_demo_reload_v3', '1');
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  }, 150);
  document.body.appendChild(script);
})();
