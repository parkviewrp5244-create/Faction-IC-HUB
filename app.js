const C=CONFIG,$=s=>document.querySelector(s),A=$('#app');
let db,auth;const ok=C.firebase.apiKey&&!C.firebase.apiKey.startsWith('YOUR');
if(ok){firebase.initializeApp(C.firebase);db=firebase.firestore();auth=firebase.auth()}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const th=localStorage.t||'dark';document.documentElement.dataset.t=th;
function bar(back=1,adm=0){return `<div class="top">${back?'<a class="btn" href="#/">← Back to hub</a>':'<span></span>'}<span>
<button class="btn" onclick="tt()">${document.documentElement.dataset.t=='dark'?'Light':'Dark'} mode</button>${adm?' <a class="btn" href="#/admin">Management Login</a>':''}</span></div>`}
window.tt=()=>{const d=document.documentElement;d.dataset.t=localStorage.t=d.dataset.t=='dark'?'light':'dark';route()};
const noDb=()=>`<div class="card c">Backend not set up yet. Add your Firebase keys in <code>config.js</code> (see README).</div>`;
const V={
home(){A.innerHTML=`<div class="hero" style="background-image:linear-gradient(#000a,#000d),url(${C.bg})">${bar(0,1)}
<div class="mid"><img class="logo" src="${C.logo}" onerror="this.remove()"><h1>${esc(C.name)}</h1><p>${esc(C.tagline)}</p>
<div class="row"><a class="btn pri" href="#/roe">Browse Illegal Civ ROE</a><a class="btn" href="#/submit">Submit Thread Submissions</a><a class="btn" href="#/map">Look at Illegal Civ Turfs</a><a class="btn" href="#/spin">Weapon Spin</a></div></div><small class="foot">${esc(C.footer)}</small></div>`},
roe(){A.innerHTML=`<div class="wrap">${bar()}<h1 class="t">${esc(C.name)} ROE</h1><div class="grid">${C.roe.map((s,i)=>`<a class="card jump" href="#/roe" onclick="document.getElementById('s${i}').scrollIntoView({behavior:'smooth'});return false"><b>0${i+1}</b> ${esc(s.t)}</a>`).join('')}</div>
${C.roe.map((s,i)=>`<section class="card sec" id="s${i}"><b class="n">0${i+1}</b><h2>${esc(s.t)}</h2>${s.b}</section>`).join('')}</div>`},
async submit(){A.innerHTML=`<div class="wrap">${bar()}<div id="b"></div></div>`;const b=$('#b');if(!ok)return b.innerHTML=noDb();
 const id=localStorage.tid;if(id){try{const d=await db.collection('threads').doc(id).get();if(d.exists&&d.data().status!='denied'&&d.data().status!='approved'||d.exists&&d.data().seen!==1&&d.data().status!='pending'){const s=d.data();
 if(s.status=='pending')return b.innerHTML=`<div class="card c"><small class="o">YOUR THREAD STATUS</small><h2>Application under review</h2><p>Management is reviewing ${esc(s.group)}. You can submit another once this one is approved or denied.</p></div>`;
 b.innerHTML=`<div class="card c"><small class="o">YOUR THREAD STATUS</small><h2>${esc(s.group)} was ${s.status}</h2><p>${s.status=='approved'?'Check the turf map!':'You may submit a new thread.'}</p><button class="btn" id="n">Submit another</button></div>`;return $('#n').onclick=()=>{localStorage.removeItem('tid');V.submit()}}}catch(e){}}
 b.innerHTML=`<h1 class="t">Thread Submission</h1><form class="card" id="f"><label>Group name<input name="group" required></label><label>Borough<select name="borough">${C.boroughs.map(x=>`<option>${x}</option>`)}</select></label><label>Leader Discord<input name="discord" required></label><label>Thread link (optional)<input name="link"></label>
 ${C.questions.map((q,i)=>`<label>${esc(q)}<textarea name="q${i}" required rows="3"></textarea></label>`).join('')}<button class="btn pri">Submit thread</button></form>`;
 $('#f').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const r=await db.collection('threads').add({group:f.group,borough:f.borough,discord:f.discord,link:f.link,answers:C.questions.map((q,i)=>({q,a:f['q'+i]})),status:'pending',ts:Date.now()});localStorage.tid=r.id;V.submit()}},
