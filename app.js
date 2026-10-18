const C=CONFIG,$=s=>document.querySelector(s),A=$('#app');
let db,auth,unsub,unauth;const ok=C.firebase.apiKey&&!C.firebase.apiKey.startsWith('YOUR');
if(ok){firebase.initializeApp(C.firebase);db=firebase.firestore();auth=firebase.auth()}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.documentElement.dataset.t=localStorage.t||'dark';
const lm=()=>document.documentElement.dataset.t=='dark'?'☀ Light mode':'☾ Dark mode';
window.tt=()=>{const d=document.documentElement;d.dataset.t=localStorage.t=d.dataset.t=='dark'?'light':'dark';document.querySelectorAll('.tmb').forEach(b=>b.textContent=lm())};
const bar=(back=1,x='')=>`<div class="topbar">${back?'<a class="btn" href="#/">← Back to hub</a>':'<span></span>'}<span class="tr">${x}<button class="btn tmb" onclick="tt()">${lm()}</button></span></div>`;
const logo=c=>`<img class="logo ${c||''}" src="${esc(C.logo)}" onerror="this.remove()">`;
const noDb=()=>`<div class="card center">Backend not set up yet. Add your Firebase keys in <code>config.js</code>.</div>`;
const stat=(t,m,b='')=>`<div class="mid2"><div class="card stat center"><div class="ic">⇪</div><small class="o">YOUR THREAD STATUS</small><h2>${t}</h2><p class="m">${m}</p>${b||'<a class="btn" href="#/">Back to hub</a>'}</div></div>`;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const V={
home(){A.innerHTML=`<div class="hero" style="background-image:linear-gradient(#000b,#000e),url(${esc(C.bg)})">${bar(0,'<a class="btn" href="#/admin">🔒 Management Login</a>')}<div class="mid">${logo()}<h1>${esc(C.name)}</h1><p>${esc(C.tagline)}</p>
 <div class="row"><a class="btn pri" href="#/roe">Browse Illegal Civ ROE</a><a class="btn" href="#/submit">Submit Thread Submissions</a><a class="btn" href="#/map">Look at Illegal Civ Turfs</a><a class="btn" href="#/spin">Weapon Spin</a></div></div><small class="foot">${esc(C.footer)}</small></div>`},
roe(){A.innerHTML=`<div class="wrap">${bar()}<div class="center">${logo('sm')}<h1 class="disp">${esc(C.name)}<br>ROE</h1><small class="m jt">JUMP TO SECTION</small></div>
 <div class="grid2">${C.roe.map((s,i)=>`<a class="card jump" href="#/roe" data-i="${i}"><b>0${i+1}</b> ${esc(s.t)}</a>`).join('')}</div>
 <select id="jd">${C.roe.map((s,i)=>`<option value="${i}">0${i+1}  ${esc(s.t)}</option>`).join('')}</select>
 ${C.roe.map((s,i)=>`<section class="card sec" id="s${i}"><b class="n">0${i+1}</b><h2 class="disp">${esc(s.t)}</h2><hr>${s.b}</section>`).join('')}</div>`;
 const go=i=>document.getElementById('s'+i).scrollIntoView({behavior:'smooth'});document.querySelectorAll('.jump').forEach(a=>a.onclick=e=>{e.preventDefault();go(a.dataset.i)});$('#jd').onchange=e=>go(e.target.value)},
async submit(){A.innerHTML=`<div class="wrap">${bar()}<div id="b"></div></div>`;const b=$('#b');if(!ok)return b.innerHTML=noDb();
 const id=localStorage.tid;
 if(id){try{const d=await db.collection('threads').doc(id).get();if(d.exists){const s=d.data();
  if(s.status=='pending')return A.innerHTML=stat('Application under review',`Illegal Civ Management is reviewing ${esc(s.group)}. You can submit another application once this one is approved or denied.`);
  A.innerHTML=stat(`${esc(s.group)} was ${s.status}`,s.status=='approved'?'Check the turf map!':'You can send in a new thread.','<button class="btn pri" id="n">Submit another</button>');
  return $('#n').onclick=()=>{localStorage.removeItem('tid');V.submit()}}}catch(e){}}
 b.innerHTML=`<div class="center">${logo('sm')}<h1 class="disp">Thread<br>Submission</h1></div><form id="f" class="card"><div class="grid2"><label>Group name<input name="group" required></label><label>Borough<select name="borough">${C.boroughs.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>Leader Discord<input name="discord" required></label><label>Thread link (optional)<input name="link"></label></div>
 ${C.questions.map((q,i)=>`<label><span class="o">0${i+1}</span> ${esc(q)}<textarea name="q${i}" required rows="3"></textarea></label>`).join('')}<button class="btn pri big">Submit thread</button></form>`;
 $('#f').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const r=await db.collection('threads').add({group:f.group,borough:f.borough,discord:f.discord,link:f.link,answers:C.questions.map((q,i)=>({q,a:f['q'+i]})),status:'pending',ts:Date.now()});localStorage.tid=r.id;V.submit()}},
