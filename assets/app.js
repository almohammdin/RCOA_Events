(() => {
  'use strict';

  const STORAGE_KEY = 'rcoa_events_state';
  const ADMIN_PIN = '2026';
  const BASE_URL = 'https://almohammdin.github.io/RCOA_Events/';

  const seedState = {
    events: [
      {
        id: 'evt_demo',
        title: 'لقاء مجتمع الضيافة — نموذج تجريبي',
        description: 'لقاء تجريبي لاختبار تجربة التسجيل والسداد وقائمة الانتظار قبل إطلاق الفعاليات الفعلية للجمعية.',
        date: '2026-09-10',
        start: '19:30',
        end: '22:00',
        city: 'جدة',
        venue: 'موقع اللقاء يحدد لاحقًا',
        mapUrl: '',
        price: 75,
        capacity: 60,
        paymentWindowHours: 6,
        published: true,
        showParticipants: false,
        sharePath: 'events/demo.html',
        createdAt: new Date().toISOString()
      }
    ],
    registrations: []
  };

  let state = loadState();
  let activeAdminTab = 'events';
  let toastTimer;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return structuredClone(seedState);
      const parsed = JSON.parse(saved);
      return {
        events: Array.isArray(parsed.events) ? parsed.events : structuredClone(seedState.events),
        registrations: Array.isArray(parsed.registrations) ? parsed.registrations : []
      };
    } catch {
      return structuredClone(seedState);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function normalizePhone(value = '') {
    let v = String(value).replace(/\D/g, '');
    if (v.startsWith('00966')) v = v.slice(2);
    if (v.startsWith('966')) return `+${v}`;
    if (v.startsWith('05')) return `+966${v.slice(1)}`;
    if (v.startsWith('5') && v.length === 9) return `+966${v}`;
    return v ? `+${v}` : '';
  }

  function whatsappPhone(value = '') {
    return normalizePhone(value).replace('+', '');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(`${dateStr}T12:00:00`);
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(`${dateStr}T12:00:00`);
    return new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(d);
  }

  function formatTime(time) {
    if (!time) return '—';
    const [h, m] = time.split(':').map(Number);
    const d = new Date(2026, 0, 1, h, m);
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { hour: 'numeric', minute: '2-digit' }).format(d);
  }

  function formatMoney(value) {
    return Number(value || 0) === 0 ? 'مجاني' : `SAR ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value))}`;
  }

  function eventById(id) {
    return state.events.find(event => event.id === id);
  }

  function registrationsFor(eventId) {
    return state.registrations.filter(reg => reg.eventId === eventId);
  }

  function activeSeatRegistrations(eventId) {
    return registrationsFor(eventId).filter(reg => ['pending_payment', 'paid'].includes(reg.status));
  }

  function availableSeats(event) {
    return Math.max(0, Number(event.capacity) - activeSeatRegistrations(event.id).length);
  }

  function waitlistCount(eventId) {
    return registrationsFor(eventId).filter(reg => reg.status === 'waitlist').length;
  }

  function statusInfo(status) {
    return {
      pending_payment: ['بانتظار السداد', 'warning'],
      paid: ['مؤكد', 'success'],
      waitlist: ['قائمة الانتظار', 'gold'],
      expired: ['انتهت مهلة السداد', 'danger'],
      cancelled: ['ملغي', 'muted']
    }[status] || [status, 'muted'];
  }

  function createDeadline(hours) {
    return new Date(Date.now() + Number(hours || 6) * 3600000).toISOString();
  }

  function deadlineText(iso) {
    if (!iso) return '';
    const ms = new Date(iso).getTime() - Date.now();
    if (ms <= 0) return 'انتهت المهلة';
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    return hours > 0 ? `متبقي ${hours} س ${mins} د` : `متبقي ${mins} دقيقة`;
  }

  function promoteWaitlist(eventId) {
    const event = eventById(eventId);
    if (!event || availableSeats(event) < 1) return null;
    const next = registrationsFor(eventId)
      .filter(reg => reg.status === 'waitlist')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
    if (!next) return null;
    next.status = Number(event.price) > 0 ? 'pending_payment' : 'paid';
    next.paymentDeadline = Number(event.price) > 0 ? createDeadline(event.paymentWindowHours) : null;
    next.promotedAt = new Date().toISOString();
    return next;
  }

  function processExpirations() {
    let changed = false;
    const now = Date.now();
    state.registrations.forEach(reg => {
      if (reg.status === 'pending_payment' && reg.paymentDeadline && new Date(reg.paymentDeadline).getTime() <= now) {
        reg.status = 'expired';
        reg.expiredAt = new Date().toISOString();
        changed = true;
      }
    });
    if (changed) {
      state.events.forEach(event => {
        while (availableSeats(event) > 0 && registrationsFor(event.id).some(reg => reg.status === 'waitlist')) {
          if (!promoteWaitlist(event.id)) break;
        }
      });
      saveState();
    }
    return changed;
  }

  function showToast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal(modal) {
    const el = typeof modal === 'string' ? document.getElementById(modal) : modal;
    if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.open')) document.body.classList.remove('modal-open');
  }

  function eventIcon(type) {
    const icons = {
      calendar: '<svg viewBox="0 0 24 24"><path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2Zm11 8H6v10h12V10ZM6 6v2h12V6H6Z"/></svg>',
      pin: '<svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>',
      clock: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z"/></svg>'
    };
    return icons[type] || '';
  }

  function shareUrlFor(event) {
    if (event.sharePath) return `${BASE_URL}${event.sharePath}`;
    return `${BASE_URL}?event=${encodeURIComponent(event.id)}`;
  }

  function shareText(event) {
    const price = formatMoney(event.price);
    const seats = availableSeats(event);
    return `*${event.title}*\n\n${event.description}\n\n📅 ${formatDate(event.date)}\n⏰ ${formatTime(event.start)} – ${formatTime(event.end)}\n📍 ${event.venue} - ${event.city}\n💳 ${price}\n🎟️ المقاعد المتاحة: ${seats}\n\nالتسجيل والتفاصيل:\n${shareUrlFor(event)}`;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('تم نسخ الرابط');
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      showToast('تم نسخ الرابط');
    }
  }

  function renderEvents() {
    processExpirations();
    const grid = $('#eventsGrid');
    const published = state.events
      .filter(event => event.published)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
    $('#eventsEmpty').hidden = published.length > 0;
    grid.innerHTML = published.map(event => {
      const available = availableSeats(event);
      const capacity = Number(event.capacity || 1);
      const usedPct = Math.min(100, Math.round(((capacity - available) / capacity) * 100));
      const full = available === 0;
      return `
        <article class="event-card">
          <div class="event-accent"></div>
          <div class="event-body">
            <div class="event-meta-row">
              <span class="badge ${full ? 'gold' : ''}">${full ? 'التسجيل انتظار' : 'التسجيل متاح'}</span>
              <span class="event-price">${escapeHtml(formatMoney(event.price))}</span>
            </div>
            <h3>${escapeHtml(event.title)}</h3>
            <p>${escapeHtml(event.description)}</p>
            <div class="event-facts">
              <div class="event-fact">${eventIcon('calendar')}<span>${escapeHtml(formatDateShort(event.date))}</span></div>
              <div class="event-fact">${eventIcon('clock')}<span>${escapeHtml(formatTime(event.start))} – ${escapeHtml(formatTime(event.end))}</span></div>
              <div class="event-fact">${eventIcon('pin')}<span>${escapeHtml(event.venue)} · ${escapeHtml(event.city)}</span></div>
            </div>
            <div class="seats-note"><span>${available} من ${capacity} مقعد متاح</span><div class="progress"><span style="width:${usedPct}%"></span></div></div>
            <div class="event-card-actions">
              <button class="btn btn-dark" data-event-details="${escapeHtml(event.id)}">التفاصيل والتسجيل</button>
              <button class="share-btn" data-share-event="${escapeHtml(event.id)}" aria-label="مشاركة الرابط" title="مشاركة الرابط"><svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.35a3.1 3.1 0 0 0 0-1.7L15.6 8.8A3 3 0 1 0 15 7a3 3 0 0 0 .08.67l-6.7 3.35a3 3 0 1 0 0 3.96l6.7 3.35A3 3 0 1 0 18 16Z"/></svg></button>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  function showEventDetails(eventId) {
    const event = eventById(eventId);
    if (!event) return;
    const available = availableSeats(event);
    const confirmed = registrationsFor(event.id).filter(reg => reg.status === 'paid');
    const wait = waitlistCount(event.id);
    const publicParticipants = event.showParticipants && confirmed.length
      ? `<section class="participant-list"><h3>المشاركون المؤكدون</h3><div class="participant-chips">${confirmed.map(reg => `<span class="participant-chip">${escapeHtml(reg.name)}</span>`).join('')}</div></section>`
      : '';
    $('#eventModalBody').innerHTML = `
      <div class="event-detail-grid">
        <div class="event-detail-main">
          <span class="eyebrow">${available > 0 ? 'التسجيل متاح' : 'قائمة الانتظار متاحة'}</span>
          <h2 id="eventModalTitle">${escapeHtml(event.title)}</h2>
          <p>${escapeHtml(event.description)}</p>
          <div class="detail-facts">
            <div class="detail-fact"><span>التاريخ</span><strong>${escapeHtml(formatDate(event.date))}</strong></div>
            <div class="detail-fact"><span>الوقت</span><strong>${escapeHtml(formatTime(event.start))} – ${escapeHtml(formatTime(event.end))}</strong></div>
            <div class="detail-fact"><span>المكان</span><strong>${escapeHtml(event.venue)}</strong></div>
            <div class="detail-fact"><span>المدينة</span><strong>${escapeHtml(event.city)}</strong></div>
          </div>
          ${event.mapUrl ? `<a class="btn btn-secondary compact" href="${escapeHtml(event.mapUrl)}" target="_blank" rel="noopener">فتح الموقع</a>` : ''}
          ${publicParticipants}
        </div>
        <aside class="event-detail-side">
          <span class="price-label">رسوم المشاركة</span>
          <div class="big-price">${escapeHtml(formatMoney(event.price))}</div>
          <p>${available > 0 ? `متبقي ${available} من أصل ${event.capacity} مقعد.` : `اكتملت المقاعد. سيتم تسجيلك في قائمة الانتظار، وعدد المنتظرين حاليًا ${wait}.`}</p>
          <button class="btn btn-primary full" data-register-event="${escapeHtml(event.id)}">${available > 0 ? 'سجل مقعدك' : 'انضم لقائمة الانتظار'}</button>
          <button class="btn btn-secondary full" style="margin-top:8px" data-share-event="${escapeHtml(event.id)}">مشاركة اللقاء</button>
        </aside>
      </div>`;
    openModal('eventModal');
  }

  function openRegistration(eventId) {
    const event = eventById(eventId);
    if (!event) return;
    $('#registrationEventId').value = event.id;
    $('#registrationEventName').textContent = `${event.title} · ${formatDateShort(event.date)}`;
    $('#registrationForm').reset();
    $('#registrationEventId').value = event.id;
    closeModal('eventModal');
    openModal('registrationModal');
  }

  function registerUser(form) {
    processExpirations();
    const event = eventById($('#registrationEventId').value);
    if (!event) return;
    const phone = normalizePhone($('#regPhone').value);
    if (!/^\+9665\d{8}$/.test(phone) && phone.length < 8) {
      showToast('تحقق من رقم الجوال');
      return;
    }
    const existing = state.registrations.find(reg => reg.eventId === event.id && normalizePhone(reg.phone) === phone && ['pending_payment', 'paid', 'waitlist'].includes(reg.status));
    if (existing) {
      showToast('لديك تسجيل قائم لهذه الفعالية');
      return;
    }
    const hasSeat = availableSeats(event) > 0;
    const isFree = Number(event.price) === 0;
    const status = hasSeat ? (isFree ? 'paid' : 'pending_payment') : 'waitlist';
    const reg = {
      id: uid('reg'), eventId: event.id,
      name: $('#regName').value.trim(), phone,
      company: $('#regCompany').value.trim(), city: $('#regCity').value.trim(),
      status,
      paymentDeadline: status === 'pending_payment' ? createDeadline(event.paymentWindowHours) : null,
      paymentUrl: '', invoiceId: '',
      createdAt: new Date().toISOString()
    };
    state.registrations.push(reg);
    saveState();
    renderEvents();
    closeModal('registrationModal');
    const msg = status === 'waitlist'
      ? 'تم تسجيلك في قائمة الانتظار'
      : status === 'paid' ? 'تم تأكيد مقعدك' : `تم حجز مقعدك مؤقتًا لمدة ${event.paymentWindowHours} ساعات`;
    showToast(msg);
    setTimeout(() => {
      $('#managePhone').value = phone.replace('+966', '0');
      renderManageResults(phone);
      openModal('manageModal');
    }, 250);
  }

  function renderManageResults(phoneInput) {
    processExpirations();
    const phone = normalizePhone(phoneInput);
    const results = state.registrations
      .filter(reg => normalizePhone(reg.phone) === phone)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const root = $('#manageResults');
    if (!results.length) {
      root.innerHTML = '<div class="empty-state"><strong>لا توجد تسجيلات بهذا الرقم</strong><span>تحقق من الرقم أو سجل في إحدى الفعاليات.</span></div>';
      return;
    }
    root.innerHTML = results.map(reg => {
      const event = eventById(reg.eventId);
      if (!event) return '';
      const [label, cls] = statusInfo(reg.status);
      const canCancel = ['pending_payment', 'paid', 'waitlist'].includes(reg.status);
      const canRejoin = ['expired', 'cancelled'].includes(reg.status);
      const payment = reg.status === 'pending_payment'
        ? `<div class="payment-box">${reg.paymentUrl ? `رابط السداد جاهز: <a href="${escapeHtml(reg.paymentUrl)}" target="_blank" rel="noopener">فتح MyFatoorah</a>` : 'رابط السداد لم يرسل بعد. ستقوم الإدارة بإرساله لك.'}</div>` : '';
      return `<article class="registration-item">
        <div class="registration-item-head"><div><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(formatDateShort(event.date))} · ${escapeHtml(event.city)}</p></div><span class="badge ${cls}">${label}</span></div>
        ${reg.status === 'pending_payment' ? `<span class="deadline">${escapeHtml(deadlineText(reg.paymentDeadline))}</span>` : ''}
        ${payment}
        <div class="registration-actions">
          ${canCancel ? `<button class="btn btn-danger" data-cancel-registration="${escapeHtml(reg.id)}">إلغاء تسجيلي</button>` : ''}
          ${canRejoin ? `<button class="btn btn-secondary" data-rejoin-registration="${escapeHtml(reg.id)}">إعادة التسجيل</button>` : ''}
          <button class="btn btn-ghost" data-event-details="${escapeHtml(event.id)}">تفاصيل اللقاء</button>
        </div>
      </article>`;
    }).join('');
  }

  function cancelRegistration(regId) {
    const reg = state.registrations.find(item => item.id === regId);
    if (!reg || !['pending_payment', 'paid', 'waitlist'].includes(reg.status)) return;
    const freedSeat = ['pending_payment', 'paid'].includes(reg.status);
    reg.status = 'cancelled';
    reg.cancelledAt = new Date().toISOString();
    if (freedSeat) promoteWaitlist(reg.eventId);
    saveState();
    renderEvents();
    renderManageResults(reg.phone);
    showToast('تم إلغاء تسجيلك');
  }

  function rejoinRegistration(regId) {
    processExpirations();
    const old = state.registrations.find(item => item.id === regId);
    const event = old && eventById(old.eventId);
    if (!old || !event || !['expired', 'cancelled'].includes(old.status)) return;
    const active = state.registrations.find(reg => reg.eventId === event.id && normalizePhone(reg.phone) === normalizePhone(old.phone) && ['pending_payment', 'paid', 'waitlist'].includes(reg.status));
    if (active) return showToast('لديك تسجيل قائم بالفعل');
    const hasSeat = availableSeats(event) > 0;
    const isFree = Number(event.price) === 0;
    const status = hasSeat ? (isFree ? 'paid' : 'pending_payment') : 'waitlist';
    state.registrations.push({
      ...old, id: uid('reg'), status,
      paymentDeadline: status === 'pending_payment' ? createDeadline(event.paymentWindowHours) : null,
      paymentUrl: '', invoiceId: '', createdAt: new Date().toISOString(), cancelledAt: null, expiredAt: null
    });
    saveState();
    renderEvents();
    renderManageResults(old.phone);
    showToast(status === 'waitlist' ? 'أعدنا تسجيلك في قائمة الانتظار' : 'تم إعادة حجز مقعدك');
  }

  function renderAdminStats() {
    processExpirations();
    const paid = state.registrations.filter(reg => reg.status === 'paid');
    const pending = state.registrations.filter(reg => reg.status === 'pending_payment').length;
    const wait = state.registrations.filter(reg => reg.status === 'waitlist').length;
    const revenue = paid.reduce((sum, reg) => sum + Number(eventById(reg.eventId)?.price || 0), 0);
    $('#adminStats').innerHTML = `
      <div class="stat"><span>المؤكدون</span><strong>${paid.length}</strong></div>
      <div class="stat"><span>بانتظار السداد</span><strong>${pending}</strong></div>
      <div class="stat"><span>قائمة الانتظار</span><strong>${wait}</strong></div>
      <div class="stat"><span>الإيراد المؤكد</span><strong>${escapeHtml(formatMoney(revenue))}</strong></div>`;
  }

  function renderAdmin() {
    processExpirations();
    renderAdminStats();
    $$('.admin-tabs button').forEach(btn => btn.classList.toggle('active', btn.dataset.adminTab === activeAdminTab));
    if (activeAdminTab === 'events') renderAdminEvents();
    else if (activeAdminTab === 'registrations') renderAdminRegistrations();
    else renderIntegration();
  }

  function renderAdminEvents() {
    const root = $('#adminContent');
    const items = [...state.events].sort((a, b) => String(a.date).localeCompare(String(b.date)));
    root.innerHTML = `<div class="admin-list">${items.map(event => `
      <article class="admin-event">
        <div><div style="display:flex;gap:7px;align-items:center;margin-bottom:6px"><span class="badge ${event.published ? 'success' : 'muted'}">${event.published ? 'منشور' : 'مخفي'}</span><span class="badge ${event.showParticipants ? 'gold' : 'muted'}">${event.showParticipants ? 'الأسماء ظاهرة' : 'الأسماء مخفية'}</span></div><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(formatDateShort(event.date))} · ${escapeHtml(event.venue)} · ${activeSeatRegistrations(event.id).length}/${event.capacity} مقعد</p></div>
        <div class="admin-event-actions">
          <button class="btn btn-secondary" data-admin-share="${escapeHtml(event.id)}">نشر الرابط</button>
          <button class="btn btn-ghost" data-edit-event="${escapeHtml(event.id)}">تعديل</button>
          <button class="btn btn-ghost" data-toggle-publish="${escapeHtml(event.id)}">${event.published ? 'إخفاء' : 'نشر'}</button>
          <button class="btn btn-danger" data-delete-event="${escapeHtml(event.id)}">حذف</button>
        </div>
      </article>`).join('')}</div>`;
  }

  function renderAdminRegistrations() {
    const root = $('#adminContent');
    const regs = [...state.registrations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!regs.length) {
      root.innerHTML = '<div class="empty-state"><strong>لا يوجد مسجلون بعد</strong><span>ستظهر التسجيلات هنا.</span></div>';
      return;
    }
    root.innerHTML = `<div class="table-wrap"><table><thead><tr><th>الاسم</th><th>الفعالية</th><th>الجوال</th><th>الحالة</th><th>السداد</th><th>إجراء</th></tr></thead><tbody>${regs.map(reg => {
      const event = eventById(reg.eventId);
      const [label, cls] = statusInfo(reg.status);
      return `<tr><td><strong>${escapeHtml(reg.name)}</strong><br><small>${escapeHtml(reg.company || '')}</small></td><td>${escapeHtml(event?.title || 'فعالية محذوفة')}</td><td dir="ltr">${escapeHtml(reg.phone)}</td><td><span class="badge ${cls}">${label}</span>${reg.status === 'pending_payment' ? `<br><small>${escapeHtml(deadlineText(reg.paymentDeadline))}</small>` : ''}</td><td>${reg.paymentUrl ? '<span class="badge success">الرابط جاهز</span>' : '<span class="badge muted">لا يوجد رابط</span>'}</td><td><div class="table-actions">${reg.status === 'pending_payment' ? `<button class="mini-btn" data-set-payment="${escapeHtml(reg.id)}">رابط السداد</button><button class="mini-btn" data-send-payment="${escapeHtml(reg.id)}">إرسال</button><button class="mini-btn" data-remind-payment="${escapeHtml(reg.id)}">تذكير</button><button class="mini-btn primary" data-mark-paid="${escapeHtml(reg.id)}">تم السداد</button>` : ''}</div></td></tr>`;
    }).join('')}</tbody></table></div>`;
  }

  function renderIntegration() {
    $('#adminContent').innerHTML = `
      <div class="integration-note"><b>1</b><div><strong>العمل الآن</strong><p>بعد تسجيل الشخص، تضيف الإدارة رابط MyFatoorah إلى سجله ثم تضغط «إرسال». تفتح رسالة WhatsApp جاهزة باسم المسجل والفعالية والرابط.</p></div></div>
      <div class="integration-note"><b>2</b><div><strong>بعد الربط الحقيقي</strong><p>Backend آمن ينشئ فاتورة MyFatoorah لكل تسجيل ويحفظ InvoiceId. عند الدفع يصل Webhook ويحوّل الحالة إلى «مؤكد» تلقائيًا بعد التحقق من Get Payment Details.</p></div></div>
      <div class="integration-note"><b>3</b><div><strong>المهلة وقائمة الانتظار</strong><p>النسخة الحالية تطبق انتهاء المهلة عندما تكون الصفحة مفتوحة. في الإنتاج سيعمل Job مجدول حتى لو لم يفتح أحد الموقع، ويحرر المقعد ويصعد أول منتظر ويرسل الرسائل آليًا.</p></div></div>
      <div class="integration-note"><b>4</b><div><strong>معاينة WhatsApp</strong><p>صفحة الحدث التجريبي لها Open Graph مستقل، لذلك يظهر العنوان والتاريخ والوقت والمكان والسعر في المعاينة. الفعاليات التي تنشأ من لوحة المتصفح تحتاج Backend أو عملية نشر تولد صفحة مشاركة ثابتة لكل حدث حتى تحصل على المعاينة نفسها.</p></div></div>`;
  }

  function openEventEditor(eventId = '') {
    const event = eventId ? eventById(eventId) : null;
    $('#editorTitle').textContent = event ? 'تعديل الفعالية' : 'إضافة فعالية';
    $('#eventEditorForm').reset();
    $('#editEventId').value = event?.id || '';
    $('#editTitle').value = event?.title || '';
    $('#editDescription').value = event?.description || '';
    $('#editDate').value = event?.date || '';
    $('#editStart').value = event?.start || '19:00';
    $('#editEnd').value = event?.end || '21:00';
    $('#editCity').value = event?.city || 'جدة';
    $('#editVenue').value = event?.venue || '';
    $('#editMap').value = event?.mapUrl || '';
    $('#editPrice').value = event?.price ?? 0;
    $('#editCapacity').value = event?.capacity ?? 50;
    $('#editPaymentHours').value = event?.paymentWindowHours ?? 6;
    $('#editPublished').checked = event ? Boolean(event.published) : true;
    $('#editShowParticipants').checked = event ? Boolean(event.showParticipants) : false;
    openModal('eventEditorModal');
  }

  function saveEventFromEditor() {
    const id = $('#editEventId').value;
    const existing = id ? eventById(id) : null;
    const data = {
      id: existing?.id || uid('evt'),
      title: $('#editTitle').value.trim(), description: $('#editDescription').value.trim(),
      date: $('#editDate').value, start: $('#editStart').value, end: $('#editEnd').value,
      city: $('#editCity').value.trim(), venue: $('#editVenue').value.trim(), mapUrl: $('#editMap').value.trim(),
      price: Number($('#editPrice').value || 0), capacity: Number($('#editCapacity').value || 1),
      paymentWindowHours: Number($('#editPaymentHours').value || 6),
      published: $('#editPublished').checked, showParticipants: $('#editShowParticipants').checked,
      sharePath: existing?.sharePath || '', createdAt: existing?.createdAt || new Date().toISOString()
    };
    if (existing) Object.assign(existing, data); else state.events.push(data);
    saveState();
    renderEvents();
    renderAdmin();
    closeModal('eventEditorModal');
    showToast(existing ? 'تم تحديث الفعالية' : 'تمت إضافة الفعالية');
  }

  function setPaymentLink(regId) {
    const reg = state.registrations.find(item => item.id === regId);
    if (!reg) return;
    const value = prompt('الصق رابط MyFatoorah لهذا المسجل:', reg.paymentUrl || 'https://');
    if (value === null) return;
    const url = value.trim();
    if (url && !/^https?:\/\//i.test(url)) return showToast('الرابط غير صحيح');
    reg.paymentUrl = url;
    saveState(); renderAdmin(); showToast('تم حفظ رابط السداد');
  }

  function openPaymentWhatsapp(regId, isReminder = false) {
    const reg = state.registrations.find(item => item.id === regId);
    const event = reg && eventById(reg.eventId);
    if (!reg || !event) return;
    if (!reg.paymentUrl) return showToast('أضف رابط MyFatoorah أولًا');
    const intro = isReminder ? 'تذكير بإكمال السداد' : 'تم تسجيلك بنجاح';
    const text = `${intro}\n\nالأخ/الأخت ${reg.name}\nفعالية: ${event.title}\n${formatDate(event.date)}\n\nرابط السداد عبر MyFatoorah:\n${reg.paymentUrl}\n\n${reg.paymentDeadline ? `مهلة السداد: ${deadlineText(reg.paymentDeadline)}` : ''}\n\nجمعية ملاك المطاعم والمقاهي`;
    window.open(`https://wa.me/${whatsappPhone(reg.phone)}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  function markPaid(regId) {
    const reg = state.registrations.find(item => item.id === regId);
    if (!reg || reg.status !== 'pending_payment') return;
    reg.status = 'paid'; reg.paidAt = new Date().toISOString(); reg.paymentDeadline = null;
    saveState(); renderEvents(); renderAdmin(); showToast('تم تأكيد السداد');
  }

  function adminShare(eventId) {
    const event = eventById(eventId);
    if (!event) return;
    const text = shareText(event);
    copyText(shareUrlFor(event));
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  function handleClick(event) {
    const target = event.target.closest('button,a');
    if (!target) return;
    if (target.matches('[data-close]')) return closeModal(target.closest('.modal'));
    const action = target.dataset.action;
    if (action === 'manage-registration') openModal('manageModal');
    if (action === 'suggestion') openModal('suggestionModal');
    if (action === 'admin-login') openModal('adminLoginModal');

    if (target.dataset.eventDetails) showEventDetails(target.dataset.eventDetails);
    if (target.dataset.registerEvent) openRegistration(target.dataset.registerEvent);
    if (target.dataset.shareEvent) {
      const ev = eventById(target.dataset.shareEvent);
      if (ev) {
        if (navigator.share) navigator.share({ title: ev.title, text: shareText(ev), url: shareUrlFor(ev) }).catch(() => {});
        else copyText(shareUrlFor(ev));
      }
    }
    if (target.dataset.cancelRegistration) cancelRegistration(target.dataset.cancelRegistration);
    if (target.dataset.rejoinRegistration) rejoinRegistration(target.dataset.rejoinRegistration);
    if (target.dataset.adminTab) { activeAdminTab = target.dataset.adminTab; renderAdmin(); }
    if (target.id === 'newEventBtn') openEventEditor();
    if (target.dataset.editEvent) openEventEditor(target.dataset.editEvent);
    if (target.dataset.adminShare) adminShare(target.dataset.adminShare);
    if (target.dataset.togglePublish) {
      const ev = eventById(target.dataset.togglePublish); if (!ev) return;
      ev.published = !ev.published; saveState(); renderEvents(); renderAdmin(); showToast(ev.published ? 'تم نشر الفعالية' : 'تم إخفاء الفعالية');
    }
    if (target.dataset.deleteEvent) {
      const ev = eventById(target.dataset.deleteEvent); if (!ev) return;
      if (registrationsFor(ev.id).length) return showToast('لا يمكن حذف فعالية لديها تسجيلات؛ أخفها بدلًا من ذلك');
      if (!confirm(`حذف فعالية «${ev.title}»؟`)) return;
      state.events = state.events.filter(item => item.id !== ev.id); saveState(); renderEvents(); renderAdmin(); showToast('تم حذف الفعالية');
    }
    if (target.dataset.setPayment) setPaymentLink(target.dataset.setPayment);
    if (target.dataset.sendPayment) openPaymentWhatsapp(target.dataset.sendPayment, false);
    if (target.dataset.remindPayment) openPaymentWhatsapp(target.dataset.remindPayment, true);
    if (target.dataset.markPaid) markPaid(target.dataset.markPaid);
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') $$('.modal.open').forEach(closeModal);
  });

  $('#registrationForm').addEventListener('submit', e => { e.preventDefault(); registerUser(e.currentTarget); });
  $('#manageSearchForm').addEventListener('submit', e => { e.preventDefault(); renderManageResults($('#managePhone').value); });
  $('#adminLoginForm').addEventListener('submit', e => {
    e.preventDefault();
    if ($('#adminPin').value !== ADMIN_PIN) return showToast('رمز الدخول غير صحيح');
    $('#adminPin').value = '';
    closeModal('adminLoginModal');
    renderAdmin();
    openModal('adminModal');
  });
  $('#eventEditorForm').addEventListener('submit', e => { e.preventDefault(); saveEventFromEditor(); });

  renderEvents();
  setInterval(() => {
    const changed = processExpirations();
    if (changed) { renderEvents(); if ($('#adminModal').classList.contains('open')) renderAdmin(); }
    const phone = $('#managePhone').value;
    if ($('#manageModal').classList.contains('open') && phone) renderManageResults(phone);
  }, 60000);

  const params = new URLSearchParams(location.search);
  const requestedEvent = params.get('event') || location.hash.replace(/^#event=/, '');
  if (requestedEvent && eventById(requestedEvent)?.published) setTimeout(() => showEventDetails(requestedEvent), 120);
})();
