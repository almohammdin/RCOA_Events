(() => {
  'use strict';

  const STORAGE_KEY = 'rcoa_events_state_v2';
  const ADMIN_PIN = '2026';
  const BASE_URL = 'https://almohammdin.github.io/RCOA_Events/';

  const seedState = {
    events: [
      {id:'restaurant',title:'عشاء ملاك المطاعم: تجارب التشغيل والنمو',description:'عشاء مهني غير رسمي يجمع ملاك المطاعم لتبادل تجارب التشغيل والتوسع والموردين وتحديات السوق.',date:'2026-09-12',start:'20:00',end:'22:30',city:'جدة',venue:'مطعم الدار',mapUrl:'',price:95,capacity:36,paymentWindowHours:6,published:true,showParticipants:true,sharePath:'events/restaurant.html'},
      {id:'cafe',title:'لقاء ملاك المقاهي: من المنتج إلى تجربة العميل',description:'جلسة عملية حول تجربة العميل والقائمة والتسعير وجودة المنتج وقراءة سلوك الزوار.',date:'2026-09-19',start:'19:30',end:'21:30',city:'جدة',venue:'مقهى الساحة',mapUrl:'',price:60,capacity:28,paymentWindowHours:6,published:true,showParticipants:true,sharePath:'events/cafe.html'},
      {id:'course',title:'دورة قراءة أرقام المطعم واتخاذ القرار',description:'دورة تطبيقية لأصحاب ومديري المنشآت لفهم أهم مؤشرات التشغيل وتحويل الأرقام إلى قرارات.',date:'2026-09-24',start:'17:00',end:'20:30',city:'جدة',venue:'قاعة الجمعية',mapUrl:'',price:180,capacity:24,paymentWindowHours:12,published:true,showParticipants:true,sharePath:'events/course.html'},
      {id:'taif',title:'رحلة الضيافة المحلية إلى الطائف',description:'زيارة يوم واحد لعدد من تجارب المطاعم والمقاهي مع لقاءات أصحاب المشاريع وتبادل الخبرات.',date:'2026-10-03',start:'08:00',end:'20:00',city:'الطائف',venue:'نقطة التجمع تعلن للمسجلين',mapUrl:'',price:220,capacity:30,paymentWindowHours:12,published:true,showParticipants:false,sharePath:'events/taif.html'},
      {id:'riyadh',title:'الرحلة الدورية لملاك القطاع، الرياض',description:'برنامج دوري يجمع الزيارات الميدانية واللقاءات المهنية والتعرف على تجارب تشغيلية مختلفة.',date:'2026-10-15',start:'09:00',end:'22:00',city:'الرياض',venue:'مواقع متعددة',mapUrl:'',price:350,capacity:35,paymentWindowHours:18,published:true,showParticipants:false,sharePath:'events/riyadh.html'},
      {id:'summer',title:'رحلة صيف الضيافة',description:'رحلة صيفية مهنية واجتماعية تشمل زيارات وتجارب ضيافة محلية ولقاءات مع أصحاب منشآت المنطقة.',date:'2027-07-08',start:'07:30',end:'21:30',city:'أبها',venue:'برنامج الرحلة يعلن لاحقًا',mapUrl:'',price:450,capacity:40,paymentWindowHours:24,published:true,showParticipants:false,sharePath:'events/summer.html'}
    ],
    registrations: [
      {id:'reg1',eventId:'restaurant',name:'سلمان أحمد',phone:'+966500000001',company:'مطعم نموذجي',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T10:00:00.000Z'},
      {id:'reg2',eventId:'restaurant',name:'خالد العتيبي',phone:'+966500000002',company:'شركة الضيافة الأولى',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T10:10:00.000Z'},
      {id:'reg3',eventId:'restaurant',name:'ريم الحربي',phone:'+966500000003',company:'مطاعم المدينة',city:'جدة',status:'pending_payment',paymentDeadline:new Date(Date.now()+5*3600000).toISOString(),paymentUrl:'',createdAt:new Date(Date.now()-3600000).toISOString()},
      {id:'reg4',eventId:'cafe',name:'فهد محمد',phone:'+966500000004',company:'مقهى تجريبي',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:00:00.000Z'},
      {id:'reg5',eventId:'cafe',name:'نورة السالم',phone:'+966500000005',company:'رشفة',city:'جدة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T11:20:00.000Z'},
      {id:'reg6',eventId:'course',name:'عبدالله صالح',phone:'+966500000006',company:'',city:'مكة',status:'paid',paymentDeadline:null,paymentUrl:'',createdAt:'2026-09-01T12:00:00.000Z'},
      {id:'reg7',eventId:'course',name:'مازن الشمري',phone:'+966500000007',company:'مجموعة تجريبية',city:'جدة',status:'waitlist',paymentDeadline:null,paymentUrl:'',createdAt:new Date(Date.now()-1800000).toISOString()}
    ]
  };

  let state = loadState();
  let activeAdminTab = 'events';
  let toastTimer;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function loadState(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw) return structuredClone(seedState);
      const parsed=JSON.parse(raw);
      return {events:Array.isArray(parsed.events)?parsed.events:structuredClone(seedState.events),registrations:Array.isArray(parsed.registrations)?parsed.registrations:[]};
    }catch{return structuredClone(seedState)}
  }
  function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  function uid(prefix){return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}
  function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function normalizePhone(v=''){
    let n=String(v).replace(/\D/g,'');
    if(n.startsWith('00966'))n=n.slice(2);
    if(n.startsWith('966'))return `+${n}`;
    if(n.startsWith('05'))return `+966${n.slice(1)}`;
    if(n.startsWith('5')&&n.length===9)return `+966${n}`;
    return n?`+${n}`:'';
  }
  function whatsappPhone(v=''){return normalizePhone(v).replace('+','')}
  function formatDate(v){if(!v)return'·';return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${v}T12:00:00`))}
  function formatDateShort(v){if(!v)return'·';return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${v}T12:00:00`))}
  function formatTime(v){if(!v)return'·';const [h,m]=v.split(':').map(Number);return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{hour:'numeric',minute:'2-digit'}).format(new Date(2026,0,1,h,m))}
  function formatMoney(v){return Number(v||0)===0?'مجاني':`SAR ${new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(v))}`}
  function eventById(id){return state.events.find(e=>e.id===id)}
  function regById(id){return state.registrations.find(r=>r.id===id)}
  function regsFor(id){return state.registrations.filter(r=>r.eventId===id)}
  function activeRegs(id){return regsFor(id).filter(r=>['pending_payment','paid'].includes(r.status))}
  function availableSeats(e){return Math.max(0,Number(e.capacity||0)-activeRegs(e.id).length)}
  function waitCount(id){return regsFor(id).filter(r=>r.status==='waitlist').length}
  function statusInfo(s){return {pending_payment:['بانتظار السداد','warning'],paid:['مؤكد','success'],waitlist:['قائمة الانتظار','gold'],expired:['انتهت مهلة السداد','danger'],cancelled:['ملغي','muted']}[s]||[s,'muted']}
  function createDeadline(h){return new Date(Date.now()+Number(h||6)*3600000).toISOString()}
  function deadlineText(iso){if(!iso)return'';const ms=new Date(iso).getTime()-Date.now();if(ms<=0)return'انتهت المهلة';const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000);return h?`متبقي ${h} س ${m} د`:`متبقي ${m} دقيقة`}

  function promoteWaitlist(eventId){
    const e=eventById(eventId);if(!e||availableSeats(e)<1)return null;
    const next=regsFor(eventId).filter(r=>r.status==='waitlist').sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt))[0];
    if(!next)return null;
    next.status=Number(e.price)>0?'pending_payment':'paid';
    next.paymentDeadline=Number(e.price)>0?createDeadline(e.paymentWindowHours):null;
    next.promotedAt=new Date().toISOString();return next;
  }
  function processExpirations(){
    let changed=false;const now=Date.now();const affected=new Set();
    state.registrations.forEach(r=>{if(r.status==='pending_payment'&&r.paymentDeadline&&new Date(r.paymentDeadline).getTime()<=now){r.status='expired';r.expiredAt=new Date().toISOString();r.paymentDeadline=null;affected.add(r.eventId);changed=true}});
    affected.forEach(id=>{const e=eventById(id);while(e&&availableSeats(e)>0&&regsFor(id).some(r=>r.status==='waitlist')){if(!promoteWaitlist(id))break}});
    if(changed)saveState();return changed;
  }

  function toast(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2500)}
  function openModal(id){const m=document.getElementById(id);if(!m)return;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('modal-open')}
  function closeModal(target){const m=typeof target==='string'?document.getElementById(target):target;if(!m)return;m.classList.remove('open');m.setAttribute('aria-hidden','true');if(!document.querySelector('.modal.open'))document.body.classList.remove('modal-open')}

  const icons={calendar:'<svg viewBox="0 0 24 24"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm11 8H6v10h12V10ZM6 6v2h12V6H6Z"/></svg>',pin:'<svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>',clock:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z"/></svg>'};
  function shareUrl(e){return e.sharePath?`${BASE_URL}${e.sharePath}`:`${BASE_URL}?event=${encodeURIComponent(e.id)}`}
  function shareText(e){return `*${e.title}*\n\n${e.description}\n\n📅 ${formatDate(e.date)}\n⏰ ${formatTime(e.start)} إلى ${formatTime(e.end)}\n📍 ${e.venue} · ${e.city}\n💳 ${formatMoney(e.price)}\n🎟️ المقاعد المتاحة: ${availableSeats(e)}\n\nالتسجيل والتفاصيل:\n${shareUrl(e)}`}
  async function copyText(text){try{await navigator.clipboard.writeText(text);toast('تم نسخ الرابط')}catch{prompt('انسخ الرابط',text)}}

  function renderEvents(){
    processExpirations();const grid=$('#eventsGrid');if(!grid)return;
    const list=state.events.filter(e=>e.published).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
    $('#eventsEmpty').hidden=list.length>0;
    grid.innerHTML=list.map(e=>{const available=availableSeats(e),cap=Number(e.capacity||1),pct=Math.min(100,Math.round(((cap-available)/cap)*100));return `<article class="event-card" data-event-card="${escapeHtml(e.id)}"><div class="event-accent"></div><div class="event-body"><div class="event-meta-row"><span class="badge ${available===0?'gold':''}">${available===0?'التسجيل انتظار':'التسجيل متاح'}</span><span class="event-price">${escapeHtml(formatMoney(e.price))}</span></div><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(e.description)}</p><div class="event-facts"><div class="event-fact">${icons.calendar}<span>${escapeHtml(formatDateShort(e.date))}</span></div><div class="event-fact">${icons.clock}<span>${escapeHtml(formatTime(e.start))} إلى ${escapeHtml(formatTime(e.end))}</span></div><div class="event-fact">${icons.pin}<span>${escapeHtml(e.venue)} · ${escapeHtml(e.city)}</span></div></div><div class="seats-note"><span>${available} من ${cap} مقعد متاح</span><div class="progress"><span style="width:${pct}%"></span></div></div><div class="event-card-actions"><button class="btn btn-dark" data-event-details="${escapeHtml(e.id)}">التفاصيل والتسجيل</button><button class="share-btn" data-share-event="${escapeHtml(e.id)}" aria-label="مشاركة الرابط"><svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.35a3.1 3.1 0 0 0 0-1.7L15.6 8.8A3 3 0 1 0 15 7a3 3 0 0 0 .08.67l-6.7 3.35a3 3 0 1 0 0 3.96l6.7 3.35A3 3 0 1 0 18 16Z"/></svg></button></div></div></article>`}).join('');
  }

  function showEventDetails(id){
    const e=eventById(id);if(!e)return;const available=availableSeats(e);const confirmed=regsFor(id).filter(r=>r.status==='paid');
    const participants=e.showParticipants&&confirmed.length?`<section class="participant-list"><h3>المشاركون المؤكدون</h3><div class="participant-chips">${confirmed.map(r=>`<span class="participant-chip">${escapeHtml(r.name)}</span>`).join('')}</div></section>`:'';
    $('#eventModalBody').innerHTML=`<div class="event-detail-grid"><div class="event-detail-main"><span class="eyebrow">${available?'التسجيل متاح':'قائمة الانتظار متاحة'}</span><h2 id="eventModalTitle">${escapeHtml(e.title)}</h2><p>${escapeHtml(e.description)}</p><div class="detail-facts"><div class="detail-fact"><span>التاريخ</span><strong>${escapeHtml(formatDate(e.date))}</strong></div><div class="detail-fact"><span>الوقت</span><strong>${escapeHtml(formatTime(e.start))} إلى ${escapeHtml(formatTime(e.end))}</strong></div><div class="detail-fact"><span>المكان</span><strong>${escapeHtml(e.venue)}</strong></div><div class="detail-fact"><span>المدينة</span><strong>${escapeHtml(e.city)}</strong></div></div>${e.mapUrl?`<a class="btn btn-secondary compact" href="${escapeHtml(e.mapUrl)}" target="_blank" rel="noopener">فتح الموقع</a>`:''}${participants}</div><aside class="event-detail-side"><span class="price-label">رسوم المشاركة</span><div class="big-price">${escapeHtml(formatMoney(e.price))}</div><p>${available?`متبقي ${available} من أصل ${e.capacity} مقعد.`:`اكتملت المقاعد. سيتم تسجيلك في قائمة الانتظار، وعدد المنتظرين حاليًا ${waitCount(e.id)}.`}</p><button class="btn btn-primary full" data-register-event="${escapeHtml(e.id)}">${available?'سجل مقعدك':'انضم لقائمة الانتظار'}</button><button class="btn btn-secondary full" style="margin-top:8px" data-share-event="${escapeHtml(e.id)}">مشاركة المناسبة</button></aside></div>`;
    openModal('eventModal');
  }

  function openRegistration(id){const e=eventById(id);if(!e)return;$('#registrationForm').reset();$('#registrationEventId').value=e.id;$('#registrationEventName').textContent=`${e.title} · ${formatDateShort(e.date)}`;closeModal('eventModal');openModal('registrationModal')}
  function registerUser(){
    processExpirations();const e=eventById($('#registrationEventId').value);if(!e)return;const phone=normalizePhone($('#regPhone').value);if(!/^\+9665\d{8}$/.test(phone)){toast('تحقق من رقم الجوال');return}
    if(state.registrations.some(r=>r.eventId===e.id&&normalizePhone(r.phone)===phone&&['pending_payment','paid','waitlist'].includes(r.status))){toast('لديك تسجيل قائم لهذه المناسبة');return}
    const hasSeat=availableSeats(e)>0,isFree=Number(e.price)===0,status=hasSeat?(isFree?'paid':'pending_payment'):'waitlist';
    state.registrations.push({id:uid('reg'),eventId:e.id,name:$('#regName').value.trim(),phone,company:$('#regCompany').value.trim(),city:$('#regCity').value.trim(),status,paymentDeadline:status==='pending_payment'?createDeadline(e.paymentWindowHours):null,paymentUrl:'',invoiceId:'',createdAt:new Date().toISOString()});saveState();renderEvents();closeModal('registrationModal');toast(status==='waitlist'?'تم تسجيلك في قائمة الانتظار':status==='paid'?'تم تأكيد مقعدك':`تم حجز مقعدك مؤقتًا لمدة ${e.paymentWindowHours} ساعات`);setTimeout(()=>{$('#managePhone').value=phone.replace('+966','0');renderManage(phone);openModal('manageModal')},220);
  }

  function renderManage(input){
    processExpirations();const phone=normalizePhone(input),root=$('#manageResults'),list=state.registrations.filter(r=>normalizePhone(r.phone)===phone).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    if(!list.length){root.innerHTML='<div class="empty-state"><strong>لا توجد تسجيلات بهذا الرقم</strong><span>تحقق من الرقم أو سجل في إحدى الفعاليات.</span></div>';return}
    root.innerHTML=list.map(r=>{const e=eventById(r.eventId);if(!e)return'';const [label,cls]=statusInfo(r.status);const canCancel=['pending_payment','paid','waitlist'].includes(r.status),canRejoin=['expired','cancelled'].includes(r.status);const pay=r.status==='pending_payment'?`<div class="payment-box">${r.paymentUrl?`رابط السداد جاهز: <a href="${escapeHtml(r.paymentUrl)}" target="_blank" rel="noopener">فتح MyFatoorah</a>`:'رابط السداد لم يرسل بعد. ستقوم الإدارة بإرساله لك.'}</div>`:'';return `<article class="registration-item"><div class="registration-item-head"><div><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(formatDateShort(e.date))} · ${escapeHtml(e.city)}</p></div><span class="badge ${cls}">${label}</span></div>${r.status==='pending_payment'?`<span class="deadline">${escapeHtml(deadlineText(r.paymentDeadline))}</span>`:''}${pay}<div class="registration-actions">${canCancel?`<button class="btn btn-danger" data-cancel-registration="${r.id}">إلغاء تسجيلي</button>`:''}${canRejoin?`<button class="btn btn-secondary" data-rejoin-registration="${r.id}">إعادة التسجيل</button>`:''}<button class="btn btn-ghost" data-event-details="${e.id}">تفاصيل المناسبة</button></div></article>`}).join('');
  }
  function cancelReg(id){const r=regById(id);if(!r||!['pending_payment','paid','waitlist'].includes(r.status))return;const frees=['pending_payment','paid'].includes(r.status);r.status='cancelled';r.cancelledAt=new Date().toISOString();r.paymentDeadline=null;if(frees)promoteWaitlist(r.eventId);saveState();renderEvents();renderManage(r.phone);toast('تم إلغاء تسجيلك')}
  function rejoinReg(id){processExpirations();const old=regById(id),e=old&&eventById(old.eventId);if(!old||!e||!['expired','cancelled'].includes(old.status))return;if(state.registrations.some(r=>r.eventId===e.id&&normalizePhone(r.phone)===normalizePhone(old.phone)&&['pending_payment','paid','waitlist'].includes(r.status))){toast('لديك تسجيل قائم بالفعل');return}const hasSeat=availableSeats(e)>0,isFree=Number(e.price)===0,status=hasSeat?(isFree?'paid':'pending_payment'):'waitlist';state.registrations.push({...old,id:uid('reg'),status,paymentDeadline:status==='pending_payment'?createDeadline(e.paymentWindowHours):null,paymentUrl:'',invoiceId:'',createdAt:new Date().toISOString(),cancelledAt:null,expiredAt:null});saveState();renderEvents();renderManage(old.phone);toast(status==='waitlist'?'أعدنا تسجيلك في قائمة الانتظار':'تم إعادة حجز مقعدك')}

  function renderStats(){const paid=state.registrations.filter(r=>r.status==='paid'),pending=state.registrations.filter(r=>r.status==='pending_payment').length,wait=state.registrations.filter(r=>r.status==='waitlist').length,revenue=paid.reduce((s,r)=>s+Number(eventById(r.eventId)?.price||0),0);$('#adminStats').innerHTML=`<div class="stat"><span>المؤكدون</span><strong>${paid.length}</strong></div><div class="stat"><span>بانتظار السداد</span><strong>${pending}</strong></div><div class="stat"><span>قائمة الانتظار</span><strong>${wait}</strong></div><div class="stat"><span>الإيراد المؤكد</span><strong>${escapeHtml(formatMoney(revenue))}</strong></div>`}
  function renderAdmin(){processExpirations();renderStats();$$('.admin-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===activeAdminTab));if(activeAdminTab==='events')renderAdminEvents();else if(activeAdminTab==='registrations')renderAdminRegs();else renderIntegration()}
  function renderAdminEvents(){const root=$('#adminContent');root.innerHTML=`<div class="admin-list">${[...state.events].sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(e=>`<article class="admin-event"><div><div style="display:flex;gap:7px;align-items:center;margin-bottom:6px"><span class="badge ${e.published?'success':'muted'}">${e.published?'منشور':'مخفي'}</span><span class="badge ${e.showParticipants?'gold':'muted'}">${e.showParticipants?'الأسماء ظاهرة':'الأسماء مخفية'}</span></div><h3>${escapeHtml(e.title)}</h3><p>${escapeHtml(formatDateShort(e.date))} · ${escapeHtml(e.venue)} · ${activeRegs(e.id).length}/${e.capacity} مقعد</p></div><div class="admin-event-actions"><button class="btn btn-secondary" data-admin-share="${e.id}">نشر الرابط</button><button class="btn btn-ghost" data-copy-link="${e.id}">نسخ الرابط</button><button class="btn btn-ghost" data-toggle-names="${e.id}">${e.showParticipants?'حجب الأسماء':'نشر الأسماء'}</button><button class="btn btn-ghost" data-edit-event="${e.id}">تعديل</button><button class="btn btn-ghost" data-toggle-publish="${e.id}">${e.published?'إخفاء':'نشر'}</button><button class="btn btn-danger" data-delete-event="${e.id}">حذف</button></div></article>`).join('')}</div>`}
  function renderAdminRegs(){const root=$('#adminContent'),list=[...state.registrations].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));if(!list.length){root.innerHTML='<div class="empty-state"><strong>لا يوجد مسجلون بعد</strong></div>';return}root.innerHTML=`<div class="table-wrap"><table><thead><tr><th>الاسم</th><th>المناسبة</th><th>الجوال</th><th>الحالة</th><th>السداد</th><th>الإجراء</th></tr></thead><tbody>${list.map(r=>{const e=eventById(r.eventId);if(!e)return'';const [label,cls]=statusInfo(r.status);const buttons=[];if(r.status==='pending_payment'){buttons.push(`<button data-payment-link="${r.id}">${r.paymentUrl?'تعديل الرابط':'إضافة رابط السداد'}</button>`);if(r.paymentUrl)buttons.push(`<button data-send-payment="${r.id}">إرسال الرابط</button>`);buttons.push(`<button data-remind="${r.id}">تذكير</button>`);buttons.push(`<button data-mark-paid="${r.id}">تم السداد</button>`);buttons.push(`<button data-expire="${r.id}">اعتذار</button>`)}if(r.status==='waitlist')buttons.push(`<button data-promote="${r.id}">ترقية</button>`);return `<tr><td>${escapeHtml(r.name)}</td><td>${escapeHtml(e.title)}</td><td dir="ltr">${escapeHtml(r.phone)}</td><td><span class="badge ${cls}">${label}</span></td><td>${r.paymentUrl?'<span class="badge success">الرابط جاهز</span>':'·'}</td><td><div class="table-actions">${buttons.join('')}</div></td></tr>`}).join('')}</tbody></table></div>`}
  function renderIntegration(){$('#adminContent').innerHTML='<div class="integration-grid"><article><strong>MyFatoorah الآن</strong><p>يمكن للإدارة إضافة رابط السداد لكل مسجل وإرساله عبر واتساب ثم تأكيد السداد يدويًا.</p></article><article><strong>الربط النهائي</strong><p>Backend آمن ينشئ الفاتورة، وWebhook يحدث حالة السداد تلقائيًا. لا يوضع مفتاح MyFatoorah داخل GitHub Pages.</p></article><article><strong>الرسائل الآلية</strong><p>التذكير والاعتذار التلقائي عبر واتساب يحتاج WhatsApp Business API أو مزودًا معتمدًا.</p></article></div>'}

  function openEditor(e=null){$('#eventEditorForm').reset();$('#editorTitle').textContent=e?'تعديل الفعالية':'إضافة فعالية';$('#editEventId').value=e?.id||'';$('#editTitle').value=e?.title||'';$('#editDescription').value=e?.description||'';$('#editDate').value=e?.date||'';$('#editCity').value=e?.city||'';$('#editStart').value=e?.start||'19:00';$('#editEnd').value=e?.end||'21:00';$('#editVenue').value=e?.venue||'';$('#editMap').value=e?.mapUrl||'';$('#editPrice').value=e?.price??0;$('#editCapacity').value=e?.capacity||30;$('#editPaymentHours').value=e?.paymentWindowHours||6;$('#editPublished').checked=e?.published??true;$('#editShowParticipants').checked=e?.showParticipants??false;openModal('eventEditorModal')}
  function saveEditor(){const id=$('#editEventId').value||uid('event');const existing=eventById(id);const e={id,title:$('#editTitle').value.trim(),description:$('#editDescription').value.trim(),date:$('#editDate').value,city:$('#editCity').value.trim(),start:$('#editStart').value,end:$('#editEnd').value,venue:$('#editVenue').value.trim(),mapUrl:$('#editMap').value.trim(),price:Number($('#editPrice').value||0),capacity:Number($('#editCapacity').value||1),paymentWindowHours:Number($('#editPaymentHours').value||6),published:$('#editPublished').checked,showParticipants:$('#editShowParticipants').checked,sharePath:existing?.sharePath||'',createdAt:existing?.createdAt||new Date().toISOString()};const i=state.events.findIndex(x=>x.id===id);if(i>=0)state.events[i]=e;else state.events.push(e);saveState();closeModal('eventEditorModal');renderAdmin();renderEvents();toast(i>=0?'تم تحديث المناسبة':'تمت إضافة المناسبة')}

  document.addEventListener('click',e=>{
    const close=e.target.closest('[data-close]');if(close){closeModal(close.closest('.modal'));return}
    const details=e.target.closest('[data-event-details]');if(details){showEventDetails(details.dataset.eventDetails);return}
    const register=e.target.closest('[data-register-event]');if(register){openRegistration(register.dataset.registerEvent);return}
    const share=e.target.closest('[data-share-event]');if(share){const ev=eventById(share.dataset.shareEvent);if(ev)window.open(`https://wa.me/?text=${encodeURIComponent(shareText(ev))}`,'_blank');return}
    const manage=e.target.closest('[data-action="manage-registration"]');if(manage){openModal('manageModal');return}
    const login=e.target.closest('[data-action="admin-login"]');if(login){openModal('adminLoginModal');return}
    const suggestion=e.target.closest('[data-action="suggestion"]');if(suggestion){openModal('suggestionModal');return}
    const cancel=e.target.closest('[data-cancel-registration]');if(cancel){cancelReg(cancel.dataset.cancelRegistration);return}
    const rejoin=e.target.closest('[data-rejoin-registration]');if(rejoin){rejoinReg(rejoin.dataset.rejoinRegistration);return}
    const tab=e.target.closest('[data-admin-tab]');if(tab){activeAdminTab=tab.dataset.adminTab;renderAdmin();return}
    if(e.target.closest('#newEventBtn')){openEditor();return}
    const edit=e.target.closest('[data-edit-event]');if(edit){openEditor(eventById(edit.dataset.editEvent));return}
    const publish=e.target.closest('[data-toggle-publish]');if(publish){const ev=eventById(publish.dataset.togglePublish);if(ev){ev.published=!ev.published;saveState();renderAdmin();renderEvents()}return}
    const names=e.target.closest('[data-toggle-names]');if(names){const ev=eventById(names.dataset.toggleNames);if(ev){ev.showParticipants=!ev.showParticipants;saveState();renderAdmin();renderEvents();toast(ev.showParticipants?'تم نشر أسماء المشاركين المؤكدين':'تم حجب أسماء المشاركين')}return}
    const copy=e.target.closest('[data-copy-link]');if(copy){const ev=eventById(copy.dataset.copyLink);if(ev)copyText(shareUrl(ev));return}
    const adminShare=e.target.closest('[data-admin-share]');if(adminShare){const ev=eventById(adminShare.dataset.adminShare);if(ev)window.open(`https://wa.me/?text=${encodeURIComponent(shareText(ev))}`,'_blank');return}
    const del=e.target.closest('[data-delete-event]');if(del){const ev=eventById(del.dataset.deleteEvent);if(ev&&confirm(`حذف «${ev.title}»؟`)){state.events=state.events.filter(x=>x.id!==ev.id);state.registrations=state.registrations.filter(r=>r.eventId!==ev.id);saveState();renderAdmin();renderEvents()}return}
    const link=e.target.closest('[data-payment-link]');if(link){const r=regById(link.dataset.paymentLink);if(r){const v=prompt('الصق رابط MyFatoorah',r.paymentUrl||'');if(v!==null){r.paymentUrl=v.trim();saveState();renderAdmin();toast('تم حفظ رابط السداد')}}return}
    const send=e.target.closest('[data-send-payment]');if(send){const r=regById(send.dataset.sendPayment),ev=r&&eventById(r.eventId);if(r&&ev&&r.paymentUrl){const msg=`مرحبًا ${r.name}، تم تسجيلك في «${ev.title}».\nالقيمة: ${formatMoney(ev.price)}\nيرجى إتمام السداد قبل انتهاء المهلة.\nرابط السداد:\n${r.paymentUrl}`;window.open(`https://wa.me/${whatsappPhone(r.phone)}?text=${encodeURIComponent(msg)}`,'_blank')}return}
    const remind=e.target.closest('[data-remind]');if(remind){const r=regById(remind.dataset.remind),ev=r&&eventById(r.eventId);if(r&&ev&&r.paymentUrl){r.lastReminderAt=new Date().toISOString();saveState();const msg=`مرحبًا ${r.name}، تذكير بإتمام سداد تسجيلك في «${ev.title}».\n${deadlineText(r.paymentDeadline)}\nرابط السداد:\n${r.paymentUrl}`;window.open(`https://wa.me/${whatsappPhone(r.phone)}?text=${encodeURIComponent(msg)}`,'_blank')}else toast('أضف رابط السداد أولًا');return}
    const paid=e.target.closest('[data-mark-paid]');if(paid){const r=regById(paid.dataset.markPaid);if(r){r.status='paid';r.paymentDeadline=null;r.paidAt=new Date().toISOString();saveState();renderAdmin();renderEvents();toast('تم تأكيد السداد')}return}
    const expire=e.target.closest('[data-expire]');if(expire){const r=regById(expire.dataset.expire);if(r){r.status='expired';r.paymentDeadline=null;r.expiredAt=new Date().toISOString();promoteWaitlist(r.eventId);saveState();renderAdmin();renderEvents();toast('تم إنهاء المهلة وتحرير المقعد')}return}
    const promote=e.target.closest('[data-promote]');if(promote){const r=regById(promote.dataset.promote),ev=r&&eventById(r.eventId);if(r&&ev){if(availableSeats(ev)<1)toast('لا يوجد مقعد متاح');else{r.status=Number(ev.price)>0?'pending_payment':'paid';r.paymentDeadline=Number(ev.price)>0?createDeadline(ev.paymentWindowHours):null;saveState();renderAdmin();renderEvents();toast('تمت ترقية المنتظر')}}return}
  });

  $('#registrationForm')?.addEventListener('submit',e=>{e.preventDefault();registerUser()});
  $('#manageSearchForm')?.addEventListener('submit',e=>{e.preventDefault();renderManage($('#managePhone').value)});
  $('#adminLoginForm')?.addEventListener('submit',e=>{e.preventDefault();if($('#adminPin').value!==ADMIN_PIN){toast('رمز الدخول غير صحيح');return}closeModal('adminLoginModal');openModal('adminModal');renderAdmin()});
  $('#eventEditorForm')?.addEventListener('submit',e=>{e.preventDefault();saveEditor()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.querySelector('.modal.open');if(m)closeModal(m)}});

  renderEvents();
  const requested=new URLSearchParams(location.search).get('event');if(requested&&eventById(requested)){setTimeout(()=>showEventDetails(requested),120)}
})();