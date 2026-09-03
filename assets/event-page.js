(() => {
  'use strict';
  const STORAGE_KEY='rcoa_events_state_v2';
  const dataEl=document.getElementById('eventData');
  if(!dataEl)return;
  const fallback=JSON.parse(dataEl.textContent);
  const eventId=fallback.event.id;
  const $=(s,r=document)=>r.querySelector(s);
  const normalizePhone=(v='')=>{let n=String(v).replace(/\D/g,'');if(n.startsWith('00966'))n=n.slice(2);if(n.startsWith('966'))return `+${n}`;if(n.startsWith('05'))return `+966${n.slice(1)}`;if(n.startsWith('5')&&n.length===9)return `+966${n}`;return n?`+${n}`:''};
  const fmtDate=v=>new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(`${v}T12:00:00`));
  const fmtTime=v=>{const[h,m]=v.split(':').map(Number);return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{hour:'numeric',minute:'2-digit'}).format(new Date(2026,0,1,h,m))};
  const fmtNum=v=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(v||0));
  const uid=()=>`reg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`;
  function load(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const state=JSON.parse(raw);state.events=Array.isArray(state.events)?state.events:[];state.registrations=Array.isArray(state.registrations)?state.registrations:[];if(!state.events.some(e=>e.id===eventId))state.events.push(fallback.event);return state}}catch{}return {events:[fallback.event],registrations:[...(fallback.registrations||[])]}}
  function save(state){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  function current(){const state=load();return {state,event:state.events.find(e=>e.id===eventId)||fallback.event,regs:state.registrations.filter(r=>r.eventId===eventId)}}
  function active(regs){return regs.filter(r=>['paid','pending_payment'].includes(r.status))}
  function available(event,regs){return Math.max(0,Number(event.capacity||0)-active(regs).length)}
  function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2500)}
  function render(){const {event,regs}=current();const left=available(event,regs);const paid=regs.filter(r=>r.status==='paid');const wait=regs.filter(r=>r.status==='waitlist');
    $('#eventTitle').textContent=event.title;$('#eventDescription').textContent=event.description;$('#eventDate').textContent=fmtDate(event.date);$('#eventTime').textContent=`${fmtTime(event.start)} إلى ${fmtTime(event.end)}`;$('#eventVenue').textContent=event.venue;$('#eventCity').textContent=event.city;
    const price=$('#eventPrice');price.innerHTML=Number(event.price||0)===0?'مجاني':`<span class="riyal" aria-hidden="true"></span><span>${fmtNum(event.price)}</span>`;
    $('#seatTitle').textContent=left>0?`متبقي ${left} مقعد`:'اكتملت المقاعد';$('#seatText').textContent=left>0?`من أصل ${event.capacity} مقعد. التسجيل يحجز المقعد مؤقتًا حتى السداد.`:`يمكنك الانضمام إلى قائمة الانتظار، وسيتم ترقية أول منتظر عند توفر مقعد.`;
    const waitEl=$('#waitNote');waitEl.textContent=wait.length?`${wait.length} في قائمة الانتظار`:'';waitEl.hidden=!wait.length;
    $('#registerBtn').textContent=left>0?'سجل مقعدك':'انضم لقائمة الانتظار';
    const part=$('#participantsSection'),grid=$('#participantsGrid');if(event.showParticipants&&paid.length){part.hidden=false;grid.innerHTML=paid.map(r=>`<span class="participant">${String(r.name).replace(/[&<>"']/g,'')}</span>`).join('')}else{part.hidden=true;grid.innerHTML=''}
  }
  $('#registerBtn')?.addEventListener('click',()=>document.getElementById('registration').scrollIntoView({behavior:'smooth',block:'start'}));
  $('#shareBtn')?.addEventListener('click',()=>{const {event,regs}=current();const left=available(event,regs),wait=regs.filter(r=>r.status==='waitlist').length;const seats=left?`المقاعد المتاحة: ${left}`:`المقاعد مكتملة${wait?` · قائمة الانتظار: ${wait}`:''}`;const price=Number(event.price||0)===0?'مجاني':`${fmtNum(event.price)} ريال`;const text=`*${event.title}*\n\n${event.description}\n\n\uD83D\uDCC5 ${fmtDate(event.date)}\n\u23F0 ${fmtTime(event.start)} إلى ${fmtTime(event.end)}\n\uD83D\uDCCD ${event.venue} · ${event.city}\n\uD83D\uDCB3 ${price}\n\uD83C\uDF9F\uFE0F ${seats}\n\nالتسجيل والتفاصيل:\n${location.href}`;window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank','noopener')});
  $('#registrationForm')?.addEventListener('submit',e=>{e.preventDefault();const state=load(),event=state.events.find(x=>x.id===eventId)||fallback.event,phone=normalizePhone($('#regPhone').value),regs=state.registrations.filter(r=>r.eventId===eventId);if(!/^\+9665\d{8}$/.test(phone)){toast('تحقق من رقم الجوال');return}const existing=regs.find(r=>normalizePhone(r.phone)===phone&&['paid','pending_payment','waitlist'].includes(r.status));if(existing){toast('لديك تسجيل قائم لهذه المناسبة');return}const hasSeat=available(event,regs)>0,isFree=Number(event.price||0)===0,status=hasSeat?(isFree?'paid':'pending_payment'):'waitlist';state.registrations.push({id:uid(),eventId,name:$('#regName').value.trim(),phone,company:$('#regCompany').value.trim(),city:$('#regCity').value.trim(),status,paymentDeadline:status==='pending_payment'?new Date(Date.now()+Number(event.paymentWindowHours||6)*3600000).toISOString():null,paymentUrl:'',createdAt:new Date().toISOString()});save(state);e.target.reset();render();const box=$('#statusMessage');box.className=`status-message show ${status==='waitlist'?'warning':'success'}`;box.textContent=status==='waitlist'?'تم تسجيلك في قائمة الانتظار.':'تم حجز مقعدك. سترسل الإدارة رابط MyFatoorah لإكمال السداد خلال المهلة المحددة.';toast(status==='waitlist'?'تم تسجيلك في قائمة الانتظار':'تم حجز مقعدك')});
  render();
})();