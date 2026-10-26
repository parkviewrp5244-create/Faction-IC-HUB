(()=>{
const E=esc,host=location.hostname,rdy=()=>new Promise(r=>{const u=auth.onAuthStateChanged(x=>{u();r(x)})});
const isStaff=async()=>{await rdy();return !!(auth.currentUser&&auth.currentUser.email)};
const ago=t=>{const s=(Date.now()-t)/1e3;return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':s<86400?Math.floor(s/3600)+'h ago':new Date(t).toLocaleDateString()};
const fmt=s=>E(s).replace(/(https:\/\/[^\s<]+)/g,u=>`<a href="${u}" target="_blank" rel="noopener">${u}</a>`).replace(/\n/g,'<br>');
const ext=(u,a)=>new RegExp('\\.('+a+')(\\?|#|$)','i').test(u);
function embed(u){u=String(u).trim();if(/^data:image\/jpeg;base64,/.test(u))return `<img class="mi" src="${E(u)}">`;if(!/^https:\/\//i.test(u))return'';let m;const e=E(u);
 const fr=s=>`<div><div class="mv"><iframe src="${E(s)}" loading="lazy" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><a class="srcl" href="${e}" target="_blank" rel="noopener">Open original ↗</a></div>`;
 if(m=u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|live\/|embed\/)|youtu\.be\/)([\w-]{11})/i))return fr('https://www.youtube.com/embed/'+m[1]);
 if(m=u.match(/twitch\.tv\/videos\/(\d+)/i))return fr(`https://player.twitch.tv/?video=${m[1]}&parent=${host}&autoplay=false`);
 if(m=u.match(/clips\.twitch\.tv\/([\w-]+)|twitch\.tv\/\w+\/clip\/([\w-]+)/i))return fr(`https://clips.twitch.tv/embed?clip=${m[1]||m[2]}&parent=${host}&autoplay=false`);
 if(m=u.match(/twitch\.tv\/(\w+)\/?(?:\?.*)?$/i))return fr(`https://player.twitch.tv/?channel=${m[1]}&parent=${host}&autoplay=false`);
 if(m=u.match(/kick\.com\/video\/([\w-]+)/i))return fr('https://player.kick.com/video/'+m[1]);
 m=u.match(/kick\.com\/(\w+)\/?(?:\?.*)?$/i);if(m&&!/^(video|categories|clips)$/i.test(m[1]))return fr('https://player.kick.com/'+m[1]);
 if(m=u.match(/streamable\.com\/(?:e\/|o\/)?(\w+)/i))return fr('https://streamable.com/e/'+m[1]);
 if(ext(u,'mp4|webm|mov|ogg|gifv'))return `<video class="mv2" controls preload="metadata" src="${E(u.replace(/\.gifv/i,'.mp4'))}"></video>`;
 if(ext(u,'png|jpe?g|gif|webp|avif'))return `<a href="${e}" target="_blank" rel="noopener"><img class="mi" loading="lazy" src="${e}"></a>`;
 if(m=u.match(/^https:\/\/(?:www\.)?imgur\.com\/(\w{5,8})$/i))return `<a href="${e}" target="_blank" rel="noopener"><img class="mi" loading="lazy" src="https://i.imgur.com/${m[1]}.jpg"></a>`;
 return `<a class="lc" href="${e}" target="_blank" rel="noopener">🔗 ${E(u.replace(/^https:\/\/(www\.)?/,'').slice(0,60))}</a>`}
const rs=f=>new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,1280/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(f)});
async function up(f){const K=C.cloudinary||{};if(K.cloud&&K.preset){const fd=new FormData();fd.append('file',f);fd.append('upload_preset',K.preset);const r=await(await fetch(`https://api.cloudinary.com/v1_1/${K.cloud}/auto/upload`,{method:'POST',body:fd})).json();if(!r.secure_url)throw new Error((r.error&&r.error.message)||'Upload failed');return r.secure_url}
 if(f.type.startsWith('image/'))return rs(f);throw new Error('Video uploads need Cloudinary set up. Paste a link instead.')}
