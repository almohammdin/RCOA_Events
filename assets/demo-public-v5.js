(() => {
  'use strict';

  const STORAGE_KEY = 'rcoa_events_state_v2';
  const MIGRATION_KEY = 'rcoa_events_demo_seed_v5';
  const BASE_URL = 'https://almohammdin.github.io/RCOA_Events/';
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeOh-2IDRUmDtlxD0l7jFsbHYQpnuhbfrYQhMT13jwCc3_vHw/viewform?usp=preview';
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

  if (!localStorage.getItem(MIGRATION_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
    localStorage.setItem(MIGRATION_KEY, '1');
  }

  const style = document.createElement('style');
  style.textContent = `
    .demo-public-list{margin-top:12px;padding:10px 11px;border-radius:13px;background:#f7faf9;border:1px solid #e3ecea;display:grid;gap:7px}
    .demo-public-list>span{font-size:11px;color:#64777a;font-weight:700}
    .demo-public-names{display:flex;flex-wrap:wrap;gap:5px}
    .demo-public-names b{font-size:10px;line-height:1.4;font-weight:600;color:#31565a;background:#fff;border:1px solid #dce6e4;border-radius:999px;padding:3px 8px}
    .demo-waiting{margin-top:9px;padding:8px 10px;border-radius:11px;background:#fff5df;color:#806622;font-size:11px;font-weight:700}
    .naif-footer-identity{border-right:1px solid rgba(255,255,255,.13);padding-right:14px;display:grid!important;grid-template-columns:auto auto!important;grid-template-areas:'logo label' 'social social'!important;align-items:center!important;justify-content:start!important;column-gap:8px!important;row-gap:6px!important;width:max-content!important;max-width:100%!important}
    .naif-footer-main{display:contents!important}
    .naif-footer-main img{grid-area:logo!important;width:82px!important;height:34px!important;object-fit:contain!important;border:0!important;border-radius:0!important;background:transparent!important;padding:0!important;filter:brightness(0) invert(1)!important}
    .naif-footer-main strong{grid-area:label!important;font-size:10px!important;color:#fff!important;white-space:nowrap!important}
    .naif-footer-social{grid-area:social!important;display:flex!important;flex-direction:row!important;align-items:center!important;gap:5px!important;flex-wrap:nowrap!important;width:max-content!important}
    .naif-footer-social>strong{font-size:9px!important;color:#dcc681!important;direction:ltr!important;white-space:nowrap!important;margin-left:2px!important}
    .naif-footer-social a{flex:0 0 25px!important;width:25px!important;height:25px!important;display:grid!important;place-items:center!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:8px!important;color:#fff!important;background:rgba(255,255,255,.04)!important;padding:0!important}
    .naif-footer-social svg{width:12px!important;height:12px!important;fill:currentColor!important}
    @media(max-width:760px){.naif-footer-identity{border-right:0!important;padding-right:0!important;border-top:1px solid rgba(255,255,255,.1)!important;padding-top:12px!important}}
  `;
  document.head.appendChild(style);

  const demoNames = {
    restaurant: ['سلمان أحمد','خالد العتيبي','ريم الحربي','عبدالله الزهراني'],
    cafe: ['فهد محمد','نورة السالم','وليد الشريف','أحمد باوزير','سارة العمري']
  };

  function currentState(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || demoState}catch{return demoState}
  }
  function availableSeats(event,state){
    const used=(state.registrations||[]).filter(r=>r.eventId===event.id&&['paid','pending_payment'].includes(r.status)).length;
    return Math.max(0,Number(event.capacity||0)-used);
  }
  function decorate(){
    const state=currentState();
    document.querySelectorAll('#eventsGrid .event-card[data-event-card]').forEach(card=>{
      const id=card.dataset.eventCard;
      const event=(state.events||[]).find(e=>e.id===id);
      if(!event)return;
      card.querySelectorAll('.demo-public-list,.demo-waiting').forEach(x=>x.remove());
      const actions=card.querySelector('.event-card-actions');
      if(!actions)return;
      if(event.showParticipants && demoNames[id]){
        const list=document.createElement('div');
        list.className='demo-public-list';
        list.innerHTML=`<span>المشاركون المؤكدون</span><div class="demo-public-names">${demoNames[id].map(n=>`<b>${n}</b>`).join('')}</div>`;
        actions.before(list);
      }
      const wait=(state.registrations||[]).filter(r=>r.eventId===id&&r.status==='waitlist').length;
      if(availableSeats(event,state)===0 && wait){
        const note=document.createElement('div');
        note.className='demo-waiting';
        note.textContent=`اكتملت المقاعد · ${wait} في قائمة الانتظار`;
        actions.before(note);
      }
    });
  }

  function shareDemo(event){
    const state=currentState();
    const item=(state.events||[]).find(e=>e.id===event.id);
    if(!item)return;
    const n=v=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(v||0));
    const d=v=>new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${v}T12:00:00`));
    const t=v=>{const [h,m]=v.split(':').map(Number);return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{hour:'numeric',minute:'2-digit'}).format(new Date(2026,0,1,h,m))};
    const wait=(state.registrations||[]).filter(r=>r.eventId===item.id&&r.status==='waitlist').length;
    const free=availableSeats(item,state);
    const seats=free>0?`المقاعد المتاحة: ${free}`:`المقاعد مكتملة${wait?` · قائمة الانتظار: ${wait}`:''}`;
    const price=Number(item.price||0)===0?'مجاني':`${n(item.price)} ريال`;
    const url=item.sharePath?`${BASE_URL}${item.sharePath}`:`${BASE_URL}?event=${encodeURIComponent(item.id)}`;
    const text=`*${item.title}*\n\n${item.description}\n\n\uD83D\uDCC5 ${d(item.date)}\n\u23F0 ${t(item.start)} إلى ${t(item.end)}\n\uD83D\uDCCD ${item.venue} · ${item.city}\n\uD83D\uDCB3 ${price}\n\uD83C\uDF9F\uFE0F ${seats}\n\nالتسجيل والتفاصيل:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank','noopener');
  }

  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-share-event]');
    if(!button)return;
    const state=currentState();
    const item=(state.events||[]).find(x=>x.id===button.dataset.shareEvent);
    if(!item)return;
    e.preventDefault();e.stopImmediatePropagation();shareDemo(item);
  },true);

  const observer=new MutationObserver(()=>{if(document.querySelector('#eventsGrid .event-card'))decorate()});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(decorate,250);

  // Ensure suggestion card uses the proper icon and direct admin form link.
  const suggestion=document.querySelector('.suggestion-card');
  if(suggestion){
    const icon=suggestion.querySelector('.suggestion-card-icon');
    if(icon)icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"></rect><path d="M7 3v5M17 3v5M3.5 10h17M12 13v5M9.5 15.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>';
    const old=suggestion.querySelector('[data-action="suggestion"]');
    if(old && old.tagName!=='A'){
      const a=document.createElement('a');a.className=old.className;a.href=FORM_URL;a.target='_blank';a.rel='noopener';a.textContent='اقترح مناسبة';old.replaceWith(a);
    }
  }
})();