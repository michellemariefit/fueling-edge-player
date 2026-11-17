// Shared bits for every Fueling Edge page: storage, escaping, favorites, the data file, and the offline cache.
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const ymd=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const TODAY=ymd(today());
let DATA=null;
const loadData=()=>DATA?Promise.resolve(DATA):fetch('data/fuel.json').then(r=>r.json()).then(d=>(DATA=d));
// Her kid's favorites: foods ticked on the Fuel List. Keyed by food name.
const likes=()=>store.get('fuel:likes',{});
function picks(catId,n=3){
  // Foods from a category, the kid's favorites first. Used by the game-day and practice pages.
  const cat=DATA.categories.find(c=>c.id===catId); if(!cat) return [];
  const L=likes(); const liked=cat.foods.filter(f=>L[f]); const rest=cat.foods.filter(f=>!L[f]);
  return liked.length?liked.slice(0,n):rest.slice(0,n);
}
function picksText(catId,n=3){const p=picks(catId,n);return p.length?p.join(', '):''}
// Log a done thing for the week page: {t, kind}
function logDone(kind){const log=store.get('fuel:log',[]);log.push({t:Date.now(),d:TODAY,kind});store.set('fuel:log',log.slice(-500))}
const fmtTime=d=>d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
