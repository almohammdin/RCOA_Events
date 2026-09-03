(() => {
  'use strict';

  const STORAGE_KEY='rcoa_events_state_v2';
  const MIGRATION_KEY='rcoa_events_demo_seed_v4';
  const FORM_URL='https://docs.google.com/forms/d/e/1FAIpQLSeOh-2IDRUmDtlxD0l7jFsbHYQpnuhbfrYQhMT13jwCc3_vHw/viewform?usp=preview';
  const BASE_URL='https://almohammdin.github.io/RCOA_Events/';
  const now=Date.now();
  const paid=(id,eventId,name,phone,company='',city='جدة',createdAt='2026-09-01T10:00:00.000Z')=>({id,eventId,name,phone,company,city,status:'paid',paymentDeadline:null,paymentUrl:'',createdAt});
  const waiting=(id,eventId,name,phone,company='',city='جدة',createdAt='2026-09-01T11:30:00.000Z')=>({id,eventId,name,phone,company,city,status:'waitlist',paymentDeadline:null,paymentUrl:'',createdAt});

  const demoState={
    events:[
      {id:'restaurant',title:'عشاء ملاك المطاعم: تجارب التشغيل والنمو',description:'عشاء مهني غير رسمي يجمع ملاك المطاعم لتبادل تجارب التشغيل والتوسع والموردين وتحديات السوق.',date:'2026-09-12',start:'20:00',end:'22:30',city:'جدة',venue:'مطعم الدار',mapUrl:'',price:95,capacity:12,paymentWindowHours:6,published:true,showParticipants:true,sharePath:'events/restaurant.html'},
      {id:'cafe',title:'لقاء ملاك المقاهي: من المنتج إلى تجربة العميل',description:'جلسة عملية حول تجربة العميل والقائمة والتسعير وجودة المنتج وقراءة سلوك الزوار.',date:'2026-09-19',start:'19:30',end:'21:30',city:'جدة',venue:'مقهى الساحة',mapUrl:'',price:60,capacity:5,paymentWindowHours:6,published:true,showParticipants:true,sharePath:'events/cafe.html'},
      {id:'course',title:'دورة قراءة أرقام المطعم واتخاذ القرار',description:'دورة تطبيقية لأصحاب ومديري المنشآت لفهم أهم مؤشرات التشغيل وتحويل الأرقام إلى قرارات.',date:'2026-09-24',start:'17:00',end:'20:30',city:'جدة',venue:'قاعة الجمعية',mapUrl:'',price:180,capacity:16,paymentWindowHours:12,published:true,showParticipants:false,sharePath:'events/course.html'},
      {id:'taif',title:'رحلة الضيافة المحلية إلى الطائف',description:'زيارة يوم واحد لعدد من تجارب المطاعم والمقاهي مع لقاءات أصحاب المشاريع وتبادل الخبرات.',date:'2026-10-03',start:'08:00',end:'20:00',city:'الطائف',venue:'نقطة التجمع تعلن للمسجلين',mapUrl:'',price:220,capacity:30,paymentWindowHours:12,published:true,showParticipants:false,sharePath:'events/taif.html'},
      {id:'riyadh',title:'الرحلة الدورية لملاك القطاع، الرياض',description:'برنامج دوري يجمع الزيارات الميدانية واللقاءات المهنية والتعرف على تجارب تشغيلية مختلفة.',date:'2026-10-15',start:'09:00',end:'22:00',city:'الرياض',venue:'مواقع متعددة',mapUrl:'',price:350,capacity:35,paymentWindowHours:18,published:true,showParticipants:false,sharePath:'events/riyadh.html'},
      {id:'summer',title:'رحلة صيف الضيافة',description:'رحلة صيفية مهنية واجتماعية تشمل زيارات وتجارب ضيافة محلية ولقاءات مع أصحاب منشآت المنطقة.',date:'2027-07-08',start:'07:30',end:'21:30',city:'أبها',venue:'برنامج الرحلة يعلن لاحقًا',mapUrl:'',price:450,capacity:40,paymentWindowHours:24,published:true,showParticipants:false,sharePath:'events/summer.html'}
    ],
    registrations:[
      paid('r1','restaurant','سلمان أحمد','+966500000001','مطعم شرفة'),
      paid('r2','restaurant','خالد العتيبي','+966500000002','شركة مذاق'),
      paid('r3','restaurant','ريم الحربي','+966500000003','مطاعم المدينة'),
      paid('r4','restaurant','عبدالله الزهراني','+966500000004','بيت النكهة'),
      {id:'r5',eventId:'restaurant',name:'مشعل الغامدي',phone:'+966500000005',company:'',city:'جدة',status:'pending_payment',paymentDeadline:new Date(now+5*3600000).toISOString(),paymentUrl:'',createdAt:new Date(now-45*60000).toISOString()},
      paid('c1','cafe','فهد محمد','+966500000011','مقهى نواة'),
      paid('c2','cafe','نورة السالم','+966500000012','رشفة'),
      paid('c3','cafe','وليد الشريف','+966500000013','محامص الوادي'),
      paid('c4','cafe','أحمد باوزير','+966500000014','مقهى المدار'),
      paid('c5','cafe','سارة العمري','+966500000015','قهوة الساحة'),
      waiting('cw1','cafe','مازن الشمري','+966500000016'),
      waiting('cw2','cafe','تركي المطيري','+966500000017','مقهى بوابة','مكة','2026-09-01T11:35:00.000Z'),
      waiting('cw3','cafe','هند القحطاني','+966500000018','','جدة','2026-09-01T11:40:00.000Z'),
      paid('d1','course','عبدالله صالح','+966500000021','مطاعم واجهة','مكة','2026-09-01T12:00:00.000Z'),
      paid('d2','course','بدر العوفي','+966500000022','','جدة','2026-09-01T12:10:00.000Z')
    ]
  };

  const layout=document.createElement('link');
  layout.rel='stylesheet';layout.href='assets/overrides.css?v=5';document.head.appendChild(layout);
  if(!localStorage.getItem(MIGRATION_KEY)){localStorage.setItem(STORAGE_KEY,JSON.stringify(demoState));localStorage.setItem(MIGRATION_KEY,'1')}

  const style=document.createElement('style');
  style.textContent=`
    .eyebrow::before{display:none!important}
    .naif-footer-identity{border-right:1px solid rgba(255,255,255,.13);padding-right:18px;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:7px!important;min-width:190px!important;width:auto!important}
    .naif-footer-main{display:flex!important;align-items:center!important;gap:8px!important}.naif-footer-main img{width:84px!important;height:34px!important;object-fit:contain!important;border:0!important;border-radius:0!important;background:transparent!important;padding:0!important;box-shadow:none!important;filter:brightness(0) invert(1)!important}.naif-footer-main strong{font-size:11px!important;color:#fff!important;white-space:nowrap!important}
    .naif-footer-social{display:flex!important;flex-direction:row!important;align-items:center!important;gap:6px!important;flex-wrap:nowrap!important;width:max-content!important;max-width:100%!important}.naif-footer-social>strong{font-size:9px!important;color:#dcc681!important;margin:0 0 0 3px!important;direction:ltr!important;white-space:nowrap!important}.naif-footer-social a{flex:0 0 27px!important;width:27px!important;height:27px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:8px!important;display:grid!important;place-items:center!important;color:#fff!important;background:rgba(255,255,255,.04)!important;padding:0!important}.naif-footer-social a:hover{background:#fff!important;color:#132f32!important}.naif-footer-social svg{width:13px!important;height:13px!important;fill:currentColor!important}
    .suggestion-card-icon{width:40px!important;height:40px!important;min-width:40px!important;border-radius:12px!important;display:grid!important;place-items:center!important;background:#eef5f4!important;color:#1f4649!important;font-size:0!important}.suggestion-card-icon svg{width:21px!important;height:21px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}
    .riyal-money{display:inline-flex;align-items:center;gap:.25em;direction:ltr;white-space:nowrap}.riyal-symbol{display:inline-block;width:.72em;height:.82em;flex:0 0 .72em;background:currentColor;-webkit-mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat;mask:url('assets/saudi-riyal-symbol.svg') center/contain no-repeat}.riyal-value{font-variant-numeric:tabular-nums}
    .card-participants-preview{margin-top:13px;padding:10px 11px;border-radius:13px;background:#f7faf9;border:1px solid #e6edec;display:grid;gap:7px}.card-participants-preview>span{font-size:11px;color:#6b7b7e;font-weight:700}.card-participants-names{display:flex;flex-wrap:wrap;gap:5px}.card-participants-names b{font-size:10px;font-weight:600;background:#fff;border:1px solid #dfe7e6;border-radius:999px;padding:3px 8px;color:#35565a}.card-waitlist-note{margin-top:11px;padding:8px 10px;border-radius:11px;background:#fff5df;color:#806622;font-size:11px;font-weight:700}
    @media(max-width:760px){.naif-footer-identity{border-right:0!important;padding-right:0!important;border-top:1px solid rgba(255,255,255,.1)!important;padding-top:12px!important;min-width:0!important}.naif-footer-social{flex-wrap:nowrap!important}}
  `;
  document.head.appendChild(style);

  const naif=document.querySelector('.naif-signature');
  if(naif){
    naif.className='naif-signature naif-footer-identity';
    naif.innerHTML=`<div class="naif-footer-main"><img src="https://raw.githubusercontent.com/almohammdin/tawassu_branch/main/naif-logo-v2.png" alt="شعار نايف المحمدي"><strong>إعداد نايف المحمدي</strong></div><div class="naif-footer-social" aria-label="حسابات نايف المحمدي"><strong>Almohammdin</strong><a href="https://x.com/almohammdin" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24"><path d="M18.2 2H22l-8.3 9.5L23.5 22h-7.7l-6-7.9L2.9 22H-.9l8.9-10.2L-1.4 2h7.9l5.4 7.2L18.2 2Zm-1.3 18h2.1L5.4 3.9H3.2L16.9 20Z"/></svg></a><a href="https://www.linkedin.com/in/almohammdin/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M5.3 7.9H1.7V22h3.6V7.9ZM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2ZM22 13.9c0-4.2-2.2-6.2-5.2-6.2-2.4 0-3.5 1.3-4.1 2.2v-2H9.1V22h3.6v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H22v-8.1Z"/></svg></a><a href="https://www.snapchat.com/add/almohammdin" target="_blank" rel="noopener" aria-label="Snapchat"><svg viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg></a><a href="https://linktr.ee/almohammdin" target="_blank" rel="noopener" aria-label="Linktree"><svg viewBox="0 0 24 24"><path d="M13.736 5.852 17.644 2l1.92 1.92-3.852 3.736h5.644v2.736h-5.66l3.868 3.752-1.92 1.92-5.276-5.28-5.276 5.28-1.92-1.92 3.868-3.752H3.38V7.656h5.644L5.172 3.92 7.092 2l3.932 3.852V0h2.712v5.852ZM11.024 24v-8.604h2.712V24h-2.712Z"/></svg></a></div>`;
  }

  const suggestion=document.querySelector('.suggestion-card');
  if(suggestion){const icon=suggestion.querySelector('.suggestion-card-icon');if(icon)icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2"></rect><path d="M7 3v5M17 3v5M3.5 10h17M12 13v5M9.5 15.5h5"></path></svg>';const button=suggestion.querySelector('[data-action="suggestion"]');if(button){const link=document.createElement('a');link.className=button.className;link.href=FORM_URL;link.target='_blank';link.rel='noopener';link.textContent='اقترح مناسبة';button.replaceWith(link)}}
  document.getElementById('suggestionModal')?.remove();
  const heading=document.querySelector('.section-heading p');if(heading)heading.textContent='اختر المناسبة وسجل مقعدك مباشرة.';
  const version=document.querySelector('.footer-bottom span:last-child');if(version)version.textContent='الإصدار 0.4.1';

  const getState=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch{return demoState}};
  const getEvent=id=>(getState().events||[]).find(x=>x.id===id);
  const regsFor=id=>(getState().registrations||[]).filter(x=>x.eventId===id);
  const available=e=>Math.max(0,Number(e.capacity||0)-regsFor(e.id).filter(x=>['paid','pending_payment'].includes(x.status)).length);
  const waitCount=id=>regsFor(id).filter(x=>x.status==='waitlist').length;
  const fDate=v=>new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${v}T12:00:00`));
  const fTime=v=>{const[h,m]=String(v).split(':').map(Number);return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{hour:'numeric',minute:'2-digit'}).format(new Date(2026,0,1,h,m))};
  const fNum=v=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(v||0));
  const shareUrl=e=>e.sharePath?`${BASE_URL}${e.sharePath}`:`${BASE_URL}?event=${encodeURIComponent(e.id)}`;

  document.addEventListener('click',ev=>{const btn=ev.target.closest?.('[data-share-event],[data-admin-share]');if(!btn)return;const id=btn.getAttribute('data-share-event')||btn.getAttribute('data-admin-share');const item=getEvent(id);if(!item)return;ev.preventDefault();ev.stopImmediatePropagation();const free=available(item),wait=waitCount(item.id),seat=free>0?`المقاعد المتاحة: ${free}`:`المقاعد مكتملة${wait?` · قائمة الانتظار: ${wait}`:''}`,price=Number(item.price||0)===0?'مجاني':`${fNum(item.price)} ريال`;const text=`*${item.title}*\n\n${item.description}\n\n\uD83D\uDCC5 ${fDate(item.date)}\n\u23F0 ${fTime(item.start)} إلى ${fTime(item.end)}\n\uD83D\uDCCD ${item.venue} · ${item.city}\n\uD83D\uDCB3 ${price}\n\uD83C\uDF9F\uFE0F ${seat}\n\nالتسجيل والتفاصيل:\n${shareUrl(item)}`;window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank','noopener')},true);

  function applyRiyal(root=document.body){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!node.nodeValue||!/SAR\s+[0-9]/.test(node.nodeValue))return NodeFilter.FILTER_REJECT;const p=node.parentElement;if(!p||p.closest('script,style,.riyal-money'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}}),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const pieces=node.nodeValue.split(/(SAR\s+[0-9][0-9,]*)/g);if(pieces.length<2)return;const frag=document.createDocumentFragment();pieces.forEach(piece=>{const m=piece.match(/^SAR\s+([0-9][0-9,]*)$/);if(!m)return frag.appendChild(document.createTextNode(piece));const money=document.createElement('span');money.className='riyal-money';money.setAttribute('aria-label',`${m[1]} ريال سعودي`);money.innerHTML=`<span class="riyal-symbol" aria-hidden="true"></span><span class="riyal-value">${m[1]}</span>`;frag.appendChild(money)});node.replaceWith(frag)})}

  let decorating=false;
  function decorateCards(){if(decorating)return;decorating=true;try{const state=getState();document.querySelectorAll('#eventsGrid .event-card[data-event-card]').forEach(card=>{const id=card.getAttribute('data-event-card'),item=(state.events||[]).find(e=>e.id===id);if(!item)return;const regs=(state.registrations||[]).filter(r=>r.eventId===id),confirmed=regs.filter(r=>r.status==='paid'),wait=regs.filter(r=>r.status==='waitlist').length,actions=card.querySelector('.event-card-actions');if(!actions)return;let preview=card.querySelector('.card-participants-preview');if(item.showParticipants&&confirmed.length){const names=confirmed.slice(0,4).map(r=>`<b>${String(r.name).replace(/[&<>"']/g,'')}</b>`).join(''),html=`<span>من المشاركين المؤكدين</span><div class="card-participants-names">${names}${confirmed.length>4?`<b>+${confirmed.length-4}</b>`:''}</div>`;if(!preview){preview=document.createElement('div');preview.className='card-participants-preview';actions.before(preview)}if(preview.innerHTML!==html)preview.innerHTML=html}else if(preview)preview.remove();let note=card.querySelector('.card-waitlist-note');if(available(item)===0&&wait){const text=`اكتملت المقاعد · ${wait} في قائمة الانتظار`;if(!note){note=document.createElement('div');note.className='card-waitlist-note';actions.before(note)}if(note.textContent!==text)note.textContent=text}else if(note)note.remove()})}finally{setTimeout(()=>{decorating=false},0)}}

  applyRiyal();
  const observer=new MutationObserver(records=>{records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)applyRiyal(node.parentElement);if(node.nodeType===Node.ELEMENT_NODE)applyRiyal(node)}));if(document.querySelector('#eventsGrid .event-card'))decorateCards()});
  observer.observe(document.body,{childList:true,subtree:true});

  const script=document.createElement('script');script.src='assets/app-v2.js?v=5';script.defer=true;script.onload=()=>setTimeout(()=>{applyRiyal();decorateCards();if(!document.querySelector('#eventsGrid .event-card')&&!sessionStorage.getItem('rcoa_demo_reload_v5')){sessionStorage.setItem('rcoa_demo_reload_v5','1');localStorage.setItem(STORAGE_KEY,JSON.stringify(demoState));location.reload()}},180);document.body.appendChild(script);
})();