const q$=s=>document.querySelector(s),pg=(tag,title,sub,body)=>A.innerHTML=page(tag,title,sub,body);
async function list(){if(!ok)return pg('THREADS','Threads','',noDb());const st=await isStaff();
 const cs=(await db.collection('tchannels').get()).docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>a.order-b.order);
 pg('THREADS','Faction activity','Pick a channel to see what factions have been up to, or post your own.',`${st?'<div class="tabs"><span class="tg hot">Staff</span><button class="tab" data-x="out">Log out</button></div>':'<p class="m"><a href="#/threads/staff">Staff login</a></p>'}
 <div class="chg">${cs.map(c=>`<div class="box chc"><a class="chl" href="#/threads/c/${c.id}"><i>${E(c.icon||'💬')}</i><div><b>${E(c.name)}</b>${c.mod?'<span class="tg">Approval</span>':''}<p>${E(c.desc||'')}</p></div></a>${st?`<div class="cmd"><button class="tab" data-x="cren" data-id="${c.id}">Rename</button><button class="tab" data-x="cmod" data-id="${c.id}">${c.mod?'No approval':'Approval'}</button><button class="tab" data-x="cdel" data-id="${c.id}">Delete</button></div>`:''}</div>`).join('')||'<div class="box c m">No channels yet.</div>'}</div>
 ${st?'<form class="box" id="tchan"><h3>New channel</h3><div class="grid2"><label>Name<input name="na" required maxlength="40" placeholder="Faction Clips"></label><label>Icon (emoji)<input name="ic" maxlength="4" placeholder="🎬"></label></div><label>Description<input name="de" maxlength="120"></label><label><input type="checkbox" name="mo"> New posts need staff approval</label><button class="go auto sm">Create channel</button></form>':''}`)}
async function chan(id){if(!ok)return pg('THREADS','Threads','',noDb());const st=await isStaff(),cd=await db.collection('tchannels').doc(id).get();if(!cd.exists)return pg('THREADS','Not found','','<a class="pill" href="#/threads">← All channels</a>');const c=cd.data();
 const all=(await db.collection('tposts').where('ch','==',id).get()).docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||b.ts-a.ts).filter(p=>st||p.ok!==false);let n=20;
 const K=C.cloudinary||{},vid=K.cloud&&K.preset;
 const card=p=>`<article class="box tp">${p.pinned?'<span class="tg hot">Pinned</span>':''}${p.ok===false?'<span class="tg">Waiting for approval</span>':''}<h3>${E(p.title)}</h3><small class="m">${E(p.fac?p.fac+' · ':'')}${E(p.name)} · ${ago(p.ts)}</small>${p.body?`<p>${fmt(p.body)}</p>`:''}<div class="media">${(p.media||[]).map(embed).join('')}</div>${st?`<div class="tabs">${p.ok===false?`<button class="tab" data-x="pok" data-id="${p.id}">Approve</button>`:''}<button class="tab" data-x="ppin" data-id="${p.id}">${p.pinned?'Unpin':'Pin'}</button><button class="tab" data-x="pdel" data-id="${p.id}">Delete</button></div>`:''}</article>`;
 pg('THREADS',`${E(c.icon||'💬')} ${E(c.name)}`,E(c.desc||''),`<p><a class="pill" href="#/threads">← All channels</a></p>
 <details class="box"><summary><b>Post in this channel</b></summary><form id="tnew" data-c="${id}" data-m="${c.mod?1:0}"><div class="grid2"><label>Your name<input name="na" required maxlength="40" value="${E(localStorage.tname||'')}"></label><label>Faction / group<input name="fa" maxlength="60" value="${E(localStorage.tfac||'')}"></label></div><label>Title<input name="ti" required maxlength="120"></label><label>Description<textarea name="bo" rows="3" maxlength="3000"></textarea></label>
 <label>Upload ${vid?'images or videos':'images'}<input type="file" name="fi" multiple accept="${vid?'image/*,video/*':'image/*'}"></label><label>Links (one per line): YouTube, Twitch, Kick, Streamable, Imgur, FiveManage<textarea name="li" rows="3" placeholder="https://streamable.com/..."></textarea></label><p class="m" id="tmsg">${c.mod?'Your post will appear once staff approve it.':''}</p><button class="go auto">Post</button></form></details>
 <div id="tl"></div>`);
 const draw=()=>{q$('#tl').innerHTML=all.slice(0,n).map(card).join('')||'<div class="box c m">No posts yet. Be the first!</div>'+(all.length>n?'<div class="c"><button class="pill" data-x="more">Show more</button></div>':'');if(all.length>n)q$('#tl').insertAdjacentHTML('beforeend','<div class="c"><button class="pill" data-x="more">Show more</button></div>')};
 window.__tmore=()=>{n+=20;draw()};draw()}