async map(){A.innerHTML=`<div id="m"></div><div class="mfl"><a class="btn" href="#/">← Back to hub</a><button class="btn tmb" onclick="tt()">${lm()}</button></div>
 <aside class="side card"><div class="sh">${logo('xs')}<b>${esc(C.mapTitle||C.name)}</b></div><input id="sr" placeholder="Search regions..."><label class="tg">Labels<input type="checkbox" id="lb"></label><label class="fh"><span><input type="checkbox" id="fa" checked> Factions <small id="fc"></small></span><u id="fx">⌄</u></label><div id="L"></div></aside>`;
 const H=C.map.h,W=C.map.w,m=L.map('m',{crs:L.CRS.Simple,minZoom:-3,maxZoom:2,zoomControl:false,attributionControl:false});L.control.zoom({position:'bottomleft'}).addTo(m);const bd=[[0,0],[H,W]];L.imageOverlay(C.map.img,bd).addTo(m);const st=C.map.start;st?m.setView([H-st.y,st.x],st.zoom??0):m.fitBounds(bd);
 const pop=s=>{const im=(s.images||[]).filter(Boolean);return `<div class="pp"><b>${esc(s.group)}</b><small>${esc(s.borough)}</small>${im.length?`<img class="big" src="${esc(im[0])}"><div class="thm">${im.map((u,i)=>`<img src="${esc(u)}" data-u="${esc(u)}" class="${i?'':'on'}">`).join('')}</div>`:''}<div class="pf">${s.coords?`<button class="btn sm cc" data-c="${esc(s.coords)}">Copy Coords</button>`:'<span></span>'}<button class="lk" title="Copy link">🔗</button></div></div>`};
 m.on('popupopen',e=>{const p=e.popup.getElement();p.querySelectorAll('.thm img').forEach(t=>t.onclick=()=>{p.querySelector('.big').src=t.dataset.u;p.querySelectorAll('.thm img').forEach(x=>x.classList.remove('on'));t.classList.add('on')});const cc=p.querySelector('.cc');if(cc)cc.onclick=()=>{navigator.clipboard.writeText(cc.dataset.c);cc.textContent='Copied!'};p.querySelector('.lk').onclick=()=>navigator.clipboard.writeText(location.href)});
 if(!ok)return $('#L').innerHTML='<p class="m">Backend not set up</p>';
 const R=[],rows=[];const q=await db.collection('threads').where('status','==','approved').get();
 q.forEach(d=>{const s=d.data();if(!s.turf)return;const t=s.turf,r=L.rectangle([[H-t.y1,t.x1],[H-t.y2,t.x2]],{color:s.color,weight:2,fillOpacity:.45}).addTo(m).bindPopup(pop(s),{minWidth:300,maxWidth:300});R.push([r,s]);
  const a=document.createElement('a');a.className='fac';a.innerHTML=`<i style="background:${esc(s.color)}"></i><span>${esc(s.group)}</span><small>${esc(s.borough)}</small>`;
  a.onclick=()=>{rows.forEach(x=>x.classList.remove('on'));a.classList.add('on');m.fitBounds(r.getBounds(),{maxZoom:0});r.openPopup()};r.on('click',()=>{rows.forEach(x=>x.classList.remove('on'));a.classList.add('on')});rows.push(a);$('#L').append(a)});
 $('#fc').textContent=R.length;
 $('#sr').oninput=e=>rows.forEach(a=>a.style.display=a.textContent.toLowerCase().includes(e.target.value.toLowerCase())?'':'none');
 $('#lb').onchange=e=>R.forEach(([r,s])=>e.target.checked?r.bindTooltip(esc(s.group),{permanent:true,direction:'center',className:'lbl'}):r.unbindTooltip());
 $('#fa').onchange=e=>R.forEach(([r])=>e.target.checked?r.addTo(m):r.remove());
 $('#fx').onclick=()=>$('#L').classList.toggle('hid')},
