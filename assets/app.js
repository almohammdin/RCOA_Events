(() => {
  'use strict';

  const STORAGE_KEY = 'rcoa_events_state_v2';
  const MIGRATION_KEY = 'rcoa_events_demo_seed_v4';
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeOh-2IDRUmDtlxD0l7jFsbHYQpnuhbfrYQhMT13jwCc3_vHw/viewform?usp=preview';
  const BASE_URL = 'https://almohammdin.github.io/RCOA_Events/';

  const now = Date.now();
  const demoState = {
    events: [
      {id:'restaurant',title:'عشاء ملاك المطاعم: تجارب التشغيل والنمو',description:'عشاء مهني غير رسمي يجمع ملاك المطاعم لتبادل تجارب التشغيل والتوسع والموردين وتحديات السوق.',date:'2026-09-12',start:'20:00',end:'22:30',city:'جدة',venue:'مطعم الدار',mapUrl:'',price:95,capacity:12,paymentWindowHours:6,published:true,showParticipants:true,sharePath:'events/restaurant.html'},
      {id:'cafe',title:'لقاء ملاك المقاهي: من المنتج إلى تجربة العميل',description:'جلسة عملية حول تجربة العميل والقائمة والتسعير وجودة المنتج وقراءة سلوك الزوار.',date:'2026-09-19',start:'19:30',end:'21:30',city:'جدة',venue:'مقهى الساحة',mapUrl:'',price:60,capacity:5,paymentWindowHours:6,published:true,showParticipants:true,sharePath:'events/cafe.html'},
      {id:'course',title:'دورة قراءة أرقام المطعم واتخاذ القرار',description:'دورة تطبيقية لأصحاب ومديري المنشآت لفهم أهم مؤشرات التشغيل وتحويل الأرقام إلى قرارات.',date:'2026-09-24',start:'17:00',end:'20:30',city:'جدة',venue:'قاعة الجمعية',mapUrl:'',price:180,capacity:16,paymentWindowHours:12,published:true,showParticipants:false,sharePath:'events/course.html'},
      {id:'taif',title:'رحلة الضيافة المحلية إلى الطائف',description:'زيارة يوم واحد لعدد من تجارب المطاعم والمقاهي مع لقاءات أصحاب المشاريع وتبادل الخبرات.',date:'2026-10-03',start:'08:00',end:'20:00',city:'الطائف',venue:'نقطة التجمع تعلن للمسجلين',mapUrl:'',price:220,capacity:30,paymentWindowHours:12,published:true,showParticipants:false,sharePath:'events/taif.html'},
      {id:'riyadh',title:'الرحلة الدورية لملاك القطاع، الرياض',description:'برنامج دوري يجمع الزيارات الميدانية واللقاءات المهنية والتعرف على تجارب تشغيلية مختلفة.',date:'2026-10-15',start:'09:00',end:'22:00',city:'الرياض',venue:'مواقع متعددة',mapUrl:'',price:350,capacity:35,paymentWindowHours:18,published:true,showParticipants:false,sharePath:'events/riyadh.html'},
      {id:'summer',title:'رحلة صيف الضيافة',description:'رحلة صيفية مهنية واجتماعية تشمل زيارات وتجارب ضيافة محلية ولقاءات مع أصحاب منشآت المنطقة.',date:'2027-07-08',start:'07:30',end:'21:30',city:'أبها',venue:'برنامج الرحلة يعلن لاحقًا',mapUrl:'',price:450,capacity:40,paymentWindowHours:24,published:true,showParticipants:false,sharePath:'events/summer.html'}
    ],
    registrations: [
      {id:'r1',eventId:'restaurant',name:'سلمان أحمد',phone:'+966500000001',company:'مطعم شرفة',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T10:00:00.000Z'},
      {id:'r2',eventId:'restaurant',name:'خالد العتيبي',phone:'+966500000002',company:'شركة مذاق',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T10:10:00.000Z'},
      {id:'r3',eventId:'restaurant',name:'ريم الحربي',phone:'+966500000003',company:'مطاعم المدينة',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T10:20:00.000Z'},
      {id:'r4',eventId:'restaurant',name:'عبدالله الزهراني',phone:'+966500000004',company:'بيت النكهة',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T10:30:00.000Z'},
      {id:'r5',eventId:'restaurant',name:'مشعل الغامدي',phone:'+966500000005',company:'',city:'جدة',status:'pending_payment',paymentDeadline:new Date(now+5*3600000).toISOString(),paymentUrl:'',createdAt:new Date(now-45*60000).toISOString()},

      {id:'c1',eventId:'cafe',name:'فهد محمد',phone:'+966500000011',company:'مقهى نواة',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:00:00.000Z'},
      {id:'c2',eventId:'cafe',name:'نورة السالم',phone:'+966500000012',company:'رشفة',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:05:00.000Z'},
      {id:'c3',eventId:'cafe',name:'وليد الشريف',phone:'+966500000013',company:'محامص الوادي',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:10:00.000Z'},
      {id:'c4',eventId:'cafe',name:'أحمد باوزير',phone:'+966500000014',company:'مقهى المدار',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:15:00.000Z'},
      {id:'c5',eventId:'cafe',name:'سارة العمري',phone:'+966500000015',company:'قهوة الساحة',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:20:00.000Z'},
      {id:'cw1',eventId:'cafe',name:'مازن الشمري',phone:'+966500000016',company:'',city:'جدة',status:'waitlist',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:30:00.000Z'},
      {id:'cw2',eventId:'cafe',name:'تركي المطيري',phone:'+966500000017',company:'مقهى بوابة',city:'مكة',status:'waitlist',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:35:00.000Z'},
      {id:'cw3',eventId:'cafe',name:'هند القحطاني',phone:'+966500000018',company:'',city:'جدة',status:'waitlist',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:40:00.000Z'},

      {id:'d1',eventId:'course',name:'عبدالله صالح',phone:'+966500000021',company:'مطاعم واجهة',city:'مكة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T12:00:00.000Z'},
      {id:'d2',eventId:'course',name:'بدر العوفي',phone:'+966500000022',company:'',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T12:10:00.000Z'}
    ]
  };

  // Load the layout layer used by the published page.
  const layout = document.createElement('link');
  layout.rel = 'stylesheet';
  layout.href = 'assets/overrides.css?v=4';
  document.head.appendChild(layout);

  // One-time demo migration. This intentionally refreshes the prototype examples once.
  if (!localStorage.getItem(MIGRATION_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
    localStorage.setItem(MIGRATION_KEY, '1');
  }

  const style = document.createElement('style');
  style.textContent = `
    .eyebrow::before{display:none!important}
    .naif-footer-identity{border-right:1px solid rgba(255,255,255,.13);padding-right:18px;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:7px!important;min-width:210px!important;width:auto!important}
    .naif-footer-main{display:flex!important;align-items:center!important;gap:8px!important;min-width:0!important}
    .naif-footer-main img{width:88px!important;height:36px!important;object-fit:contain!important;object-position:center!important;border:0!important;border-radius:0!important;background:transparent!important;padding:0!important;box-shadow:none!important;filter:brightness(0) invert(1)!important}
    .naif-footer-main strong{font-size:11px!important;color:#fff!important;font-weight:700!important;white-space:nowrap!important}
    .naif-footer-social{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;flex-wrap:nowrap!important;width:max-content!important;max-width:100%!important}
    .naif-footer-social>strong{font-size:9px!important;color:#dcc681!important;margin:0 0 0 3px!important;direction:ltr!important;white-space:nowrap!important}
    .naif-footer-social a{flex:0 0 27px!important;width:27px!important;height:27px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:8px!important;display:grid!important;place-items:center!important;color:#fff!important;background:rgba(255,255,255,.04)!important;transition:.16s ease!important;padding:0!important}
    .naif-footer-social a:hover{background:#fff!important;color:#132f32!important;transform:translateY(-1px)!important}
    .naif-footer-social svg{width:13px!important;height:13px!important;fill:currentColor!important}
    .suggestion-card-icon{width:40px!important;height:40px!important;min-width:40px!important;border-radius:12px!important;display:grid!important;place-items:center!important;background:#eef5f4!important;color:#1f4649!important;font-size:0!important}
    .suggestion-card-icon svg{width:21px!important;height:21px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
    .riyal-money{display:inline-flex;align-items:center;gap:.25em;direction:ltr;white-space:nowrap}
    .riyal-symbol{display:inline-block;width:.72em;height:.82em;flex:0 0 .72em;background:currentColor;-webkit-mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat;mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat}
    .riyal-value{font-variant-numeric:tabular-nums}
    .card-participants-preview{margin-top:13px;padding:10px 11px;border-radius:13px;background:#f7faf9;border:1px solid #e6edec;display:grid;gap:7px}
    .card-participants-preview>span{font-size:11px;color:#6b7b7e;font-weight:700}
    .card-participants-names{display:flex;flex-wrap:wrap;gap:5px}.card-participants-names b{font-size:10px;font-weight:600;background:#fff;border:1px solid #dfe7e6;border-radius:999px;padding:3px 8px;color:#35565a}
    .card-waitlist-note{margin-top:11px;padding:8px 10px;border-radius:11px;background:#fff5df;color:#806622;font-size:11px;font-weight:700}
    @media(max-width:760px){.naif-footer-identity{border-right:0!important;padding-right:0!important;border-top:1px solid rgba(255,255,255,.1)!important;padding-top:12px!important;min-width:0!important}.naif-footer-main img{width:82px!important;height:34px!important}.naif-footer-social{flex-wrap:nowrap!important}}
  `;
  document.head.appendChild(style);

  // Naif identity: small, white, no photo, no circle; social icons in one row.
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

  // Compact "اقترح مناسبة" card with a clear calendar-plus icon.
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
  if (version) version.textContent = 'الإصدار 0.4.0';

  function getState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return demoState; }
  }
  function getEvent(id) { return (getState().events || []).find(item => item.id === id); }
  function registrationsFor(id) { return (getState().registrations || []).filter(item => item.eventId === id); }
  function availableSeats(event) {
    const occupied = registrationsFor(event.id).filter(item => ['paid','pending_payment'].includes(item.status)).length;
    return Math.max(0, Number(event.capacity || 0) - occupied);
  }
  function waitlistCount(id) { return registrationsFor(id).filter(item => item.status === 'waitlist').length; }
  function formatDate(value) {
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`));
  }
  function formatTime(value) {
    const [h,m] = String(value).split(':').map(Number);
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{hour:'numeric',minute:'2-digit'}).format(new Date(2026,0,1,h,m));
  }
  function formatNumber(value) { return new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(value || 0)); }
  function shareUrl(event) { return event.sharePath ? `${BASE_URL}${event.sharePath}` : `${BASE_URL}?event=${encodeURIComponent(event.id)}`; }

  // WhatsApp text uses Unicode escapes to avoid damaged emoji/replacement characters.
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-share-event],[data-admin-share]');
    if (!button) return;
    const id = button.getAttribute('data-share-event') || button.getAttribute('data-admin-share');
    const item = getEvent(id);
    if (!item) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const available = availableSeats(item);
    const wait = waitlistCount(item.id);
    const seatLine = available > 0 ? `المقاعد المتاحة: ${available}` : `المقاعد مكتملة${wait ? ` · قائمة الانتظار: ${wait}` : ''}`;
    const priceLine = Number(item.price || 0) === 0 ? 'مجاني' : `${formatNumber(item.price)} ريال`;
    const text = `*${item.title}*\n\n${item.description}\n\n\uD83D\uDCC5 ${formatDate(item.date)}\n\u23F0 ${formatTime(item.start)} إلى ${formatTime(item.end)}\n\uD83D\uDCCD ${item.venue} · ${item.city}\n\uD83D\uDCB3 ${priceLine}\n\uD83C\uDF9F\uFE0F ${seatLine}\n\nالتسجيل والتفاصيل:\n${shareUrl(item)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }, true);

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

  function decorateCards() {
    const state = getState();
    document.querySelectorAll('#eventsGrid .event-card[data-event-card]').forEach(card => {
      const id = card.getAttribute('data-event-card');
      const item = (state.events || []).find(e => e.id === id);
      if (!item) return;
      card.querySelectorAll('.card-participants-preview,.card-waitlist-note').forEach(el => el.remove());
      const regs = (state.registrations || []).filter(r => r.eventId === id);
      const confirmed = regs.filter(r => r.status === 'paid');
      const wait = regs.filter(r => r.status === 'waitlist').length;
      const actions = card.querySelector('.event-card-actions');
      if (!actions) return;
      if (item.showParticipants && confirmed.length) {
        const preview = document.createElement('div');
        preview.className = 'card-participants-preview';
        const names = confirmed.slice(0,4).map(r => `<b>${String(r.name).replace(/[&<>"']/g,'')}</b>`).join('');
        preview.innerHTML = `<span>من المشاركين المؤكدين</span><div class="card-participants-names">${names}${confirmed.length>4?`<b>+${confirmed.length-4}</b>`:''}</div>`;
        actions.before(preview);
      }
      if (availableSeats(item) === 0 && wait) {
        const note = document.createElement('div');
        note.className = 'card-waitlist-note';
        note.textContent = `اكتملت المقاعد · ${wait} في قائمة الانتظار`;
        actions.before(note);
      }
    });
  }

  applyRiyal();
  const observer = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) applyRiyal(node.parentElement);
      if (node.nodeType === Node.ELEMENT_NODE) applyRiyal(node);
    }));
    if (document.querySelector('#eventsGrid .event-card')) decorateCards();
  });
  observer.observe(document.body, {childList:true, subtree:true});

  const script = document.createElement('script');
  script.src = 'assets/app-v2.js?v=4';
  script.defer = true;
  script.onload = () => setTimeout(() => {
    applyRiyal();
    decorateCards();
    if (!document.querySelector('#eventsGrid .event-card') && !sessionStorage.getItem('rcoa_demo_reload_v4')) {
      sessionStorage.setItem('rcoa_demo_reload_v4', '1');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
      location.reload();
    }
  }, 180);
  document.body.appendChild(script);
})();
