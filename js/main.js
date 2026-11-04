/* 홈페이지 동작 스크립트
 * 내용 수정은 js/config.js 에서 하세요. 이 파일은 고치지 않아도 됩니다. */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};

  function $(sel) { return document.querySelector(sel); }
  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, C);
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function won(n) { return Number(n || 0).toLocaleString("ko-KR") + "원"; }

  /* 사진 또는 "사진 교체 위치" 안내 상자 */
  function photo(src, alt, label, variant) {
    if (src) {
      var img = el("img", "photo");
      img.src = src; img.alt = alt; img.loading = "lazy";
      return img;
    }
    var box = el("div", "photo-placeholder" + (variant ? " ph-" + variant : ""));
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", alt + " (사진 준비 중)");
    box.appendChild(el("span", "ph-icon", "📷"));
    box.appendChild(el("span", "ph-label", label || "사진 교체 위치"));
    return box;
  }

  /* ----- 단순 텍스트 연결 ----- */
  document.querySelectorAll("[data-bind]").forEach(function (node) {
    var v = get(node.getAttribute("data-bind"));
    if (v != null) node.textContent = v;
  });
  if (C.name) document.title = C.name + " | 시골집 손님방";
  $("#year").textContent = new Date().getFullYear();

  if (C.heroImage) {
    var hb = $("#hero-bg");
    hb.innerHTML = "";
    hb.style.backgroundImage = "url('" + C.heroImage + "')";
    hb.classList.add("has-photo");
  }

  /* ----- 숙소 소개 ----- */
  if (C.about) {
    $("#about-media").appendChild(photo(C.about.image, C.name + " 전경", "사진 교체 위치 · 숙소 전경", "about"));
    (C.about.paragraphs || []).forEach(function (p) { $("#about-paragraphs").appendChild(el("p", null, p)); });
    (C.about.highlights || []).forEach(function (h) {
      var li = el("li");
      li.appendChild(el("span", "hl-icon", h.icon)).setAttribute("aria-hidden", "true");
      li.appendChild(el("span", null, h.text));
      $("#about-highlights").appendChild(li);
    });
  }

  /* ----- 객실 ----- */
  var rooms = C.rooms || [];
  rooms.forEach(function (r, i) {
    var card = el("article", "room-card");
    card.appendChild(photo(r.image, r.name + " 객실 내부", "사진 교체 위치 · " + r.name, "room" + (i % 3)));
    var body = el("div", "room-body");
    body.appendChild(el("h3", "room-name", r.name));
    body.appendChild(el("p", "room-desc", r.description));
    var meta = el("p", "room-meta");
    meta.appendChild(el("span", null, "👥 " + r.capacity));
    if (r.size) meta.appendChild(el("span", null, "📐 " + r.size));
    body.appendChild(meta);
    var am = el("ul", "tags");
    am.setAttribute("aria-label", "편의시설");
    (r.amenities || []).forEach(function (a) { am.appendChild(el("li", null, a)); });
    body.appendChild(am);
    var price = el("dl", "price");
    [["평일", r.priceWeekday], ["주말", r.priceWeekend]].forEach(function (p) {
      var d = el("div");
      d.appendChild(el("dt", null, p[0]));
      d.appendChild(el("dd", null, won(p[1])));
      price.appendChild(d);
    });
    body.appendChild(price);
    var btn = el("a", "btn btn-small btn-outline", "이 방 문의하기");
    btn.href = "#contact";
    body.appendChild(btn);
    card.appendChild(body);
    $("#room-list").appendChild(card);
  });

  /* ----- 요금 계산기 ----- */
  var sel = $("#calc-room");
  rooms.forEach(function (r, i) {
    var o = el("option", null, r.name);
    o.value = i;
    sel.appendChild(o);
  });
  function num(id) { var v = parseInt($(id).value, 10); return isNaN(v) || v < 0 ? 0 : v; }
  function calc() {
    var r = rooms[sel.value];
    if (!r) return;
    var wd = num("#calc-weekday"), we = num("#calc-weekend"), ex = num("#calc-extra");
    var nights = wd + we;
    var extra = ex * nights * (C.extraPersonFee || 0);
    var total = wd * r.priceWeekday + we * r.priceWeekend + extra;
    $("#calc-total").textContent = won(total);
    var parts = [];
    if (wd) parts.push("평일 " + wd + "박 " + won(wd * r.priceWeekday));
    if (we) parts.push("주말 " + we + "박 " + won(we * r.priceWeekend));
    if (extra) parts.push("추가 인원 " + won(extra));
    $("#calc-detail").textContent = nights ? "(" + parts.join(" + ") + ")" : "(박수를 입력해 주세요)";
  }
  $("#calc-form").addEventListener("input", calc);
  calc();

  /* ----- 시설 ----- */
  (C.facilities || []).forEach(function (f) {
    var li = el("li", "feature");
    li.appendChild(el("span", "feature-icon", f.icon)).setAttribute("aria-hidden", "true");
    li.appendChild(el("h3", null, f.title));
    li.appendChild(el("p", null, f.text));
    $("#facility-list").appendChild(li);
  });

  /* ----- 계절 갤러리 ----- */
  var seasonVariant = { "봄": "spring", "여름": "summer", "가을": "autumn", "겨울": "winter" };
  (C.gallery || []).forEach(function (g) {
    var li = el("li");
    var fig = el("figure", "gallery-item");
    fig.appendChild(photo(g.image, g.season + " 풍경 - " + g.caption, "사진 교체 위치", seasonVariant[g.season]));
    var cap = el("figcaption");
    cap.appendChild(el("strong", null, g.season));
    cap.appendChild(document.createTextNode(" " + g.caption));
    fig.appendChild(cap);
    li.appendChild(fig);
    $("#gallery-list").appendChild(li);
  });

  /* ----- 주변 관광지 ----- */
  (C.attractions || []).forEach(function (a) {
    var li = el("li", "attraction");
    var head = el("div", "attraction-head");
    head.appendChild(el("h3", null, a.name));
    head.appendChild(el("span", "badge", a.distance));
    li.appendChild(head);
    li.appendChild(el("p", null, a.text));
    $("#attraction-list").appendChild(li);
  });

  /* ----- 이용 안내 ----- */
  (C.refundPolicy || []).forEach(function (t) { $("#refund-list").appendChild(el("li", null, t)); });
  (C.notices || []).forEach(function (t) { $("#notice-list").appendChild(el("li", null, t)); });

  /* ----- 오시는 길 ----- */
  var loc = C.location || {};
  var mapBox = $("#map-box");
  if (loc.mapImage) {
    mapBox.appendChild(photo(loc.mapImage, "숙소 위치 지도", ""));
  } else {
    mapBox.classList.add("map-placeholder");
    mapBox.setAttribute("role", "img");
    mapBox.setAttribute("aria-label", "지도 자리 (지도 이미지 준비 중)");
    mapBox.innerHTML =
      '<svg viewBox="0 0 400 300" aria-hidden="true" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="400" height="300" fill="#e9e1cf"/>' +
      '<path d="M0 200 Q120 150 200 190 T400 160" stroke="#b7c4a0" stroke-width="40" fill="none"/>' +
      '<path d="M-10 90 L410 240" stroke="#fff" stroke-width="10"/>' +
      '<path d="M150 -10 L230 310" stroke="#fff" stroke-width="7"/>' +
      '<path d="M0 270 Q200 230 400 280" stroke="#9cc3d5" stroke-width="12" fill="none"/>' +
      '<g transform="translate(196 140)"><path d="M0 0 C-18 -22 -18 -45 0 -45 C18 -45 18 -22 0 0Z" fill="#b5532f"/><circle cy="-32" r="6" fill="#fff"/></g>' +
      "</svg>" +
      '<span class="map-label">지도 교체 위치</span>';
  }
  var mapLink = $("#map-link");
  mapLink.href = loc.mapLinkUrl || "#";
  $("#copy-address").addEventListener("click", function () {
    var btn = this, text = loc.address || "";
    function done() { btn.textContent = "복사되었습니다 ✓"; setTimeout(function () { btn.textContent = "주소 복사"; }, 2000); }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { window.prompt("주소를 복사하세요", text); });
    } else {
      window.prompt("주소를 복사하세요", text);
    }
  });

  /* ----- 자주 묻는 질문 (아코디언) ----- */
  (C.faq || []).forEach(function (f, i) {
    var item = el("div", "acc-item");
    var h = el("h3", "acc-heading");
    var b = el("button", "acc-button");
    b.type = "button";
    b.id = "faq-q-" + i;
    b.setAttribute("aria-expanded", "false");
    b.setAttribute("aria-controls", "faq-a-" + i);
    b.appendChild(el("span", null, f.q));
    b.appendChild(el("span", "acc-icon")).setAttribute("aria-hidden", "true");
    h.appendChild(b);
    var panel = el("div", "acc-panel");
    panel.id = "faq-a-" + i;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-labelledby", b.id);
    panel.hidden = true;
    panel.appendChild(el("p", null, f.a));
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
    item.appendChild(h);
    item.appendChild(panel);
    $("#faq-list").appendChild(item);
  });

  /* ----- 예약 문의 버튼 ----- */
  var ct = C.contact || {};
  $("#btn-phone").href = ct.phone ? "tel:" + ct.phone.replace(/[^0-9+]/g, "") : "#";
  $("#btn-kakao").href = ct.kakaoUrl || "#";
  $("#btn-naver").href = ct.naverBookingUrl || "#";

  /* ----- 푸터 ----- */
  var ft = C.footer || {};
  $("#footer-info").textContent = [ft.owner, ft.businessNumber, ct.phone, loc.address].filter(Boolean).join(" · ");

  /* ----- 모바일 메뉴 ----- */
  var toggle = $(".nav-toggle"), nav = $("#site-nav");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ----- 스크롤 시 헤더 그림자 / 하단 버튼 표시 ----- */
  var header = $(".site-header"), sticky = $(".sticky-cta"), contact = $("#contact");
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 20);
    var cr = contact.getBoundingClientRect();
    var contactVisible = cr.top < window.innerHeight && cr.bottom > 0;
    sticky.classList.toggle("show", y > window.innerHeight * 0.6 && !contactVisible);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- 나타나는 효과 ----- */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll(".section .container").forEach(function (s) {
      s.classList.add("reveal");
      io.observe(s);
    });
  }
})();
