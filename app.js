const C=CONFIG,$=s=>document.querySelector(s),A=$('#app');
let db,auth,unsub,unauth;const ok=C.firebase.apiKey&&!C.firebase.apiKey.startsWith('YOUR');
if(ok){firebase.initializeApp(C.firebase);db=firebase.firestore();auth=firebase.auth()}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.documentElement.dataset.t=localStorage.t||'dark';
window.tt=()=>{const d=document.documentElement;d.dataset.t=localStorage.t=d.dataset.t=='dark'?'light':'dark'};
const NAV=[['','Home'],['roe','ROE'],['submit','Submit'],['map','Turfs'],['spin','Weapon Spin'],['admin','Admin']];
const nav=()=>{const k=location.hash.slice(2);return `<nav class="nav"><a class="brand" href="#/"><img src="${esc(C.logo)}" onerror="this.remove()"><b>${esc(C.name)}</b></a><div class="links">${NAV.map(([h,t])=>`<a href="#/${h}" class="${k==h?'on':''}">${t}</a>`).join('')}</div><button class="btn sm" onclick="tt()">◐</button></nav>`};
const noDb=()=>`<div class="card narrow center">Backend not set up yet. Add your Firebase keys in <code>config.js</code>.</div>`;
const stat=(t,m,b='')=>`<div class="card narrow center"><span class="tag">YOUR THREAD STATUS</span><h2>${t}</h2><p class="m">${m}</p>${b}</div>`;
const V={
home(){const T=[['roe','01','Rules of Engagement','Read the scheme rules before you play.'],['submit','02','Thread Submission','Send in your group and get reviewed.'],['map','03','Turf Map','See who holds what across the city.'],['spin','04','Weapon Spin','Roll for your piece by tier.']];
 A.innerHTML=nav()+`<header class="hero" style="background-image:linear-gradient(180deg,#000b,var(--bg)),url(${esc(C.bg)})"><img class="logo" src="${esc(C.logo)}" onerror="this.remove()"><h1>${esc(C.name)}</h1><p>${esc(C.tagline)}</p></header>
 <main class="wrap"><div class="tiles">${T.map(([h,n,t,d])=>`<a class="tile" href="#/${h}"><span>${n}</span><h3>${t}</h3><p>${d}</p><i>→</i></a>`).join('')}</div><p class="foot">${esc(C.footer)}</p></main>`},
roe(){A.innerHTML=nav()+`<main class="wrap two"><aside class="toc"><b>Sections</b>${C.roe.map((s,i)=>`<a href="#/roe" data-i="${i}">${i+1}. ${esc(s.t)}</a>`).join('')}</aside><div><h1>${esc(C.name)} ROE</h1>${C.roe.map((s,i)=>`<section class="card sec" id="s${i}"><span class="tag">SECTION ${i+1}</span><h2>${esc(s.t)}</h2>${s.b}</section>`).join('')}</div></main>`;
 document.querySelectorAll('.toc a').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById('s'+a.dataset.i).scrollIntoView({behavior:'smooth'})})},
async submit(){A.innerHTML=nav()+`<main class="wrap"><div id="b"></div></main>`;const b=$('#b');if(!ok)return b.innerHTML=noDb();
 const id=localStorage.tid;
 if(id){try{const d=await db.collection('threads').doc(id).get();if(d.exists){const s=d.data();
  if(s.status=='pending')return b.innerHTML=stat('Under review',`Management is reviewing ${esc(s.group)}. You can submit another once it is approved or denied.`);
  b.innerHTML=stat(`${esc(s.group)} was ${s.status}`,s.status=='approved'?'Check the turf map!':'You can send in a new thread.','<button class="btn pri" id="n">Submit another</button>');
  return $('#n').onclick=()=>{localStorage.removeItem('tid');V.submit()}}}catch(e){}}
 b.innerHTML=`<h1>Thread Submission</h1><form id="f" class="narrow"><div class="card grid2"><label>Group name<input name="group" required></label><label>Borough<select name="borough">${C.boroughs.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>Leader Discord<input name="discord" required></label><label>Thread link (optional)<input name="link"></label></div>
 ${C.questions.map((q,i)=>`<div class="card"><label><span class="q">${i+1}</span>${esc(q)}<textarea name="q${i}" required rows="3"></textarea></label></div>`).join('')}<button class="btn pri big">Send thread</button></form>`;
 $('#f').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const r=await db.collection('threads').add({group:f.group,borough:f.borough,discord:f.discord,link:f.link,answers:C.questions.map((q,i)=>({q,a:f['q'+i]})),status:'pending',ts:Date.now()});localStorage.tid=r.id;V.submit()}},
