// =====================================================================
//  홈페이지 내용 수정 파일 — 따옴표('') 안의 글자만 바꾸세요.
//  예약 주소는 bookingUrl 한 곳에서 변경하세요. 미확인 정보는 '확인 필요'로 유지합니다.
//  '확인 필요'로 남겨 두면 화면에는 "예약 전 문의" 안내로 자연스럽게 표시됩니다.
// =====================================================================
window.SITE_CONFIG = {
 name: '시골집손님방', phone: '010-5779-5385',
 bookingUrl: 'https://map.naver.com/p/entry/place/1317281004',
 placeUrl: 'https://map.naver.com/p/entry/place/1317281004',
 mobilePlaceUrl: 'https://m.place.naver.com/accommodation/1317281004/home',
 address: '충청남도 공주시 정안면 정안중앙길 215-36', latitude: 36.6136474, longitude: 127.1198802,
 checkIn: '15:00', checkOut: '11:00', rules: '확인 필요', refundPolicy: '확인 필요',
 parking: '확인 필요',   // 주차 가능 여부·대수 확인 후 적어 주세요. 예: '숙소 앞 마당에 3대 주차 가능'

 // ---- 화면에 크게 쓰는 사진 (images/photos.json 에 있는 경로) ----
 heroImage: 'images/room-103c/exterior-04.jpg',      // 첫 화면: 들판을 향한 숙소 주변 풍경
 dayImage: 'images/common/nature-09.jpg',            // 낮: 냇물 풍경
 nightImage: 'images/room-103c/bbq-01.jpg',          // 밤: 화로 불멍
 fireImages: ['images/common/bbq-13.jpg', 'images/room-103c/exterior-03.jpg', 'images/common/exterior-02.jpg', 'images/common/bbq-07.jpg'],
 closingImage: 'images/room-103c/exterior-01.jpg',   // 마지막 예약 안내 배경

 rooms: [
  {name:'101호 A',key:'101호A',image:'images/room-101a/overview-03.jpg',capacity:'기준 2인 / 최대 4인',price:'확인 필요',amenities:'침실 1개 · 퀸 침대 1개 · 욕실 1개 · 취사 · 개별 바비큐',bookingUrl:''},
  {name:'102호 B',key:'102호B',image:'images/room-102b/overview-01.jpg',capacity:'기준 2인 / 최대 4인',price:'확인 필요',amenities:'침실 1개 · 퀸 침대 1개 · 욕실 1개 · 취사 · 개별 바비큐',bookingUrl:''},
  {name:'103호 C',key:'103호C',image:'images/room-103c/overview-01.jpg',capacity:'기준 2인 / 최대 6인',price:'확인 필요',amenities:'침실 2개 · 퀸 침대 1개 · 이불세트 2개 · 욕실 1개 · 취사 · 개별 바비큐',bookingUrl:''}
 ],

 // ---- 자주 묻는 질문: 확인된 내용만 적어 주세요 ----
 faq: [
  {q:'입실과 퇴실 시간은 언제인가요?', a:'체크인은 15:00, 체크아웃은 11:00입니다.'},
  {q:'몇 명까지 머물 수 있나요?', a:'101호 A와 102호 B는 기준 2인·최대 4인, 103호 C는 기준 2인·최대 6인입니다. 인원 추가 조건은 예약 시 확인해 주세요.'},
  {q:'객실에서 요리할 수 있나요?', a:'세 객실 모두 취사가 가능한 객실로 등록되어 있습니다. 준비된 조리도구는 예약 전 문의해 주세요.'},
  {q:'바비큐와 불멍을 할 수 있나요?', a:'객실마다 개별 바비큐 공간이 있습니다. 숯·그릴·불멍 용품의 준비 여부와 비용은 예약 시 숙소에 문의해 주세요.'},
  {q:'요금은 얼마인가요?', a:'요금은 날짜와 인원에 따라 달라집니다. 네이버 예약에서 원하시는 날짜의 요금을 확인해 주세요.'},
  {q:'주차할 수 있나요?', a:'주차 가능 여부와 위치는 방문 전 전화로 확인해 주세요.'},
  {q:'예약과 환불은 어떻게 하나요?', a:'네이버 플레이스의 예약 메뉴에서 예약하실 수 있습니다. 환불 기준은 예약 화면의 안내를 확인하시거나 전화로 문의해 주세요.'}
 ]
};