async map(){A.innerHTML=`<div id="m"></div><div class="top fl">${bar().replace('class="top"','')}</div><div class="side card"><h3>Factions</h3><div id="L"></div></div>`;
 const H=C.map.h,W=C.map.w,m=L.map('m',{crs:L.CRS.Simple,minZoom:-3,maxZoom:2,zoomControl:true,attributionControl:false});const bd=[[0,0],[H,W]];L.imageOverlay(C.map.img,bd).addTo(m);m.fitBounds(bd);if(!ok)return $('#L').innerHTML='Backend not set up';
 const q=await db.collection('threads').where('status','==','approved').get();q.forEach(d=>{const s=d.data();if(!s.turf)return;const t=s.turf,r=L.rectangle([[H-t.y1,t.x1],[H-t.y2,t.x2]],{color:s.color,weight:2,fillOpacity:.45}).addTo(m).bindPopup(`<b>${esc(s.group)}</b><br>${esc(s.borough)}`);
 const a=document.createElement('a');a.className='fac';a.innerHTML=`<i style="background:${esc(s.color)}"></i>${esc(s.group)}<small>${esc(s.borough)}</small>`;a.onclick=()=>{m.fitBounds(r.getBounds(),{maxZoom:0});r.openPopup()};$('#L').append(a)})},
spin(){let ti=0,n=3,busy=0;const T=()=>C.tiers[ti];const card=w=>`<div class="wc r${w.r}"><span>${esc(w.n)}</span><img src="${esc(w.img)}" onerror="this.style.opacity=0"><b>${'★'.repeat(w.r)}</b></div>`;
 A.innerHTML=`<div class="wrap">${bar()}<small class="c o d">WEAPON SPIN</small><h1 class="t">SPIN FOR YOUR PIECE</h1><p class="c">Pick a tier, choose how many spins, and let it roll. Every gun in the tier has equal odds.</p><div class="grid3" id="ti"></div>
 <div class="card"><div class="vp"><div class="pin"></div><div id="rl"></div></div><div class="row c" id="ct"></div><div id="rs" class="c"></div></div>
 <h2 class="t">CAN DROP IN <span id="tn"></span></h2><div class="cat" id="cat"></div></div>`;
 const draw=()=>{$('#ti').innerHTML=C.tiers.map((t,i)=>`<div class="card tier ${i==ti?'on':''}" data-i="${i}"><b>${esc(t.name)}</b><small>${t.weapons.length} guns</small></div>`).join('');
 document.querySelectorAll('.tier').forEach(e=>e.onclick=()=>{ti=+e.dataset.i;draw()});$('#tn').textContent=T().name.toUpperCase();$('#cat').innerHTML=T().weapons.map(card).join('');
 $('#rl').innerHTML=[...Array(12)].map(()=>card(T().weapons[Math.random()*T().weapons.length|0])).join('');$('#rl').style.cssText='';$('#rs').innerHTML='';
 $('#ct').innerHTML=`<button class="btn" id="mi">−</button><span class="btn">${n}</span><button class="btn" id="pl">+</button>${C.spinAmounts.map(a=>`<button class="btn ${a==n?'on':''}" data-a="${a}">${a}</button>`).join('')}<button class="btn pri" id="go">SPIN ${n}×</button>`;
 $('#mi').onclick=()=>{n=Math.max(1,n-1);draw()};$('#pl').onclick=()=>{n=Math.min(100,n+1);draw()};document.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{n=+e.dataset.a;draw()});$('#go').onclick=go};
 const go=()=>{if(busy)return;busy=1;const t=T().weapons,res=[...Array(n)].map(()=>t[Math.random()*t.length|0]),w=res[n-1],rl=$('#rl');
 rl.style.transition='none';rl.style.transform='none';rl.innerHTML=[...Array(40)].map((_,i)=>card(i==32?w:t[Math.random()*t.length|0])).join('');$('#rs').innerHTML='';
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const off=32*160+72-rl.parentElement.clientWidth/2+(Math.random()*80-40);rl.style.transition='transform 4.5s cubic-bezier(.1,.7,.1,1)';rl.style.transform=`translateX(-${off}px)`}));
 setTimeout(()=>{const c={};res.forEach(x=>c[x.n]=(c[x.n]||[x,0])&&(c[x.n][1]++,c[x.n]));const o={};res.forEach(x=>{o[x.n]=o[x.n]||{x,k:0};o[x.n].k++});
 $('#rs').innerHTML=`<h3>Results (${n} spin${n>1?'s':''})</h3><div class="cat">${Object.values(o).map(v=>`<div>${card(v.x)}<p>×${v.k}</p></div>`).join('')}</div>`;busy=0},4700)};draw()},
