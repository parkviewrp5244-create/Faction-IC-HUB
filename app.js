const C=CONFIG,$=s=>document.querySelector(s),A=$('#app');
let db,auth,unsub,unauth;const ok=C.firebase.apiKey&&!C.firebase.apiKey.startsWith('YOUR');
if(ok){firebase.initializeApp(C.firebase);db=firebase.firestore();auth=firebase.auth()}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// ===== EDIT THE WORDING OF THE PAGES HERE =====
const W={back:'← Home',
 roe:['RULEBOOK','Faction rulebook','Read every chapter before you run with a crew.','Chapters'],
 sub:['APPLICATION','Register your faction','Answer properly. Staff read every answer before your faction is accepted.','Send application'],
 st:['STATUS','Your application is in','Staff are looking at it. You can send another once this one is accepted or declined.'],
 spin:['WEAPON ROLL','Roll your weapon','Choose a tier, pick how many rolls, then hit roll. Every gun in a tier has the same chance. Each roll lands one gun and it drops into the box below.','Choose a tier','Landed guns','Nothing rolled yet. Your guns will land here.','Can drop in'],
 admin:['STAFF','Staff panel']};
const logo=c=>`<img class="logo ${c||''}" src="${esc(C.logo)}" onerror="this.remove()">`;
const page=(tag,title,sub,body)=>`<div class="pg"><header class="ph"><a class="pill" href="#/">${W.back}</a>${logo('xs')}</header><div class="hd"><small>${tag}</small><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div>${body}</div>`;
const noDb=()=>`<div class="box c">Backend not set up yet. Add your Firebase keys in <code>config.js</code>.</div>`;
const stat=(t,m,b='')=>page(W.st[0],t,m,b?`<div class="box">${b}</div>`:'');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const V={
home(){A.innerHTML=`<div class="hero" style="background-image:linear-gradient(#000b,#000e),url(${esc(C.bg)})"><div class="topbar hb"><span></span><div class="tc"><a class="btn" href="#/roe">Browse Faction ROE</a><a class="btn" href="#/submit">Submit Thread Submissions</a><a class="btn" href="#/spin">Weapon Spin</a></div><span class="tr"><a class="btn" href="#/admin">🔒 Management Login</a></span></div><div class="mid">${logo()}<h1>${esc(C.name)}</h1><p>${esc(C.tagline)}</p></div><small class="foot">${esc(C.footer)}</small></div>`},
roe(){A.innerHTML=page(W.roe[0],W.roe[1],W.roe[2],`<div class="chips">${C.roe.map((s,i)=>`<a class="chip" data-i="${i}"><b>${i+1}</b>${esc(s.t)}</a>`).join('')}</div>${C.roe.map((s,i)=>`<section class="box ch" id="s${i}"><div class="num">${i+1}</div><div><h2>${esc(s.t)}</h2><div class="body">${s.b}</div></div></section>`).join('')}`);
 document.querySelectorAll('.chip').forEach(a=>a.onclick=()=>document.getElementById('s'+a.dataset.i).scrollIntoView({behavior:'smooth'}))},
async submit(){A.innerHTML=page(W.sub[0],W.sub[1],W.sub[2],'<div id="b"></div>');const b=$('#b');if(!ok)return b.innerHTML=noDb();
 const id=localStorage.tid;
 if(id){try{const d=await db.collection('threads').doc(id).get();if(d.exists){const s=d.data();
  if(s.status=='pending')return A.innerHTML=stat(`${esc(s.group)} is being reviewed`,W.st[2]);
  A.innerHTML=stat(`${esc(s.group)} was ${s.status=='approved'?'accepted':'declined'}`,s.status=='approved'?'Staff accepted your faction.':'You can send in a new application.','<button class="go" id="n">Send another</button>');
  return $('#n').onclick=()=>{localStorage.removeItem('tid');V.submit()}}}catch(e){}}
 b.innerHTML=`<form id="f"><div class="box grid2"><label>Faction name<input name="group" required></label><label>Area<select name="borough">${C.boroughs.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><label>Leader Discord<input name="discord" required></label><label>Thread link (optional)<input name="link"></label></div>
 ${C.questions.map((q,i)=>`<div class="box"><label><span class="qn">${i+1}</span>${esc(q)}<textarea name="q${i}" required rows="3"></textarea></label></div>`).join('')}<button class="go">${W.sub[3]}</button></form>`;
 $('#f').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const r=await db.collection('threads').add({group:f.group,borough:f.borough,discord:f.discord,link:f.link,answers:C.questions.map((q,i)=>({q,a:f['q'+i]})),status:'pending',ts:Date.now()});localStorage.tid=r.id;V.submit()}},