spin(){let ti=0,n=3,busy=0;const T=()=>C.tiers[ti],TC=['#aab','#3d9a16','#1b78c4'];
 const card=w=>`<div class="wc r${w.r}"><span>${esc(w.n)}</span><img src="${esc(w.img)}" onerror="this.style.opacity=0"><b>${'★'.repeat(w.r)}</b></div>`;
 const saved=()=>{try{return JSON.parse(localStorage.pulls||'null')}catch(e){return null}};
 A.innerHTML=`<div class="wrap">${bar()}<div class="center"><small class="m jt">WEAPON SPIN</small><h1 class="disp">Spin for your <em>piece</em></h1><p class="m">Pick a tier, choose how many spins, and let it roll. Every gun in the tier has equal odds. Each spin lands one gun and it drops into your pulls below.</p></div>
 <div class="grid3" id="ti"></div><div class="card"><div class="vp"><div class="pin"></div><div id="rl"></div></div><div class="ctl" id="ct"></div><p class="center m" id="sc"></p></div>
 <section class="card"><h3>Your pulls</h3><div id="rs"></div></section><div class="center"><small class="m jt">WEAPON CATALOG</small><h2 class="disp">Can drop in <span id="tn"></span></h2></div><div class="cat" id="cat"></div></div>`;
 const draw=()=>{$('#ti').innerHTML=C.tiers.map((t,i)=>`<div class="card tier ${i==ti?'on':''}" data-i="${i}" style="border-top-color:${TC[i%3]}"><div class="th"><b>${esc(t.name)}</b><small>${t.weapons.length} guns</small></div><div class="mini">${t.weapons.slice(0,5).map(w=>`<div class="r${w.r}"><img src="${esc(w.img)}" onerror="this.style.opacity=0"></div>`).join('')}</div></div>`).join('');
  document.querySelectorAll('.tier').forEach(e=>e.onclick=()=>{if(busy)return;ti=+e.dataset.i;draw()});$('#tn').textContent=T().name.toUpperCase();$('#cat').innerHTML=T().weapons.map(card).join('');
  const rl=$('#rl');rl.style.cssText='';rl.innerHTML=[...Array(12)].map(()=>card(T().weapons[Math.random()*T().weapons.length|0])).join('');
  $('#ct').innerHTML=`<button class="btn" id="mi">−</button><span class="btn num">${n}</span><button class="btn" id="pl">+</button>${C.spinAmounts.map(a=>`<button class="btn ${a==n?'on':''}" data-a="${a}">${a}</button>`).join('')}<button class="btn spinbtn" id="go">⚄ SPIN ${n}×</button>`;
  $('#mi').onclick=()=>{if(!busy){n=Math.max(1,n-1);draw()}};$('#pl').onclick=()=>{if(!busy){n=Math.min(100,n+1);draw()}};document.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{if(!busy){n=+e.dataset.a;draw()}});$('#go').onclick=go};
 const pulls=(fresh=-1)=>{const s=saved(),el=$('#rs'),tr=s&&C.tiers[s.tier];if(!tr||!s.names.length)return el.innerHTML='<p class="empty">No pulls yet. Hit spin and every gun you land shows up here.</p>';
  const l=s.names.map(x=>tr.weapons.find(w=>w.n==x)).filter(Boolean);el.innerHTML=`<p class="m">${esc(tr.name)} · ${l.length} gun${l.length>1?'s':''}</p><div class="cat">${l.map((w,i)=>`<div class="pl ${i==fresh?'new':''}">${card(w)}<i>#${i+1}</i></div>`).join('')}</div>`};
 const go=async()=>{if(busy)return;busy=1;const t=T().weapons,rl=$('#rl'),names=[],dur=n==1?4.5:n<=5?2.6:n<=10?1.8:1.2;
  localStorage.pulls=JSON.stringify({tier:ti,names:[]});pulls();
  for(let i=0;i<n;i++){if(!document.body.contains(rl))return;const w=t[Math.random()*t.length|0];$('#sc').textContent=`Spin ${i+1} of ${n}`;
   rl.style.transition='none';rl.style.transform='none';rl.innerHTML=[...Array(40)].map((_,j)=>card(j==32?w:t[Math.random()*t.length|0])).join('');
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const off=32*160+72-rl.parentElement.clientWidth/2+(Math.random()*80-40);rl.style.transition=`transform ${dur}s cubic-bezier(.1,.7,.1,1)`;rl.style.transform=`translateX(-${off}px)`;
   await sleep(dur*1000+150);if(!document.body.contains(rl))return;names.push(w.n);localStorage.pulls=JSON.stringify({tier:ti,names});pulls(names.length-1);await sleep(350)}
  $('#sc').textContent=`Done · ${n} gun${n>1?'s':''} pulled`;busy=0};
 const s0=saved();if(s0&&C.tiers[s0.tier])ti=s0.tier;draw();pulls()},
