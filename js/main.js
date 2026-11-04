// 화면 동작 스크립트 — 내용은 js/config.js 에서 수정하세요.
(() => {
 'use strict';
 const C = window.SITE_CONFIG, photos = window.SITE_PHOTOS || [];
 const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);
 const make = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
 const byPath = p => photos.find(x => x.path === p);
 const thumb = p => p.path.replace('images/', 'images/thumbs/');
 const unknown = v => !v || v === '확인 필요';
 const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

 // 사진 태그: 작은 사진(thumbs) + 원본을 srcset 으로 연결
 function setImg(img, p, sizes) {
  if (!p) return img;
  img.src = thumb(p);
  img.srcset = `${thumb(p)} ${Math.min(640, p.width)}w, ${p.path} ${p.width}w`;
  img.sizes = sizes || '100vw';
  img.alt = p.description; img.width = p.width; img.height = p.height;
  return img;
 }
 function setLarge(id, path, sizes) { const p = byPath(path); const img = $(id); if (p && img) setImg(img, p, sizes); }

 // ---------- 기본 텍스트 / 링크 ----------
 $$('[data-text]').forEach(e => { e.textContent = C[e.dataset.text] || ''; });
 const tel = 'tel:' + C.phone.replace(/[^0-9+]/g, '');
 $$('[data-phone]').forEach(a => { a.href = tel; if (a.hasAttribute('data-phone-label')) a.textContent = C.phone.replace(/-/g, '\u2011'); });
 $$('[data-booking]').forEach(a => Object.assign(a, { href: C.bookingUrl, target: '_blank', rel: 'noopener noreferrer' }));
 $('#address').textContent = C.address; $('#footer-address').textContent = C.address;
 $('#directions').href = C.placeUrl;
 $('#parking').textContent = unknown(C.parking) ? '방문 전 전화로 확인해 주세요' : C.parking;
 $('#rules').textContent = unknown(C.rules) ? '예약 시 안내해 드립니다' : C.rules;
 $('#refund').textContent = unknown(C.refundPolicy) ? '네이버 예약 화면의 안내 또는 전화 문의' : C.refundPolicy;
 $('#year').textContent = new Date().getFullYear();

 // ---------- 큰 사진 ----------
 const heroP = byPath(C.heroImage);
 if (heroP) { const h = $('#hero-image'); h.src = heroP.path; h.alt = heroP.description; h.width = heroP.width; h.height = heroP.height; }
 setLarge('#day-image', C.dayImage, '(min-width: 800px) 50vw, 100vw');
 setLarge('#night-image', C.nightImage, '(min-width: 800px) 50vw, 100vw');
 setLarge('#closing-image', C.closingImage, '100vw');

 // ---------- 사진 크게 보기 (라이트박스) ----------
 const box = $('#lightbox'), big = $('#large-photo');
 let active = [], current = 0, opener = null;
 function show() {
  const p = active[current];
  big.src = p.path; big.alt = p.description; big.width = p.width; big.height = p.height;
  $('#photo-caption').textContent = p.description;
  $('#photo-count').textContent = `${current + 1} / ${active.length}`;
  [1, -1].forEach(d => { const n = active[(current + d + active.length) % active.length]; if (n) new Image().src = n.path; });
 }
 function openPhotos(group, index, source) {
  active = group; current = Math.max(0, index); opener = source; show();
  const multi = group.length > 1; $('.lb-prev').hidden = !multi; $('.lb-next').hidden = !multi;
  box.showModal(); document.body.classList.add('modal-open');
 }
 const step = n => { current = (current + n + active.length) % active.length; show(); };
 $('.lb-close').onclick = () => box.close();
 $('.lb-prev').onclick = () => step(-1); $('.lb-next').onclick = () => step(1);
 box.addEventListener('close', () => { document.body.classList.remove('modal-open'); opener && opener.focus(); });
 box.addEventListener('click', e => { if (e.target === box) box.close(); });
 box.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
 let tx = null;
 box.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
 box.addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 45 && active.length > 1) step(dx < 0 ? 1 : -1); tx = null; });

 function photoButton(p, group, cls, sizes, label) {
  const b = make('button', cls); b.type = 'button';
  b.setAttribute('aria-label', (label || p.description) + ' — 크게 보기');
  const img = setImg(make('img'), p, sizes); img.loading = 'lazy'; img.decoding = 'async'; img.alt = '';
  b.append(img); b.onclick = () => openPhotos(group, group.indexOf(p), b);
  return b;
 }

 // ---------- 객실 ----------
 C.rooms.forEach(room => {
  const group = photos.filter(p => p.room === room.key);
  const order = ['overview', 'bedroom', 'kitchen', 'bathroom', 'detail'];
  const roomPhotos = group.filter(p => p.category !== 'exterior' && p.category !== 'bbq')
   .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
  const cover = byPath(room.image) || roomPhotos[0];
  const all = [cover, ...roomPhotos.filter(p => p !== cover)];
  const card = make('article', 'room reveal');
  const media = make('div', 'room-media');
  const coverBtn = photoButton(cover, all, 'room-cover', '(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw', `${room.name} 객실 사진 ${all.length}장`);
  coverBtn.append(make('span', 'photo-badge', `사진 ${all.length}장 보기`));
  media.append(coverBtn);
  const thumbs = make('div', 'thumbs');
  all.slice(1, 4).forEach(p => thumbs.append(photoButton(p, all, 'thumb', '120px')));
  media.append(thumbs);
  card.append(media);
  const body = make('div', 'room-body');
  body.append(make('h3', '', room.name));
  const tags = make('ul', 'room-tags'); tags.setAttribute('aria-label', '객실 시설');
  room.amenities.split('·').map(s => s.trim()).filter(Boolean).forEach(t => tags.append(make('li', '', t)));
  const dl = make('dl', 'room-facts');
  [['인원', room.capacity], ['요금', unknown(room.price) ? '날짜별 상이 · 예약 화면에서 확인' : room.price]]
   .forEach(([k, v]) => { const d = make('div'); d.append(make('dt', '', k), make('dd', '', v)); dl.append(d); });
  body.append(dl, tags);
  const link = make('a', 'btn btn-dark room-book', `${room.name} 예약하기 ↗`);
  Object.assign(link, { href: room.bookingUrl || C.bookingUrl, target: '_blank', rel: 'noopener noreferrer' });
  body.append(link);
  card.append(body);
  $('#room-list').append(card);
 });

 // ---------- 바비큐·불멍 모자이크 ----------
 const fire = (C.fireImages || []).map(byPath).filter(Boolean);
 fire.forEach((p, i) => $('#fire-mosaic').append(photoButton(p, fire, 'fire-photo f' + i, i === 0 ? '(min-width: 900px) 30vw, 60vw' : '(min-width: 900px) 20vw, 40vw')));

 // ---------- 갤러리 ----------
 const categories = [['bbq', '바비큐·불멍'], ['exterior', '외관·마당'], ['nature', '주변 자연'], ['room', '객실'], ['food', '먹고 쉬는 시간']];
 const tabs = []; let shown = 8, currentCat = 0;
 // 인물·포장지 사진은 뒤쪽으로 (풍경·공간 사진을 먼저 보여 줌)
 const later = p => /인물|사람|손|발|포장/.test(p.description) ? 1 : 0;
 const groupOf = key => (key === 'room'
  ? photos.filter(p => p.room && !['exterior', 'bbq'].includes(p.category))
  : photos.filter(p => p.category === key)).sort((a, b) => later(a) - later(b));
 function renderGallery() {
  const group = groupOf(categories[currentCat][0]);
  const panel = $('#gallery-list'); panel.replaceChildren();
  group.slice(0, shown).forEach(p => panel.append(photoButton(p, group, 'g-photo', '(min-width: 900px) 25vw, 50vw')));
  const more = $('#gallery-more');
  more.hidden = group.length <= shown;
  more.textContent = `사진 더 보기 (${group.length - Math.min(shown, group.length)}장)`;
 }
 function selectTab(i, focus) {
  currentCat = i; shown = 8;
  tabs.forEach((t, n) => { t.setAttribute('aria-selected', String(n === i)); t.tabIndex = n === i ? 0 : -1; });
  $('#gallery-list').setAttribute('aria-labelledby', tabs[i].id);
  renderGallery(); if (focus) tabs[i].focus();
 }
 categories.forEach(([key, label], i) => {
  const t = make('button', '', `${label} ${groupOf(key).length}`); t.type = 'button'; t.id = 'tab-' + key;
  t.setAttribute('role', 'tab'); t.setAttribute('aria-controls', 'gallery-list');
  t.onclick = () => selectTab(i);
  t.onkeydown = e => {
   const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: categories.length - 1 }[e.key];
   if (n !== undefined) { e.preventDefault(); selectTab((n + categories.length) % categories.length, true); }
  };
  tabs.push(t); $('#gallery-tabs').append(t);
 });
 $('#gallery-more').onclick = () => {
  const before = shown; shown += 12; renderGallery();
  const next = $('#gallery-list').children[before]; next && next.focus();
 };
 selectTab(0);

 // ---------- 자주 묻는 질문 ----------
 (C.faq || []).forEach((f, i) => {
  const d = make('details', 'faq-item'); if (i === 0) d.open = true;
  const answer = (!unknown(C.parking) && f.q.includes('주차')) ? C.parking : f.a;
  d.append(make('summary', '', f.q), make('p', '', answer));
  $('#faq-list').append(d);
 });

 // ---------- 주소 복사 / 지도 ----------
 $('#copy-address').onclick = async () => {
  const s = $('#copy-status');
  try { await navigator.clipboard.writeText(C.address); s.textContent = '주소를 복사했습니다.'; }
  catch { s.textContent = '주소: ' + C.address; }
 };
 $('#map-load').onclick = () => {
  const lat = C.latitude, lon = C.longitude, d = 0.012;
  const f = make('iframe');
  Object.assign(f, { title: '시골집손님방 위치 지도 (OpenStreetMap)', loading: 'lazy',
   src: `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d * 1.6},${lat - d},${lon + d * 1.6},${lat + d}&layer=mapnik&marker=${lat},${lon}` });
  $('#map').replaceChildren(f);
  const credit = make('a', 'map-credit', '큰 지도 보기 ↗');
  Object.assign(credit, { href: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`, target: '_blank', rel: 'noopener noreferrer' });
  $('#map').append(credit);
 };

 // ---------- 헤더 / 모바일 메뉴 ----------
 const header = $('.site-header'), toggle = $('.menu-toggle'), nav = $('#site-nav');
 const setMenu = open => {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.sr').textContent = open ? '메뉴 닫기' : '메뉴 열기';
  header.classList.toggle('menu-open', open); document.body.classList.toggle('no-scroll', open);
 };
 toggle.onclick = () => setMenu(toggle.getAttribute('aria-expanded') !== 'true');
 nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
 document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { setMenu(false); toggle.focus(); } });
 const hero = $('.hero');
 const onScroll = () => {
  const past = window.scrollY > hero.offsetHeight - 80;
  header.classList.toggle('solid', window.scrollY > 40);
  $('#mobile-bar').classList.toggle('show', window.scrollY > 320);
  document.documentElement.classList.toggle('past-hero', past);
 };
 addEventListener('scroll', onScroll, { passive: true }); onScroll();

 // ---------- 절제된 등장 효과 ----------
 if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion');
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(e => io.observe(e));
 }
})();
