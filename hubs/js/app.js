let DATA=null, current=null;
const $=id=>document.getElementById(id);
function qs(){return new URLSearchParams(location.search)}
async function init(){
  const res=await fetch('./data/hubs.json?v=babel-hub-1'); DATA=await res.json();
  const slug=qs().get('hub')||DATA.defaultHub||'creation'; render(slug);
}
function find(slug){return DATA.hubs.find(h=>h.slug===slug)||DATA.hubs[0]}
function render(slug){
  const h=find(slug); current=h;
  if(!h.ready){renderPending(h);return}
  $('title').textContent=`${h.icon||''} ${h.title}`;
  $('subtitle').textContent=h.subtitle||'';
  $('verse').textContent=h.verse||h.message||'';
  $('map').src=h.map||'';
  $('caption').textContent=h.mapCaption||'';
  $('events').innerHTML=(h.events||[]).map(x=>`<div class="item">${x}</div>`).join('');
  $('meanings').innerHTML=(h.meanings||[]).map(x=>`<li>${x}</li>`).join('');
  $('connections').innerHTML=(h.connections||[]).map(x=>`<span class="chip">${x}</span>`).join('');
  $('references').innerHTML=(h.references||[]).map(x=>`<span class="chip">${x}</span>`).join('');
  const n=h.next?find(h.next):null;
  const btn=$('nextBtn');
  if(n){btn.style.display='block';btn.textContent=`다음: ${n.title} →`;btn.onclick=()=>go(n.slug)}else{btn.style.display='none'}
  history.replaceState(null,'',`?hub=${h.slug}`);
}
function renderPending(h){
  $('title').textContent=`${h.icon||''} ${h.title}`;$('subtitle').textContent=h.subtitle||'제작 예정';$('verse').textContent='이 허브는 다음 단계에서 제작할 예정입니다.';$('map').src='assets/maps/creation-hub-map.png';$('caption').textContent='창조시대 허브 구조에 맞춰 PNG 교체형 지도 영역을 유지합니다.';$('events').innerHTML='<div class="item">제작 예정입니다.</div>';$('meanings').innerHTML='<li>내용 추가 예정</li>';$('connections').innerHTML='<span class="chip">준비중</span>';$('references').innerHTML='<span class="chip">준비중</span>';$('nextBtn').style.display='none';history.replaceState(null,'',`?hub=${h.slug}`);
}
function go(slug){render(slug);window.scrollTo({top:0,behavior:'smooth'})}
function openList(){
  $('hubList').innerHTML=DATA.hubs.map(h=>`<button class="hubOpt" onclick="closeList();go('${h.slug}')">${h.icon||''} ${h.title}<small>${h.subtitle||''}${h.ready?'':' · 제작 예정'}</small></button>`).join('');
  $('dialog').classList.add('show')
}
function closeList(){$('dialog').classList.remove('show')}
init().catch(e=>{console.error(e);alert('허브 데이터를 불러오지 못했습니다.')});