async map(){A.innerHTML=nav()+`<div class="mapbox"><div id="m"></div><aside class="side"><h3>Factions</h3><input id="sr" placeholder="Search..."><div id="L"></div></aside></div>`;
 const H=C.map.h,W=C.map.w,m=L.map('m',{crs:L.CRS.Simple,minZoom:-3,maxZoom:2,zoomControl:false,attributionControl:false});L.control.zoom({position:'bottomright'}).addTo(m);const bd=[[0,0],[H,W]];L.imageOverlay(C.map.img,bd).addTo(m);m.fitBounds(bd);
 if(!ok)return $('#L').innerHTML='<p class="m">Backend not set up</p>';
 $('#sr').oninput=e=>document.querySelectorAll('.fac').forEach(a=>a.style.display=a.textContent.toLowerCase().includes(e.target.value.toLowerCase())?'':'none');
 const q=await db.collection('threads').where('status','==','approved').get();q.forEach(d=>{const s=d.data();if(!s.turf)return;const t=s.turf,r=L.rectangle([[H-t.y1,t.x1],[H-t.y2,t.x2]],{color:s.color,weight:2,fillOpacity:.45}).addTo(m).bindPopup(`<b>${esc(s.group)}</b><br>${esc(s.borough)}`);
 const a=document.createElement('a');a.className='fac';a.innerHTML=`<i style="background:${esc(s.color)}"></i>${esc(s.group)}<small>${esc(s.borough)}</small>`;a.onclick=()=>{m.fitBounds(r.getBounds(),{maxZoom:0});r.openPopup()};$('#L').append(a)})},
spin(){let ti=0,n=3,busy=0;const T=()=>C.tiers[ti];
 const card=(w,d)=>`<div class="wc r${w.r}" ${d!=null?`style="animation-delay:${d}ms"`:''}><span>${esc(w.n)}</span><img src="${esc(w.img)}" onerror="this.style.opacity=0"><b>${'★'.repeat(w.r)}</b></div>`;
 const saved=()=>{try{return JSON.parse(localStorage.pulls||'null')}catch(e){return null}};
 A.innerHTML=nav()+`<main class="wrap"><div class="center"><span class="tag">WEAPON SPIN</span><h1>Spin for your piece</h1><p class="m">Pick a tier, choose how many spins, and roll. Every gun in a tier has equal odds. The reel shows your last pull, and every gun you land is listed below.</p></div>
 <div class="tabs" id="ti"></div><div class="card"><div class="vp"><div class="pin"></div><div id="rl"></div></div><div class="ctl" id="ct"></div></div>
 <section class="card"><h2>Your pulls</h2><div id="rs"></div></section><h2>Can drop in <span id="tn"></span></h2><div class="cat" id="cat"></div></main>`;
 const draw=()=>{$('#ti').innerHTML=C.tiers.map((t,i)=>`<button class="tab ${i==ti?'on':''}" data-i="${i}">${esc(t.name)} <small>${t.weapons.length}</small></button>`).join('');
  document.querySelectorAll('.tab').forEach(e=>e.onclick=()=>{if(busy)return;ti=+e.dataset.i;draw()});$('#tn').textContent=T().name;$('#cat').innerHTML=T().weapons.map(w=>card(w)).join('');
  const rl=$('#rl');rl.style.cssText='';rl.innerHTML=[...Array(12)].map(()=>card(T().weapons[Math.random()*T().weapons.length|0])).join('');
  $('#ct').innerHTML=`<button class="btn" id="mi">−</button><span class="btn num">${n}</span><button class="btn" id="pl">+</button>${C.spinAmounts.map(a=>`<button class="btn ${a==n?'on':''}" data-a="${a}">${a}</button>`).join('')}<button class="btn pri" id="go">SPIN ${n}×</button>`;
  $('#mi').onclick=()=>{if(!busy){n=Math.max(1,n-1);draw()}};$('#pl').onclick=()=>{if(!busy){n=Math.min(100,n+1);draw()}};document.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{if(!busy){n=+e.dataset.a;draw()}});$('#go').onclick=go};
 const pulls=()=>{const s=saved(),el=$('#rs'),tr=s&&C.tiers[s.tier];if(!tr)return el.innerHTML='<p class="empty">No pulls yet. Hit spin and your guns will show up here.</p>';
  const l=s.names.map(x=>tr.weapons.find(w=>w.n==x)).filter(Boolean);el.innerHTML=`<p class="m">${esc(tr.name)} · ${l.length} gun${l.length>1?'s':''}</p><div class="cat">${l.map((w,i)=>`<div class="pl">${card(w,i*60)}<i>#${i+1}</i></div>`).join('')}</div>`};
 const go=()=>{if(busy)return;busy=1;const t=T().weapons,res=[...Array(n)].map(()=>t[Math.random()*t.length|0]),w=res[n-1],rl=$('#rl');
  localStorage.pulls=JSON.stringify({tier:ti,names:res.map(x=>x.n)});$('#rs').innerHTML='<p class="empty">Rolling…</p>';
  rl.style.transition='none';rl.style.transform='none';rl.innerHTML=[...Array(40)].map((_,i)=>card(i==32?w:t[Math.random()*t.length|0])).join('');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{const off=32*160+72-rl.parentElement.clientWidth/2+(Math.random()*80-40);rl.style.transition='transform 4.5s cubic-bezier(.1,.7,.1,1)';rl.style.transform=`translateX(-${off}px)`}));
  setTimeout(()=>{pulls();busy=0},4700)};
 const s0=saved();if(s0&&C.tiers[s0.tier])ti=s0.tier;draw();pulls()},
