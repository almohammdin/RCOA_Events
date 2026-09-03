(() => {
  'use strict';

  const DEMO_MIGRATION_KEY = 'rcoa_events_demo_seed_v3';
  const APP_STORAGE_KEY = 'rcoa_events_state_v2';
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeOh-2IDRUmDtlxD0l7jFsbHYQpnuhbfrYQhMT13jwCc3_vHw/viewform?usp=preview';

  // One-time prototype migration so the six new demo events are visible
  // even for browsers that saved the previous seed in localStorage.
  if (!localStorage.getItem(DEMO_MIGRATION_KEY)) {
    localStorage.removeItem(APP_STORAGE_KEY);
    localStorage.setItem(DEMO_MIGRATION_KEY, '1');
  }

  const style = document.createElement('style');
  style.id = 'rcoa-v3-fixes';
  style.textContent = `
    .eyebrow::before{display:none!important}

    .naif-footer-identity{
      border-right:1px solid rgba(255,255,255,.13);
      padding-right:24px;
      display:grid;
      gap:10px;
      align-items:center;
    }
    .naif-footer-main{display:flex;align-items:center;gap:12px;min-width:0}
    .naif-footer-main img{
      width:118px!important;
      height:50px!important;
      object-fit:contain!important;
      object-position:center!important;
      border:0!important;
      border-radius:0!important;
      background:transparent!important;
      padding:0!important;
      box-shadow:none!important;
      flex:0 0 auto;
    }
    .naif-footer-main div{display:grid;gap:1px}
    .naif-footer-main strong{font-size:13px;color:#fff;font-weight:700}
    .naif-footer-main small{font-size:10px;color:#9fb3b2}
    .naif-footer-social{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
    .naif-footer-social>strong{font-size:11px;color:#dcc681;margin-left:3px;direction:ltr}
    .naif-footer-social a{
      width:29px;height:29px;border:1px solid rgba(255,255,255,.14);border-radius:9px;
      display:grid;place-items:center;color:#dbe5e4;background:rgba(255,255,255,.035);
      transition:.16s ease;
    }
    .naif-footer-social a:hover{background:#fff;color:#132f32;transform:translateY(-1px)}
    .naif-footer-social svg{width:14px;height:14px;fill:currentColor}

    .suggestion-card-icon{
      width:44px!important;height:44px!important;min-width:44px!important;
      border-radius:13px!important;display:grid!important;place-items:center!important;
      background:#eef5f4!important;color:#1f4649!important;font-size:0!important;
    }
    .suggestion-card-icon svg{width:22px!important;height:22px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}

    .riyal-money{display:inline-flex;align-items:center;gap:.26em;direction:ltr;white-space:nowrap}
    .riyal-symbol{
      display:inline-block;width:.72em;height:.82em;flex:0 0 .72em;
      background:currentColor;
      -webkit-mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat;
      mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat;
    }
    .riyal-value{font-variant-numeric:tabular-nums}

    @media(max-width:760px){
      .naif-footer-identity{border-right:0;padding-right:0;border-top:1px solid rgba(255,255,255,.1);padding-top:14px}
      .naif-footer-main img{width:100px!important;height:44px!important}
    }
  `;
  document.head.appendChild(style);

  // Match Naif footer identity to the style used in tawassu_branch:
  // full uncropped logo + Almohammdin + social icons.
  const naif = document.querySelector('.naif-signature');
  if (naif) {
    naif.className = 'naif-signature naif-footer-identity';
    naif.innerHTML = `
      <div class="naif-footer-main">
        <img src="https://raw.githubusercontent.com/almohammdin/tawassu_branch/main/naif-logo-v2.png" alt="شعار نايف المحمدي">
        <div><strong>إعداد نايف المحمدي</strong><small>الهوية والتطوير</small></div>
      </div>
      <div class="naif-footer-social" aria-label="حسابات نايف المحمدي">
        <strong>Almohammdin</strong>
        <a href="https://x.com/almohammdin" target="_blank" rel="noopener" aria-label="X">
          <svg viewBox="0 0 24 24"><path d="M18.2 2H22l-8.3 9.5L23.5 22h-7.7l-6-7.9L2.9 22H-.9l8.9-10.2L-1.4 2h7.9l5.4 7.2L18.2 2Zm-1.3 18h2.1L5.4 3.9H3.2L16.9 20Z"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/almohammdin/" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24"><path d="M5.3 7.9H1.7V22h3.6V7.9ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22 13.9c0-4.2-2.2-6.2-5.2-6.2-2.4 0-3.5 1.3-4.1 2.2v-2H9.1V22h3.6v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H22v-8.1Z"/></svg>
        </a>
        <a href="https://www.snapchat.com/add/almohammdin" target="_blank" rel="noopener" aria-label="Snapchat">
          <svg viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg>
        </a>
        <a href="https://linktr.ee/almohammdin" target="_blank" rel="noopener" aria-label="Linktree">
          <svg viewBox="0 0 24 24"><path d="M13.736 5.852 17.644 2l1.92 1.92-3.852 3.736h5.644v2.736h-5.66l3.868 3.752-1.92 1.92-5.276-5.28-5.276 5.28-1.92-1.92 3.868-3.752H3.38V7.656h5.644L5.172 3.92 7.092 2l3.932 3.852V0h2.712v5.852ZM11.024 24v-8.604h2.712V24h-2.712Z"/></svg>
        </a>
      </div>`;
  }

  // Replace the ambiguous oversized suggestion mark with a compact calendar-plus icon,
  // and open the admin-only suggestion form directly (no oversized modal).
  const suggestionCard = document.querySelector('.suggestion-card');
  if (suggestionCard) {
    const icon = suggestionCard.querySelector('.suggestion-card-icon');
    if (icon) icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2"></rect><path d="M7 3v5M17 3v5M3.5 10h17M12 13v5M9.5 15.5h5"></path></svg>';
    const oldButton = suggestionCard.querySelector('[data-action="suggestion"]');
    if (oldButton) {
      const link = document.createElement('a');
      link.className = oldButton.className;
      link.href = FORM_URL;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'اقترح مناسبة';
      oldButton.replaceWith(link);
    }
  }
  document.getElementById('suggestionModal')?.remove();

  const sectionText = document.querySelector('.section-heading p');
  if (sectionText) sectionText.textContent = 'اختر المناسبة وسجل مقعدك مباشرة.';

  // Replace every rendered "SAR 123" with the Saudi riyal symbol on the LEFT of the number.
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
        if (!match) {
          fragment.appendChild(document.createTextNode(piece));
          return;
        }
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
  const observer = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) applyRiyal(node.parentElement);
      else if (node.nodeType === Node.ELEMENT_NODE) applyRiyal(node);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const script = document.createElement('script');
  script.src = 'assets/app-v2.js?v=3';
  script.defer = true;
  script.onload = () => {
    setTimeout(() => {
      applyRiyal();
      // Safety fallback: if an old browser state still prevents the demo seed from rendering,
      // reset once and reload. This does not repeat on subsequent visits.
      if (!document.querySelector('#eventsGrid .event-card') && !sessionStorage.getItem('rcoa_demo_reload_v3')) {
        sessionStorage.setItem('rcoa_demo_reload_v3', '1');
        localStorage.removeItem(APP_STORAGE_KEY);
        location.reload();
      }
    }, 120);
  };
  document.body.appendChild(script);
})();