spin(){let ti=0,n=3,busy=0;const T=()=>C.tiers[ti],S=W.spin;
 const card=w=>`<div class="wc r${w.r}"><span>${esc(w.n)}</span><img src="${esc(w.img)}" onerror="this.style.opacity=0"><b>${'★'.repeat(w.r)}</b></div>`;
 const saved=()=>{try{return JSON.parse(localStorage.pulls||'null')}catch(e){return null}};
 A.innerHTML=page(S[0],S[1],S[2],`<h3 class="sec">${S[3]}</h3><div class="tiers" id="ti"></div><div class="box"><div class="reelbox"><div class="pin"></div><div id="rl"></div></div><div class="ctlbar" id="ct"></div><p class="c mut" id="sc"></p></div>
 <div class="box"><h3 class="sec">${S[4]}</h3><div id="rs"></div></div><h3 class="sec">${S[6]} <span id="tn"></span></h3><div class="box cat" id="cat"></div>`);
 const draw=()=>{$('#ti').innerHTML=C.tiers.map((t,i)=>`<div class="tier ${i==ti?'on':''}" data-i="${i}"><div class="th"><b>${esc(t.name)}</b><small>${t.weapons.length} guns</small></div><div class="mini">${t.weapons.slice(0,5).map(w=>`<div class="r${w.r}"><img src="${esc(w.img)}" onerror="this.style.opacity=0"></div>`).join('')}</div></div>`).join('');
  document.querySelectorAll('.tier').forEach(e=>e.onclick=()=>{if(busy)return;ti=+e.dataset.i;draw()});$('#tn').textContent=T().name;$('#cat').innerHTML=T().weapons.map(card).join('');
  const rl=$('#rl');rl.style.cssText='';rl.innerHTML=[...Array(12)].map(()=>card(T().weapons[Math.random()*T().weapons.length|0])).join('');
  $('#ct').innerHTML=`<div class="stepper"><button id="mi">−</button><span>${n}</span><button id="pl">+</button></div><div class="seg">${C.spinAmounts.map(a=>`<button class="${a==n?'on':''}" data-a="${a}">${a}</button>`).join('')}</div><button class="go auto" id="go">ROLL ${n}×</button>`;
  $('#mi').onclick=()=>{if(!busy){n=Math.max(1,n-1);draw()}};$('#pl').onclick=()=>{if(!busy){n=Math.min(100,n+1);draw()}};document.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{if(!busy){n=+e.dataset.a;draw()}});$('#go').onclick=go};
 const pulls=(fresh=-1)=>{const s=saved(),el=$('#rs'),tr=s&&C.tiers[s.tier];if(!tr||!s.names.length)return el.innerHTML=`<p class="empty">${S[5]}</p>`;
  const l=s.names.map(x=>tr.weapons.find(w=>w.n==x)).filter(Boolean);el.innerHTML=`<p class="mut">${esc(tr.name)} · ${l.length} gun${l.length>1?'s':''}</p><div class="cat">${l.map((w,i)=>`<div class="pl ${i==fresh?'new':''}">${card(w)}<i>#${i+1}</i></div>`).join('')}</div>`};
 const go=async()=>{if(busy)return;busy=1;const t=T().weapons,rl=$('#rl'),names=[],dur=n==1?4.5:n<=5?2.6:n<=10?1.8:1.2;
  localStorage.pulls=JSON.stringify({tier:ti,names:[]});pulls();
  for(let i=0;i<n;i++){if(!document.body.contains(rl))return;const w=t[Math.random()*t.length|0];$('#sc').textContent=`Roll ${i+1} of ${n}`;
   rl.style.transition='none';rl.style.transform='none';rl.innerHTML=[...Array(40)].map((_,j)=>card(j==32?w:t[Math.random()*t.length|0])).join('');
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const off=32*160+72-rl.parentElement.clientWidth/2+(Math.random()*80-40);rl.style.transition=`transform ${dur}s cubic-bezier(.1,.7,.1,1)`;rl.style.transform=`translateX(-${off}px)`;
   await sleep(dur*1000+150);if(!document.body.contains(rl))return;names.push(w.n);localStorage.pulls=JSON.stringify({tier:ti,names});pulls(names.length-1);await sleep(350)}
  $('#sc').textContent=`Done · ${n} gun${n>1?'s':''} landed`;busy=0};
 const s0=saved();if(s0&&C.tiers[s0.tier])ti=s0.tier;draw();pulls()},