admin(){A.innerHTML=`<div class="wrap">${bar()}<div id="b"></div></div>`;const b=$('#b');if(!ok)return b.innerHTML=noDb();
 unauth=auth.onAuthStateChanged(u=>{if(u)return panel(b);unsub&&unsub();b.innerHTML=`<form class="card narrow center" id="lf"><h2>Management Login</h2><input name="e" type="email" placeholder="Email" required><input name="p" type="password" placeholder="Password" required><button class="btn pri">Log in</button><p id="er" class="m"></p></form>`;
  $('#lf').onsubmit=e=>{e.preventDefault();const f=e.target;auth.signInWithEmailAndPassword(f.e.value,f.p.value).catch(x=>$('#er').textContent=x.message)}})}
};
function panel(b){let box=null,pv,f='pending',docs=[],p=[];
 b.innerHTML=`<div class="rh"><h1 class="disp">Management</h1><button class="btn sm" onclick="auth.signOut()">Log out</button></div><p class="m">Click two corners on the map to draw a turf, then approve a thread.</p><div id="am"></div><div class="tabs" id="ft"></div><div id="th"></div>`;
 const H=C.map.h,W=C.map.w,m=L.map('am',{crs:L.CRS.Simple,minZoom:-3,maxZoom:2,attributionControl:false}),bd=[[0,0],[H,W]];L.imageOverlay(C.map.img,bd).addTo(m);m.fitBounds(bd);
 m.on('click',e=>{p.push(e.latlng);if(p.length>2)p=[e.latlng];if(pv)pv.remove();if(p.length==2){pv=L.rectangle(p,{color:'#ff4d00'}).addTo(m);const[a,c]=p;box={x1:Math.round(Math.min(a.lng,c.lng)),x2:Math.round(Math.max(a.lng,c.lng)),y1:Math.round(H-Math.max(a.lat,c.lat)),y2:Math.round(H-Math.min(a.lat,c.lat))}}});
 const render=()=>{$('#ft').innerHTML=['pending','approved','denied'].map(s=>`<button class="tab ${s==f?'on':''}" data-f="${s}">${s} <small>${docs.filter(d=>d.data().status==s).length}</small></button>`).join('');
  $('#th').innerHTML=docs.filter(d=>d.data().status==f).map(d=>{const t=d.data();return `<div class="card"><b>${esc(t.group)}</b> · ${esc(t.borough)} · ${esc(t.discord)} ${t.link?`· <a href="${esc(t.link)}" target="_blank">thread</a>`:''}<details><summary>Answers</summary>${(t.answers||[]).map(a=>`<p><b>${esc(a.q)}</b><br>${esc(a.a)}</p>`).join('')}</details>
  <textarea id="i${d.id}" rows="3" placeholder="Turf image links, one per line (max 3)">${esc((t.images||[]).join('\n'))}</textarea><input id="k${d.id}" placeholder="Coords e.g. 123.4, -456.7, 30.0" value="${esc(t.coords||'')}">
  <div class="row"><input type="color" id="c${d.id}" value="${t.color||'#ff4d00'}"><button class="btn pri sm" data-ap="${d.id}">Approve + place turf</button><button class="btn sm" data-dn="${d.id}">Deny</button><button class="btn sm" data-dl="${d.id}">Delete</button></div></div>`}).join('')||'<p class="empty">Nothing here.</p>';
  document.querySelectorAll('[data-f]').forEach(e=>e.onclick=()=>{f=e.dataset.f;render()});
  document.querySelectorAll('[data-ap]').forEach(e=>e.onclick=()=>{const id=e.dataset.ap,turf=box||docs.find(x=>x.id==id).data().turf;if(!turf)return alert('Click two corners on the map first');db.collection('threads').doc(id).update({status:'approved',turf,color:$('#c'+id).value,images:$('#i'+id).value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,3),coords:$('#k'+id).value.trim()})});
  document.querySelectorAll('[data-dn]').forEach(e=>e.onclick=()=>db.collection('threads').doc(e.dataset.dn).update({status:'denied'}));
  document.querySelectorAll('[data-dl]').forEach(e=>e.onclick=()=>confirm('Delete?')&&db.collection('threads').doc(e.dataset.dl).delete())};
 unsub&&unsub();unsub=db.collection('threads').orderBy('ts','desc').onSnapshot(s=>{docs=s.docs;render()})}
function route(){unsub&&unsub();unauth&&unauth();unsub=unauth=null;const k=location.hash.slice(2)||'home';(V[k]||V.home)();scrollTo(0,0)}
addEventListener('hashchange',route);route();