async function login(){pg('THREADS','Staff login','','<form class="box narrow c" id="tstaff"><input name="e" type="email" placeholder="Email" required><input name="p" type="password" placeholder="Password" required><button class="go">Log in</button><p id="er" class="m"></p></form>')}
V.threads=()=>{const p=location.hash.slice(2).split('?')[0].split('/');p[1]=='c'?chan(p[2]):p[1]=='staff'?login():list()};
async function delCh(id){const ps=await db.collection('tposts').where('ch','==',id).get();for(let i=0;i<ps.docs.length;i+=400){const b=db.batch();ps.docs.slice(i,i+400).forEach(p=>b.delete(p.ref));await b.commit()}await db.collection('tchannels').doc(id).delete()}
const tog=async(c,id,f)=>{const r=db.collection(c).doc(id),d=(await r.get()).data();await r.update({[f]:!d[f]});route()};
A.addEventListener('click',async e=>{const t=e.target.closest('[data-x]');if(!t)return;const x=t.dataset.x,id=t.dataset.id;
 if(x=='more')window.__tmore();else if(x=='out'){await auth.signOut();route()}
 else if(x=='cren'){const n=prompt('New channel name');if(n){await db.collection('tchannels').doc(id).update({name:n.slice(0,40)});route()}}
 else if(x=='cmod')tog('tchannels',id,'mod');
 else if(x=='cdel'){if(confirm('Delete this channel and all its posts?')){await delCh(id);route()}}
 else if(x=='ppin')tog('tposts',id,'pinned');
 else if(x=='pok'){await db.collection('tposts').doc(id).update({ok:true});route()}
 else if(x=='pdel'){if(confirm('Delete this post?')){await db.collection('tposts').doc(id).delete();route()}}});
const FORMS={async tchan(f){await db.collection('tchannels').add({name:f.na.value.trim(),icon:f.ic.value.trim(),desc:f.de.value.trim(),mod:f.mo.checked,order:Date.now()});route()},
 tstaff(f){auth.signInWithEmailAndPassword(f.e.value,f.p.value).then(()=>location.hash='#/threads').catch(x=>q$('#er').textContent=x.message)},
 async tnew(f){const msg=q$('#tmsg'),btn=f.querySelector('button');btn.disabled=true;
  try{const media=[];for(const file of f.fi.files){msg.textContent='Uploading '+file.name+'…';media.push(await up(file))}
   const body=f.bo.value;[...f.li.value.split('\n'),...(body.match(/https:\/\/\S+/g)||[])].map(s=>s.trim()).filter(s=>/^https:\/\//i.test(s)).forEach(s=>{if(!media.includes(s))media.push(s)});
   if(!body.trim()&&!media.length)throw new Error('Add a description, an image or a link.');if(media.length>10)throw new Error('Maximum 10 images or links per post.');
   localStorage.tname=f.na.value;localStorage.tfac=f.fa.value;
   await db.collection('tposts').add({ch:f.dataset.c,title:f.ti.value.trim(),body:body.slice(0,3000),name:f.na.value.trim(),fac:f.fa.value.trim(),media,ts:Date.now(),ok:f.dataset.m!='1',pinned:false});route()}
  catch(err){msg.textContent=err.message;btn.disabled=false}}};
A.addEventListener('submit',e=>{const h=FORMS[e.target.id];if(h){e.preventDefault();h(e.target)}});
if(location.hash.startsWith('#/threads'))route();
})();