admin(){A.innerHTML=page(W.admin[0],W.admin[1],'','<div id="b"></div>');const b=$('#b');if(!ok)return b.innerHTML=noDb();
 unauth=auth.onAuthStateChanged(u=>{if(u)return panel(b);unsub&&unsub();b.innerHTML=`<form class="box narrow c" id="lf"><h2>Staff login</h2><input name="e" type="email" placeholder="Email" required><input name="p" type="password" placeholder="Password" required><button class="go">Log in</button><p id="er" class="mut"></p></form>`;
  $('#lf').onsubmit=e=>{e.preventDefault();const f=e.target;auth.signInWithEmailAndPassword(f.e.value,f.p.value).catch(x=>$('#er').textContent=x.message)}})}
};
function panel(b){let box=null,pv,f='pending',docs=[],p=[];const LB={pending:'Waiting',approved:'Accepted',denied:'Declined'};
 b.innerHTML=`<div class="rh"><p class="mut">Read each application, then accept or decline it.</p><button class="pill" onclick="auth.signOut()">Log out</button></div><div class="tabs" id="ft"></div><div id="th"></div>`;
 const render=()=>{$('#ft').innerHTML=Object.keys(LB).map(s=>`<button class="tab ${s==f?'on':''}" data-f="${s}">${LB[s]} <small>${docs.filter(d=>d.data().status==s).length}</small></button>`).join('');
  $('#th').innerHTML=docs.filter(d=>d.data().status==f).map(d=>{const t=d.data();return `<div class="box"><b>${esc(t.group)}</b> · ${esc(t.borough)} · ${esc(t.discord)} ${t.link?`· <a href="${esc(t.link)}" target="_blank">thread</a>`:''}<details><summary>Answers</summary>${(t.answers||[]).map(a=>`<p><b>${esc(a.q)}</b><br>${esc(a.a)}</p>`).join('')}</details>
  <div class="row"><button class="go auto sm" data-ap="${d.id}">Accept</button><button class="pill" data-dn="${d.id}">Decline</button><button class="pill" data-dl="${d.id}">Delete</button></div></div>`}).join('')||'<p class="empty">Nothing here.</p>';
  document.querySelectorAll('[data-f]').forEach(e=>e.onclick=()=>{f=e.dataset.f;render()});
  document.querySelectorAll('[data-ap]').forEach(e=>e.onclick=()=>db.collection('threads').doc(e.dataset.ap).update({status:'approved'}));
  document.querySelectorAll('[data-dn]').forEach(e=>e.onclick=()=>db.collection('threads').doc(e.dataset.dn).update({status:'denied'}));
  document.querySelectorAll('[data-dl]').forEach(e=>e.onclick=()=>confirm('Delete?')&&db.collection('threads').doc(e.dataset.dl).delete())};
 unsub&&unsub();unsub=db.collection('threads').orderBy('ts','desc').onSnapshot(s=>{docs=s.docs;render()})}
function route(){unsub&&unsub();unauth&&unauth();unsub=unauth=null;const k=location.hash.slice(2)||'home';(V[k]||V.home)();scrollTo(0,0)}
addEventListener('hashchange',route);route();