admin(){A.innerHTML=`<div class="wrap">${bar()}<div id="b"></div></div>`;const b=$('#b');if(!ok)return b.innerHTML=noDb();
 auth.onAuthStateChanged(u=>{if(location.hash!='#/admin')return;if(!u)return b.innerHTML=`<form class="card c" id="lf"><h2>Management Login</h2><input name="e" type="email" placeholder="Email" required><input name="p" type="password" placeholder="Password" required><button class="btn pri">Log in</button><p id="er"></p></form>`,$('#lf').onsubmit=e=>{e.preventDefault();const f=e.target;auth.signInWithEmailAndPassword(f.e.value,f.p.value).catch(x=>$('#er').textContent=x.message)};panel(b)})},
};
function panel(b){let box=null,pv;b.innerHTML=`<button class="btn" onclick="auth.signOut()">Log out</button><h2>Place turf: click 2 corners on the map, then Approve a thread</h2><div id="am"></div><div id="th"></div>`;
 const H=C.map.h,W=C.map.w,m=L.map('am',{crs:L.CRS.Simple,minZoom:-3,maxZoom:2,attributionControl:false}),bd=[[0,0],[H,W]];L.imageOverlay(C.map.img,bd).addTo(m);m.fitBounds(bd);let p=[];
 m.on('click',e=>{p.push(e.latlng);if(p.length>2)p=[e.latlng];if(pv)pv.remove();if(p.length==2){pv=L.rectangle(p,{color:'#ff4d00'}).addTo(m);const[a,c]=p;box={x1:Math.round(Math.min(a.lng,c.lng)),x2:Math.round(Math.max(a.lng,c.lng)),y1:Math.round(H-Math.max(a.lat,c.lat)),y2:Math.round(H-Math.min(a.lat,c.lat))}}});
 db.collection('threads').orderBy('ts','desc').onSnapshot(s=>{$('#th').innerHTML=s.docs.map(d=>{const t=d.data();return `<div class="card"><b>${esc(t.group)}</b> · ${esc(t.borough)} · ${esc(t.discord)} · <i>${t.status}</i> ${t.link?`<a href="${esc(t.link)}" target="_blank">thread</a>`:''}<details><summary>Answers</summary>${(t.answers||[]).map(a=>`<p><b>${esc(a.q)}</b><br>${esc(a.a)}</p>`).join('')}</details>
 <input type="color" id="c${d.id}" value="${t.color||'#ff4d00'}"> <button class="btn pri" data-ap="${d.id}">Approve + place turf</button> <button class="btn" data-dn="${d.id}">Deny</button> <button class="btn" data-dl="${d.id}">Delete</button></div>`}).join('');
 document.querySelectorAll('[data-ap]').forEach(e=>e.onclick=()=>{if(!box)return alert('Click two corners on the map first');db.collection('threads').doc(e.dataset.ap).update({status:'approved',turf:box,color:$('#c'+e.dataset.ap).value})});
 document.querySelectorAll('[data-dn]').forEach(e=>e.onclick=()=>db.collection('threads').doc(e.dataset.dn).update({status:'denied'}));
 document.querySelectorAll('[data-dl]').forEach(e=>e.onclick=()=>confirm('Delete?')&&db.collection('threads').doc(e.dataset.dl).delete())})}
function route(){const k=location.hash.slice(2)||'home';(V[k]||V.home)();scrollTo(0,0)}
addEventListener('hashchange',route);route();
