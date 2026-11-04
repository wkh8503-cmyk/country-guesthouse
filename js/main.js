(() => {
 'use strict';
 const C=window.SITE_CONFIG, photos=window.SITE_PHOTOS;
 const $=s=>document.querySelector(s);
 const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
 const byPath=p=>photos.find(photo=>photo.path===p);
 const hero=byPath(C.heroImage);
 Object.assign($('#hero-image'),{src:hero.path,alt:hero.description,width:hero.width,height:hero.height,fetchPriority:'high'});
 const box=$('#lightbox');let active=[],current=0,opener;
 function showPhoto(){const p=active[current];$('#large-photo').src=p.path;$('#large-photo').alt=p.description;$('#photo-caption').textContent=p.description;$('#photo-count').textContent=`${current+1} / ${active.length}`;}
 function openPhoto(group,index,source){active=group;current=index;opener=source;showPhoto();box.showModal();document.body.classList.add('modal-open');}
 function step(n){current=(current+n+active.length)%active.length;showPhoto();}
 $('.close').onclick=()=>box.close();$('.previous').onclick=()=>step(-1);$('.next').onclick=()=>step(1);
 box.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
 box.addEventListener('click',e=>{if(e.target===box)box.close();});
 box.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);});
 function photoButton(p,group,index,cls){const b=make('button',cls);b.type='button';b.setAttribute('aria-label',p.description+' — 크게 보기');const img=make('img');Object.assign(img,{src:p.path,alt:p.description,width:p.width,height:p.height,loading:'lazy',decoding:'async'});b.append(img);b.onclick=()=>openPhoto(group,index,b);return b;}
 C.rooms.forEach(room=>{
  const group=photos.filter(p=>p.room===room.key),cover=byPath(room.image)||group[0],card=make('article','room');
  const coverButton=photoButton(cover,group,group.indexOf(cover),'room-cover');coverButton.append(make('span','photo-badge',`사진 ${group.length}장 ↗`));card.append(coverButton);
  const body=make('div','room-body');body.append(make('h3','',room.name));
  const thumbs=make('div','thumbnails');group.filter(p=>p!==cover).slice(0,3).forEach(p=>thumbs.append(photoButton(p,group,group.indexOf(p),'thumbnail')));body.append(thumbs);
  const details=make('dl','room-details');[['기준·최대 인원',room.capacity],['객실 요금',room.price],['시설',room.amenities]].forEach(([label,value])=>{const row=make('div');row.append(make('dt','',label),make('dd','',value));details.append(row);});body.append(details);
  const link=make('a','room-book','예약하기 ↗');Object.assign(link,{href:room.bookingUrl||C.bookingUrl,target:'_blank',rel:'noopener noreferrer'});body.append(link);card.append(body);$('#room-list').append(card);
 });
 const categories=[['exterior','외관·마당'],['bbq','바비큐·불멍'],['nature','주변 자연'],['food','음식']],tabs=[];
 function selectGallery(i){tabs.forEach((tab,n)=>{tab.setAttribute('aria-selected',String(n===i));tab.tabIndex=n===i?0:-1;});const group=photos.filter(p=>!p.room&&p.category===categories[i][0]);const panel=$('#gallery-list');panel.replaceChildren();panel.setAttribute('aria-labelledby',tabs[i].id);group.forEach((p,index)=>panel.append(photoButton(p,group,index,'gallery-photo')));}
 categories.forEach(([key,label],i)=>{const tab=make('button','',label);tab.type='button';tab.id='tab-'+key;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','gallery-list');tab.onclick=()=>selectGallery(i);tab.onkeydown=e=>{const shifts={ArrowRight:1,ArrowLeft:-1};let next;if(e.key in shifts)next=(i+shifts[e.key]+categories.length)%categories.length;if(e.key==='Home')next=0;if(e.key==='End')next=categories.length-1;if(next!==undefined){e.preventDefault();selectGallery(next);tabs[next].focus();}};tabs.push(tab);$('#gallery-tabs').append(tab);});selectGallery(0);
 document.querySelectorAll('[data-booking]').forEach(a=>Object.assign(a,{href:C.bookingUrl,target:'_blank',rel:'noopener noreferrer'}));
 document.querySelectorAll('[data-phone]').forEach(a=>a.href='tel:'+C.phone.replace(/[^0-9+]/g,''));
 $('#address').textContent=C.address;$('#check-in').textContent=C.checkIn;$('#check-out').textContent=C.checkOut;
 $('#rules').textContent='이용 규칙: '+C.rules+' / 환불 규정: '+C.refundPolicy;
 $('#directions').href=C.placeUrl;$('#location-link').href=C.placeUrl;$('#year').textContent=new Date().getFullYear();
})();