admin(){A.innerHTML=nav()+`<main class="wrap"><div id="b"></div></main>`;const b=$('#b');if(!ok)return b.innerHTML=noDb();
 unauth=auth.onAuthStateChanged(u=>{if(u)return panel(b);unsub&&unsub();b.innerHTML=`<form class="card narrow center" id="lf"><h2>Management Login</h2><input name="e" type="email" placeholder="Email" required><input name="p" type="password" placeholder="Password" required><button class="btn pri">Log in</button><p id="er" class="m"></p></form>`;
  $('#lf').onsubmit=e=>{e.preventDefault();const f=e.target;auth.signInWithEmailAndPassword(f.e.value,f.p.value).catch(x=>$('#er').textContent=x.message)}})}
};
function panel(b){let box=null,pv,f='pending',docs=[],p=[];
 b.innerHTML=`<div class="rh"><h1>Management</h1><button class="btn sm" onclick="auth.signOut()">Log out</button></div><p class="m">Click two corners on the map to draw a turf, then approve a thread.</p><div id="am"></div><div class="tabs" id="ft"></div><div id="th"></div>`;
 const H=C.map.h,W=C.map.w,m=L.map('am',{crs:L.CRS.Simple,minZoom:-3,maxZoom:2,attributionControl:false}),bd=[[0,0],[H,W]];L.imageOverlay(C.map.img,bd).addTo(m);m.fitBounds(bd);
 m.on('click',e=>{p.push(e.latlng);if(p.length>2)p=[e.latlng];if(pv)pv.remove();if(p.length==2){pv=L.rectangle(p,{color:'#ffb020'}).addTo(m);const[a,c]=p;box={x1:Math.round(Math.min(a.lng,c.lng)),x2:Math.round(Math.max(a.lng,c.lng)),y1:Math.round(H-Math.max(a.lat,c.lat)),y2:Math.round(H-Math.min(a.lat,c.lat))}}});
 const render=()=>{$('#ft').innerHTML=['pending','approved','denied'].map(s=>`<button class="tab ${s==f?'on':''}" data-f="${s}">${s} <small>${docs.filter(d=>d.data().status==s).length}</small></button>`).join('');
  $('#th').innerHTML=docs.filter(d=>d.data().status==f).map(d=>{const t=d.data();return `<div class="card"><b>${esc(t.group)}</b> · ${esc(t.borough)} · ${esc(t.discord)} ${t.link?`· <a href="${esc(t.link)}" target="_blank">thread</a>`:''}<details><summary>Answers</summary>${(t.answers||[]).map(a=>`<p><b>${esc(a.q)}</b><br>${esc(a.a)}</p>`).join('')}</details>
  <div class="row"><input type="color" id="c${d.id}" value="${t.color||'#ffb020'}"><button class="btn pri sm" data-ap="${d.id}">Approve + place turf</button><button class="btn sm" data-dn="${d.id}">Deny</button><button class="btn sm" data-dl="${d.id}">Delete</button></div></div>`}).join('')||'<p class="empty">Nothing here.</p>';
  document.querySelectorAll('[data-f]').forEach(e=>e.onclick=()=>{f=e.dataset.f;render()});
  document.querySelectorAll('[data-ap]').forEach(e=>e.onclick=()=>{if(!box)return alert('Click two corners on the map first');db.collection('threads').doc(e.dataset.ap).update({status:'approved',turf:box,color:$('#c'+e.dataset.ap).value})});
  document.querySelectorAll('[data-dn]').forEach(e=>e.onclick=()=>db.collection('threads').doc(e.dataset.dn).update({status:'denied'}));
  document.querySelectorAll('[data-dl]').forEach(e=>e.onclick=()=>confirm('Delete?')&&db.collection('threads').doc(e.dataset.dl).delete())};
 unsub&&unsub();unsub=db.collection('threads').orderBy('ts','desc').onSnapshot(s=>{docs=s.docs;render()})}
function route(){unsub&&unsub();unauth&&unauth();unsub=unauth=null;const k=location.hash.slice(2)||'home';(V[k]||V.home)();scrollTo(0,0)}
addEventListener('hashchange',route);route();
