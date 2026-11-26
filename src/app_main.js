/* ===================== 문제 은행 ===================== */
const BANK=[],LCB=[],RCB=[],BYID={},BROKEN=[];let EXTRA=0;
const UID={};UNITS.forEach((u,i)=>{UID[u.id]=u;u.ix=i});
const SLOTN={};SLOTS.forEach(s=>SLOTN[s[0]]=s[1]);
function qProblem(q,kind){
 if(!q||typeof q.id!=="string")return "id 없음";
 if(BYID[q.id])return "id 중복";
 const nc=kind==="lc"?3:4;
 if(!Array.isArray(q.c)||q.c.length!==nc||q.c.some(x=>typeof x!=="string"||!x))return "보기 "+nc+"개가 아님";
 if(!Number.isInteger(q.a)||q.a<0||q.a>=nc)return "정답 번호 오류";
 if(typeof q.e!=="string"||!q.e)return "해설 없음";
 if(kind==="g"){if(!UID[q.u])return "단원 없음("+q.u+")";if(typeof q.s!=="string"||!q.s.includes("____"))return "빈칸(____) 없음";if(q.r&&!SLOTN[q.r])return "자리 태그 오류"}
 else if(typeof q.q!=="string"||!q.q)return "질문 없음";
 return null;
}
function addQ(q,kind,src){
 const p=qProblem(q,kind);if(p){BROKEN.push({id:q&&q.id||"?",why:p,src});return false}
 q.kind=kind;q.src=src;BYID[q.id]=q;(kind==="g"?BANK:kind==="lc"?LCB:RCB).push(q);return true;
}
P5.forEach((q,i)=>{const id="a"+i;addQ({id,u:UNIT_OVR[id]||TAG_UNIT[q.t],r:SLOT_OLD[id],s:q.s,c:q.c,a:q.a,e:q.e},"g","기본")});
SESS.forEach((ss,si)=>{
 ss.p5.forEach((q,i)=>{const id="s"+si+"-"+i;addQ({id,u:UNIT_OVR[id]||TAG_UNIT[ss.tag],r:SLOT_OLD[id],s:q.s,c:q.c,a:q.a,e:q.e},"g","기본")});
 ss.p2.forEach((q,i)=>addQ({id:"l"+si+"-"+i,q:q.q,c:q.c,a:q.a,e:q.e},"lc","기본"));
 ss.p7.qs.forEach((q,i)=>addQ({id:"r"+si+"-"+i,px:si,x:ss.p7.x,q:q.q,c:q.c,a:q.a,e:q.e},"rc","기본"));
});
P2.forEach((q,i)=>addQ({id:"l-"+i,q:q.q,c:q.c,a:q.a,e:q.e},"lc","기본"));
P7.qs.forEach((q,i)=>addQ({id:"r-"+i,px:"x",x:P7.text,q:q.q,c:q.c,a:q.a,e:q.e},"rc","기본"));
NEWQ.forEach(q=>addQ(Object.assign({},q),"g","노트"));

/* ===================== 상태 정리·이전·자가 점검 ===================== */
function normalize(r){
 const b=blankState();if(!r||typeof r!=="object")return b;
 const o=Object.assign(b,r);
 ["qs","days","wd","vq"].forEach(k=>{if(!o[k]||typeof o[k]!=="object"||Array.isArray(o[k]))o[k]={}});
 ["log","unk","adapt","mocks","scores","vlog","myw"].forEach(k=>{if(!Array.isArray(o[k]))o[k]=[]});
 o.settings=Object.assign(blankState().settings,o.settings||{});
 if(![10,15,20].includes(+o.settings.size))o.settings.size=15;
 if(!/^\d{4}-\d{2}-\d{2}$/.test(o.exam))o.exam="2026-12-27";
 if(!/^\d{4}-\d{2}-\d{2}$/.test(o.start))o.start=TODAY;
 return o;
}
function migrateV1(){
 const o=readLocal(KEY1);if(!o)return null;
 const n=blankState();n.migrated=true;
 if(o.exam)n.exam=o.exam;if(o.start)n.start=o.start;
 if(Array.isArray(o.scores))n.scores=o.scores;if(Array.isArray(o.unk))n.unk=o.unk;if(Array.isArray(o.mocks))n.mocks=o.mocks;
 (o.wrong||[]).forEach(i=>{n.qs["a"+i]={n:1,c:0,box:1,due:TODAY,last:TODAY}});
 ((o.ss&&o.ss.wq)||[]).forEach(r=>{if(r&&r.t==="p5")n.qs["s"+r.s+"-"+r.i]={n:1,c:0,box:1,due:TODAY,last:TODAY}});
 n.adapt.push({d:TODAY,m:"이전 버전 기록 이전: 시험일·점수·모르는 단어·오답 "+Object.keys(n.qs).length+"문제를 복습 대상으로 옮김"});
 n.updatedAt=Date.now();return n;
}
function selfCheck(){
 const issues=[];let fixed=0;
 if(typeof vMyRebuild==="function"){vMyRebuild();VBROKEN.forEach(id=>issues.push("단어 "+id+" 제외: 형식 오류"));Object.keys(S.vq).forEach(id=>{if(!VBYID[id]){delete S.vq[id];fixed++}});if(S.vlog.length>800)S.vlog=S.vlog.slice(-800)}
 BROKEN.forEach(b=>issues.push("문제 "+b.id+" ("+b.src+") 제외: "+b.why));
 Object.keys(S.qs).forEach(id=>{const v=S.qs[id];
  if(!BYID[id]){delete S.qs[id];fixed++;return}
  if(!v||typeof v!=="object"){delete S.qs[id];fixed++;return}
  if(!(v.box>=1&&v.box<=5)){v.box=1;fixed++}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v.due||"")){v.due=TODAY;fixed++}
  v.n=Math.max(0,+v.n||0);v.c=Math.min(v.n,Math.max(0,+v.c||0));
 });
 const before=S.log.length;
 S.log=S.log.filter(x=>x&&typeof x.id==="string"&&(x.u==="lc"||x.u==="rc"||UID[x.u])&&(x.ok===0||x.ok===1));
 if(S.log.length!==before){fixed+=before-S.log.length;issues.push("손상된 풀이 기록 "+(before-S.log.length)+"건 정리")}
 if(S.log.length>400){S.log=S.log.slice(-400)}
 if(S.adapt.length>60)S.adapt=S.adapt.slice(-60);
 if(S.cur){const ok=Array.isArray(S.cur.items)&&S.cur.items.every(it=>it&&BYID[it.id]);
  if(!ok){S.cur.items=(S.cur.items||[]).filter(it=>it&&BYID[it.id]);fixed++;issues.push("진행 중 세션에서 없는 문제 제거")}
  if(!S.cur.items.length||S.cur.d!==TODAY&&S.cur.stage!=="done"&&S.cur.i===0){S.cur=null}}
 Object.keys(S.days).forEach(d=>{const x=S.days[d];if(!x||typeof x!=="object"||!/^\d{4}-\d{2}-\d{2}$/.test(d)){delete S.days[d];fixed++}});
 if(!LOCAL_OK)issues.push("이 브라우저는 기기 저장이 막혀 있음 (클라우드 저장만 사용)");
 S.health={d:TODAY,ts:Date.now(),ver:APP_VER,issues,fixed,bank:{grammar:BANK.length,lc:LCB.length,rc:RCB.length,extra:EXTRA,broken:BROKEN.length,voca:typeof VW!=="undefined"?VW.length:0}};
 return S.health;
}

/* ===================== 저장 (기기 + 클라우드) ===================== */
let DB=null,dbState="연결 확인 중",dbBusy=false,dbDirty=false,dbTimer=null,UPD=[];
function saveLocal(){if(!LOCAL_OK)return;try{localStorage.setItem(KEY2,JSON.stringify(S))}catch(e){}}
function save(){S.updatedAt=Date.now();saveLocal();queueDb();queueGh()}
function queueDb(){if(!DB)return;dbDirty=true;clearTimeout(dbTimer);dbTimer=setTimeout(flushDb,1500)}
async function flushDb(){
 if(!DB||!dbDirty)return;if(dbBusy){dbTimer=setTimeout(flushDb,800);return}
 dbBusy=true;dbDirty=false;
 try{await DB.doc("progress/state").set(JSON.parse(JSON.stringify(S)));dbState="클라우드에 저장됨 "+new Date().toTimeString().slice(0,5)}
 catch(e){const c=e&&e.code;dbState=c==="quota_exceeded"?"클라우드 용량 초과 — 설정에서 오래된 기록 정리 필요":c==="unavailable"?"잠시 연결 끊김 — 다시 시도":"클라우드 저장 실패 ("+(c||"오류")+") — 기기에는 저장됨";
  if(c==="unavailable"){dbDirty=true;dbTimer=setTimeout(flushDb,4000+Math.random()*2000)}}
 finally{dbBusy=false;renderSync()}
 if(dbDirty&&!dbTimer)flushDb();
}
function renderSync(){const t=GH?ghState:dbState;const f=$("#syncFoot");if(f)f.textContent="저장: "+t;const s=$("#syncState");if(s)s.textContent=t}
/* ===================== 기기 간 동기화 (GitHub 비공개 저장소) ===================== */
const GH_KEY="toeic900-gh";
let GH=null,ghSha=null,ghBusy=false,ghDirty=false,ghTimer=null,ghState="",ghLast=0;
try{GH=JSON.parse(localStorage.getItem(GH_KEY)||"null")}catch(e){GH=null}
const b64e=t=>{const by=new TextEncoder().encode(t);let s="";for(let i=0;i<by.length;i+=8192)s+=String.fromCharCode.apply(null,by.subarray(i,i+8192));return btoa(s)};
const b64d=b=>new TextDecoder().decode(Uint8Array.from(atob(String(b).replace(/\s/g,"")),c=>c.charCodeAt(0)));
async function ghReq(method,body){
 const url="https://api.github.com/repos/"+encodeURIComponent(GH.owner)+"/"+encodeURIComponent(GH.repo)+"/contents/"+GH.path;
 return fetch(url,{method,cache:"no-store",headers:{"Authorization":"Bearer "+GH.token,"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},body:body?JSON.stringify(body):undefined});
}
async function ghPull(){
 const r=await ghReq("GET");
 if(r.status===404){ghSha=null;return {none:true}}
 if(r.status===401||r.status===403)throw {code:"auth"};
 if(!r.ok)throw {code:"http "+r.status};
 const j=await r.json();ghSha=j.sha;
 let txt=j.content?b64d(j.content):"";
 if(!txt&&j.download_url){const r2=await fetch(j.download_url,{cache:"no-store",headers:{"Authorization":"Bearer "+GH.token}});txt=await r2.text()}
 return {state:JSON.parse(txt)};
}
function mergeStates(a,b){
 const [n,o]=(a.updatedAt||0)>=(b.updatedAt||0)?[a,b]:[b,a];
 const m=normalize(JSON.parse(JSON.stringify(n)));const O=normalize(JSON.parse(JSON.stringify(o)));
 const lk=x=>x.t+"|"+x.id+"|"+(x.rt||0),L=new Map();
 O.log.concat(m.log).forEach(x=>{if(x&&x.t)L.set(lk(x),Object.assign({},L.get(lk(x))||{},x))});
 m.log=[...L.values()].sort((x,y)=>x.t-y.t).slice(-400);
 Object.entries(O.qs).forEach(([id,v])=>{const w=m.qs[id];if(!w||(v.n||0)>(w.n||0))m.qs[id]=v});
 Object.entries(O.days).forEach(([d,v])=>{const w=m.days[d];if(!w||(v.n||0)>(w.n||0)||((v.n||0)===(w.n||0)&&(v.ss||0)>(w.ss||0)))m.days[d]=v});
 Object.entries(O.wd).forEach(([k,v])=>{if(!m.wd[k])m.wd[k]=v});
 m.unk=[...new Set(O.unk.concat(m.unk))];
 const uni=(x,y,f)=>{const M=new Map();x.concat(y).forEach(e=>M.set(f(e),e));return [...M.values()]};
 m.adapt=uni(O.adapt,m.adapt,e=>e.d+"|"+e.m).sort((x,y)=>String(x.d).localeCompare(String(y.d))).slice(-60);
 m.mocks=uni(O.mocks,m.mocks,e=>JSON.stringify(e));
 m.scores=uni(O.scores,m.scores,e=>e.d+"|"+e.lc+"|"+e.rc).sort((x,y)=>x.d<y.d?-1:1);
 m.wpos=Math.max(O.wpos||0,m.wpos||0);
 Object.entries(O.vq).forEach(([id,v])=>{const w=m.vq[id];if(!w||(v.n||0)>(w.n||0))m.vq[id]=v});
 m.vlog=uni(O.vlog,m.vlog,e=>e.t+"|"+e.id+"|"+e.k).sort((x,y)=>x.t-y.t).slice(-800);
 m.myw=uni(O.myw,m.myw,e=>e.id);
 m.updatedAt=Math.max(a.updatedAt||0,b.updatedAt||0);
 return m;
}
function ghSetState(t){ghState=t;renderSync()}
async function ghSyncNow(){
 if(!GH)return;if(ghBusy){ghDirty=true;return}
 ghBusy=true;ghDirty=false;clearTimeout(ghTimer);ghTimer=null;
 try{
  ghSetState("동기화 중…");
  const remote=await ghPull();
  if(remote.state){const before=JSON.stringify(S);S=mergeStates(S,remote.state);if(JSON.stringify(S)!==before){selfCheck();saveLocal();renderAll()}}
  const same=remote.state&&JSON.stringify(remote.state)===JSON.stringify(S);
  if(!same){
   let put=await ghReq("PUT",{message:"학습 기록 "+TODAY,content:b64e(JSON.stringify(S)),sha:ghSha||undefined});
   if(put.status===409||put.status===422){const again=await ghPull();if(again.state){S=mergeStates(S,again.state);saveLocal()}put=await ghReq("PUT",{message:"학습 기록 "+TODAY,content:b64e(JSON.stringify(S)),sha:ghSha||undefined})}
   if(put.status===401||put.status===403)throw {code:"auth"};
   if(!put.ok)throw {code:"http "+put.status};
   const j=await put.json();ghSha=j.content&&j.content.sha;
  }
  ghLast=Date.now();ghSetState("모든 기기 동기화됨 "+new Date().toTimeString().slice(0,5));
 }catch(e){
  const c=e&&e.code;
  ghSetState(c==="auth"?"동기화 실패: 토큰이 틀렸거나 만료됨 — 설정에서 다시 연결":navigator.onLine===false?"오프라인 — 연결되면 자동 동기화":"동기화 실패 ("+(c||"네트워크")+") — 이 기기에는 저장됨");
  if(c!=="auth")ghDirty=true;
 }finally{ghBusy=false;if(ghDirty&&!ghTimer)ghTimer=setTimeout(ghSyncNow,20000)}
}
function queueGh(){if(!GH)return;ghDirty=true;clearTimeout(ghTimer);ghTimer=setTimeout(ghSyncNow,15000)}
function ghFlush(){if(GH&&(ghDirty||ghTimer))ghSyncNow()}
async function ghInit(){if(!GH){renderSync();return}await ghSyncNow()}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")ghFlush();else if(GH&&Date.now()-ghLast>60000)ghSyncNow()});
addEventListener("online",()=>{if(GH)ghSyncNow()});

async function loadStatic(){
 /* 독립 사이트: 같은 폴더의 bank.json(추가 문제)·updates.json(개선 기록)을 읽는다. 없으면 무시. */
 if(!/^https?:$/.test(location.protocol))return;
 try{const r=await fetch("bank.json",{cache:"no-cache"});if(r.ok){const arr=await r.json();(Array.isArray(arr)?arr:[]).forEach(x=>{if(!x||!x.id)return;const kind=x.kind==="lc"?"lc":x.kind==="rc"?"rc":"g";if(addQ(Object.assign({},x,{id:"x-"+x.id}),kind,"자동 추가"))EXTRA++})}}catch(e){}
 try{const r=await fetch("updates.json",{cache:"no-cache"});if(r.ok){const arr=await r.json();if(Array.isArray(arr))UPD=arr.slice().sort((a,b)=>String(b.d).localeCompare(String(a.d))).slice(0,20)}}catch(e){}
 selfCheck();saveLocal();renderAll();
}
async function connectDb(){
 let c=null;
 try{c=window.claude&&window.claude.use?await window.claude.use("db"):null}catch(e){c=null}
 if(!c){dbState="이 기기에만 저장 중 — 설정 → 기기 간 동기화를 연결하세요";await loadStatic();await ghInit();renderSync();return}
 DB=c;let late=setTimeout(()=>{dbState="클라우드 응답 지연 — 기기에 먼저 저장 중";renderSync()},10000);
 try{
  const snap=await DB.doc("progress/state").get();clearTimeout(late);
  if(snap.exists){const r=snap.data()||{};
   if((r.updatedAt||0)>(S.updatedAt||0)){S=normalize(JSON.parse(JSON.stringify(r)));saveLocal()}
   else if((S.updatedAt||0)>(r.updatedAt||0)){dbDirty=true}}
  else if(S.updatedAt){dbDirty=true}
  dbState="클라우드 연결됨";
  try{const b=await DB.collection("bank").get();b.docs.forEach(d=>{const x=d.data()||{};const kind=x.kind==="lc"?"lc":x.kind==="rc"?"rc":"g";if(addQ(Object.assign({},x,{id:"x-"+d.id}),kind,"자동 추가"))EXTRA++})}catch(e){}
  try{const u=await DB.collection("updates").orderBy("d","desc").limit(20).get();UPD=u.docs.map(d=>d.data()||{})}catch(e){}
  selfCheck();save();
 }catch(e){clearTimeout(late);dbState="클라우드 연결 실패 ("+(e&&e.code||"오류")+") — 기기에 저장 중"}
 renderSync();renderAll();
}

/* ===================== 실력 분석 엔진 ===================== */
function unitStat(u){
 const all=S.log.filter(x=>x.u===u&&!x.rt);const last=all.slice(-20).reverse();
 let w=1,sw=0,sc=0;last.forEach(x=>{sw+=w;sc+=w*x.ok;w*=0.88});
 const ok=last.filter(x=>x.ok);const pool=(u==="lc"?LCB:u==="rc"?RCB:BANK.filter(q=>q.u===u));
 return {n:all.length,acc:all.length?Math.round(all.filter(x=>x.ok).length/all.length*100):null,m:last.length>=3?Math.round(sc/sw*100):null,
  ms:ok.length?Math.round(ok.reduce((a,x)=>a+x.ms,0)/ok.length):null,seen:pool.filter(q=>S.qs[q.id]).length,total:pool.length};
}
function lvl(m){return m==null?["미학습","lv0"]:m<50?["약점","lv1"]:m<75?["보완","lv2"]:m<90?["양호","lv3"]:["강점","lv4"]}
function recentG(k){return S.log.filter(x=>x.u!=="lc"&&x.u!=="rc"&&!x.rt).slice(-k)}
function errMix(){const e=S.log.filter(x=>x.err).slice(-20);const c={concept:0,slot:0,vocab:0,time:0};e.forEach(x=>{if(c[x.err]!=null)c[x.err]++});return {c,n:e.length}}
function slotAcc(k){const s=S.log.filter(x=>x.sl===0||x.sl===1).slice(-k);return {n:s.length,acc:s.length?Math.round(s.filter(x=>x.sl).length/s.length*100):null}}
function makePlan(){
 const st={};UNITS.forEach(u=>st[u.id]=unitStat(u.id));
 const started=UNITS.filter(u=>st[u.id].m!=null);
 const weak=started.filter(u=>st[u.id].m<60).sort((a,b)=>st[a.id].m-st[b.id].m);
 const next=UNITS.find(u=>st[u.id].n<3);
 let focus,why;
 if(weak.length){focus=weak[0].id;why="정답률 "+st[focus].m+"% — 약점 단원 집중"}
 else if(next){focus=next.id;why=started.length?"앞 단원 통과(60% 이상) → 노트 순서대로 다음 단원":"노트 순서대로 첫 단원부터"}
 else{const lo=started.slice().sort((a,b)=>st[a.id].m-st[b.id].m)[0];focus=lo.id;why="전 단원 학습 완료 · 가장 낮은 단원("+st[focus].m+"%) 보강"}
 const rg=recentG(30),okT=rg.filter(x=>x.ok),avg=okT.length?okT.reduce((a,x)=>a+x.ms,0)/okT.length:0;
 const prevSpeed=S.plan&&S.plan.speed;
 let speed=S.settings.speed==="on"?25:S.settings.speed==="off"?0:(rg.length>=15&&avg>22000?25:(prevSpeed&&avg>18000?25:0));
 const sa=slotAcc(30);
 const slot=S.settings.slot==="on"?true:S.settings.slot==="off"?false:!(sa.n>=30&&sa.acc>=90);
 const em=errMix();
 const lessonFirst=st[focus].n<3||(em.n>=5&&em.c.concept/em.n>=0.4);
 const words=em.n>=5&&em.c.vocab/em.n>=0.3?10:5;
 const frontier=Math.max(UID[focus].ix,...started.map(u=>u.ix),0);
 return {d:TODAY,focus,why,speed,slot,lessonFirst,words,frontier,avg:Math.round(avg/1000),em,sa,st};
}
function adaptLog(m){if(!S.adapt.some(x=>x.d===TODAY&&x.m===m))S.adapt.push({d:TODAY,m})}
function refreshPlan(){
 const p=makePlan(),o=S.plan,msgs=[];
 if(!o)msgs.push("첫 계획: "+UID[p.focus].n+" — "+p.why);
 else{
  if(o.focus!==p.focus)msgs.push("집중 단원 변경: "+(UID[o.focus]?UID[o.focus].n:o.focus)+" → "+UID[p.focus].n+" ("+p.why+")");
  if(!o.speed&&p.speed)msgs.push("속도 훈련 켬: 정답 평균 "+p.avg+"초 → 문제당 목표 25초 표시");
  if(o.speed&&!p.speed)msgs.push("속도 훈련 끔: 정답 평균 "+p.avg+"초로 안정");
  if(o.slot&&!p.slot)msgs.push("자리 판별 단계 생략: 최근 30회 자리 판단 정답률 "+p.sa.acc+"%");
  if(!o.slot&&p.slot&&S.settings.slot==="auto")msgs.push("자리 판별 단계 다시 켬");
  if(o.words!==p.words)msgs.push(p.words>o.words?"단어 몰라서 틀린 비율이 높음 → 세션 단어 10개로 늘림":"단어 오답 감소 → 세션 단어 5개로 복귀");
  if(p.lessonFirst&&!o.lessonFirst&&p.em.n>=5&&p.em.c.concept/p.em.n>=0.4)msgs.push("'개념 몰라서' 오답이 많음 → 문제 전에 노트부터 보도록 변경");
 }
 UNITS.forEach(u=>{const s=p.st[u.id],q=o&&o.st?o.st[u.id]:null;if(s.m>=90&&s.n>=10&&!(q&&q.m>=90&&q.n>=10))msgs.push(u.n+" 강점 단계 도달 → 출제 비중 축소")});
 msgs.forEach(adaptLog);
 S.plan=Object.assign({},p,{st:Object.fromEntries(Object.entries(p.st).map(([k,v])=>[k,{m:v.m,n:v.n}]))});
 return {p,msgs};
}

/* ===================== 세션 구성 ===================== */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function rankPool(pool){
 const un=shuffle(pool.filter(q=>!S.qs[q.id]));
 const seen=pool.filter(q=>S.qs[q.id]).sort((a,b)=>{const x=S.qs[a.id],y=S.qs[b.id];return (x.c/x.n)-(y.c/y.n)||String(x.last).localeCompare(String(y.last))});
 return un.concat(seen);
}
function buildSession(opt){
 opt=opt||{};const p=makePlan(),N=+S.settings.size,used=new Set(),items=[];
 const take=(q,tag)=>{if(q&&!used.has(q.id)){used.add(q.id);items.push({id:q.id,tag})}};
 const due=BANK.filter(q=>S.qs[q.id]&&S.qs[q.id].due<=TODAY).sort((a,b)=>S.qs[a.id].box-S.qs[b.id].box||S.qs[a.id].due.localeCompare(S.qs[b.id].due));
 if(opt.unit){
  due.filter(q=>q.u===opt.unit).slice(0,4).forEach(q=>take(q,"복습"));
  rankPool(BANK.filter(q=>q.u===opt.unit&&!used.has(q.id))).slice(0,10-items.length).forEach(q=>take(q,"단원"));
 }else{
  const hasRC=N>=15,G=N-2-(hasRC?2:0);
  due.slice(0,Math.floor(G*0.35)).forEach(q=>take(q,"복습"));
  rankPool(BANK.filter(q=>q.u===p.focus&&!used.has(q.id))).slice(0,Math.round(G*0.45)).forEach(q=>take(q,"집중"));
  const cand=UNITS.filter(u=>u.ix<=p.frontier+1&&u.id!==p.focus);let guard=0;
  while(items.length<G&&guard++<200){
   let pick=null;
   if(cand.length){const ws=cand.map(u=>{const m=p.st[u.id].m;return m==null?40:(100-m)+10});let r=Math.random()*ws.reduce((a,b)=>a+b,0);for(let i=0;i<cand.length;i++){r-=ws[i];if(r<=0){pick=cand[i];break}}pick=pick||cand[0]}
   const pool=rankPool(BANK.filter(q=>(!pick||q.u===pick.id)&&!used.has(q.id)));
   if(pool.length)take(pool[0],"혼합");else{const any=rankPool(BANK.filter(q=>!used.has(q.id)));if(!any.length)break;take(any[0],"혼합")}
  }
  const head=items.filter(x=>x.tag==="복습"),body=shuffle(items.filter(x=>x.tag!=="복습"));items.length=0;items.push(...head,...body);
  rankPool(LCB.filter(q=>!used.has(q.id))).slice(0,2).forEach(q=>take(q,"듣기"));
  if(hasRC){const px=rankPool(RCB)[0];if(px)RCB.filter(q=>q.px===px.px).slice(0,2).forEach(q=>take(q,"독해"))}
 }
 const wds=vDue().slice(0,p.words).map(o=>o.id);let wp=S.wpos||0;
 const cd=vCurrentDay();vDayWords(cd).filter(o=>!S.vq[o.id]).forEach(o=>{if(wds.length<p.words&&!wds.includes(o.id))wds.push(o.id)});
 VW.filter(o=>o.day>0&&!S.vq[o.id]).forEach(o=>{if(wds.length<p.words&&!wds.includes(o.id))wds.push(o.id)});
 return {d:TODAY,kind:opt.unit?"unit":"daily",unit:opt.unit||p.focus,why:opt.unit?"직접 고른 단원":p.why,items,i:0,stage:(opt.unit||p.lessonFirst)?"lesson":"q",ans:{},sl:{},err:{},ms:{},retried:{},words:opt.unit?[]:wds,wi:0,wk:0,flip:false,t0:Date.now(),speed:p.speed,slot:p.slot,wpos:wp};
}

/* ===================== 기록 ===================== */
function record(q,ok,ms,rt,sl){
 const d=S.days[TODAY]=S.days[TODAY]||{n:0,c:0,ms:0,ss:0,sec:0};
 S.log.push({t:Date.now(),d:TODAY,id:q.id,u:q.kind==="g"?q.u:q.kind,ok:ok?1:0,ms,rt:rt?1:0,sl});
 if(S.log.length>400)S.log=S.log.slice(-400);
 if(rt)return;
 d.n++;if(ok)d.c++;d.ms+=ms;
 const v=S.qs[q.id]||{n:0,c:0,box:0,due:TODAY,last:TODAY};v.n++;if(ok)v.c++;v.last=TODAY;
 const IV=[0,1,2,4,7,15];
 if(ok){v.box=Math.min(5,(v.box||0)+1);v.due=addDays(TODAY,IV[v.box])}else{v.box=1;v.due=addDays(TODAY,1)}
 S.qs[q.id]=v;
}
function setErr(qid,err){for(let i=S.log.length-1;i>=0;i--){if(S.log[i].id===qid&&!S.log[i].rt){S.log[i].err=err;break}}}

/* ===================== 화면: 공통 ===================== */
function show(v){document.body.classList.toggle("running",v==="run"&&!!S.cur&&S.cur.stage!=="done");document.querySelectorAll("nav button").forEach(b=>b.setAttribute("aria-selected",b.dataset.v===v||(v==="run"&&b.dataset.v==="home")));document.querySelectorAll(".view").forEach(s=>s.hidden=s.id!=="v-"+v);try{sessionStorage.setItem("tab2",v)}catch(e){}window.scrollTo(0,0);
 if(v==="stats")renderStats();if(v==="voca")renderVoca();if(v==="notes")renderNotes();if(v==="set")renderSet();if(v==="home")renderHome();if(v==="run")renderRun()}
document.querySelector("nav").addEventListener("click",e=>{const b=e.target.closest("button");if(b)show(b.dataset.v)});
function chip(m){const l=lvl(m);return `<span class="lv ${l[1]}">${l[0]}${m!=null?" "+m+"%":""}</span>`}
function streak(){let n=0,d=TODAY;if(!S.days[d])d=addDays(d,-1);while(S.days[d]&&S.days[d].n>0){n++;d=addDays(d,-1)}return n}

/* ===================== 오늘 ===================== */
function renderHome(){
 const ex=dOnly(S.exam),left=Math.round((ex-today)/864e5);
 const p=S.plan||makePlan(),u=UID[p.focus],st=unitStat(p.focus),td=S.days[TODAY]||{n:0,c:0,ss:0};
 const cur=S.cur&&S.cur.stage!=="done"?S.cur:null;
 const opts=[["2026-12-13","12/13(일) 제585회"],["2026-12-27","12/27(일) 제586회"]];
 const custom=!opts.some(o=>o[0]===S.exam);
 const recent=S.adapt.slice(-3).reverse();
 $("#v-home").innerHTML=`
 <div class="card"><div class="dday"><div class="num mono">${left>0?"D-"+left:left===0?"D-DAY":"끝"}</div><div class="meta">
  <div class="row note"><span>연속 ${streak()}일</span><span>· 오늘 ${td.n}문제 ${td.n?Math.round(td.c/td.n*100)+"%":""}</span></div>
  <div class="row note"><label for="examDate">시험일</label><select id="examDate">${opts.map(o=>`<option value="${o[0]}"${o[0]===S.exam?" selected":""}>${o[1]}</option>`).join("")}<option value="custom"${custom?" selected":""}>직접 입력…</option></select><input type="date" id="examCustom" value="${custom?S.exam:""}" ${custom?"":"hidden"}></div>
 </div></div></div>
 <div class="card sscard">
  <div class="row" style="justify-content:space-between"><span class="lbl">오늘의 세션</span><span class="note mono">${S.settings.size}문제</span></div>
  <div class="big">${esc(u.n)}</div>
  <div class="row">${chip(st.m)}<span class="note">${esc(p.why)}</span></div>
  <p class="note" style="margin:0">복습 → 집중 단원 → 섞어 풀기 → 듣기${S.settings.size>=15?" → 독해":""} → 단어 ${p.words}개${p.lessonFirst?" · 노트 먼저":""}${p.slot?" · 자리 판별 단계 포함":""}${p.speed?" · 속도 목표 "+p.speed+"초":""}</p>
  <div class="row"><button class="btn" id="goRun">${cur?"이어하기 ("+(Math.min(cur.i+1,cur.items.length))+"/"+cur.items.length+")":"세션 시작"}</button>${cur?'<button class="btn ghost" id="newRun">새로 시작</button>':""}${td.ss?`<span class="note">오늘 ${td.ss}세션 완료</span>`:""}</div>
 </div>
 <div class="card"><div class="row" style="justify-content:space-between"><h2>프로그램이 바꾼 것</h2><button class="btn small ghost" data-go="stats">분석 보기</button></div>
  ${recent.length?`<ul class="alog">${recent.map(a=>`<li><span class="mono note">${a.d.slice(5).replace("-","/")}</span> ${esc(a.m)}</li>`).join("")}</ul>`:`<p class="empty">세션을 풀면 기록을 분석해서 다음 세션 구성을 스스로 바꿉니다. 바뀐 내용이 여기에 쌓여요.</p>`}
 </div>
 <div class="card"><div class="row" style="justify-content:space-between"><h2>단어</h2><button class="btn small" data-go="voca">단어장 열기</button></div><p class="note" style="margin:0">DAY ${vCurrentDay()} 진행 중 · 외운 단어 ${VW.filter(o=>o.day>0&&vMastered(o.id)).length}/${VW.filter(o=>o.day>0).length} · 오늘 복습 ${vDue().length}개</p></div>
 <div class="card"><h2>약점 TOP 3</h2>${weakList(3)}</div>`;
}
function weakList(k){
 const arr=UNITS.map(u=>({u,s:unitStat(u.id)})).filter(x=>x.s.m!=null).sort((a,b)=>a.s.m-b.s.m).slice(0,k);
 if(!arr.length)return `<p class="empty">3문제 이상 푼 단원부터 순위가 나옵니다.</p>`;
 return `<div class="ulist">${arr.map(x=>`<button class="urow" data-unit="${x.u.id}"><span>${esc(x.u.n)}</span>${chip(x.s.m)}<span class="note mono">${x.s.n}문제</span></button>`).join("")}</div>`;
}
$("#v-home").addEventListener("change",e=>{
 if(e.target.id==="examDate"){if(e.target.value==="custom"){$("#examCustom").hidden=false;return}S.exam=e.target.value;save();renderHome()}
 if(e.target.id==="examCustom"&&e.target.value){S.exam=e.target.value;save();renderHome()}
});
document.addEventListener("click",e=>{
 const g=e.target.closest("[data-go]");if(g){show(g.dataset.go);return}
 const un=e.target.closest("[data-unit]");if(un&&!e.target.closest("#v-run")){NOTE=un.dataset.unit;show("notes");return}
 const pr=e.target.closest("[data-practice]");if(pr){startRun({unit:pr.dataset.practice});return}
});
$("#v-home").addEventListener("click",e=>{
 const id=e.target.closest("button")&&e.target.closest("button").id;
 if(id==="goRun"){if(S.cur&&S.cur.stage!=="done")show("run");else startRun()}
 if(id==="newRun"){if(e.target.dataset.sure!=="1"){e.target.dataset.sure="1";e.target.textContent="진행 중인 세션을 버리고 새로 시작";return}startRun()}
});
function startRun(opt){S.cur=buildSession(opt);save();show("run")}

/* ===================== 세션 진행 ===================== */
let qStart=0,qTick=null,RUN_SCROLL=false;
function curQ(){const c=S.cur;return c&&c.items[c.i]?BYID[c.items[c.i].id]:null}
function blankFill(q,pk){return esc(q.s).replace("____",pk==null?'<span class="blank">빈칸</span>':`<span class="blank on${pk===q.a?" ok":" ng"}">${esc(q.c[pk])}</span>`)}
function renderRun(){
 const c=S.cur,A=$("#v-run");clearInterval(qTick);
 if(!c){A.innerHTML=`<div class="card"><p class="empty">진행 중인 세션이 없습니다.</p><button class="btn" data-go="home">오늘로</button></div>`;return}
 const u=UID[c.unit];
 const top=`<div class="card runhd"><div class="row" style="justify-content:space-between"><span class="lbl">${c.kind==="unit"?"단원 연습":"오늘의 세션"} · ${esc(u?u.n:"")}</span><button class="btn small ghost" data-go="home">나가기 (저장됨)</button></div>
  <div class="sbar">${c.items.map((it,i)=>`<i class="${i<c.i?(c.ans[i]===BYID[it.id].a?"d":"x"):i===c.i&&c.stage==="q"?"c":""}"></i>`).join("")}</div></div>`;
 if(c.stage==="lesson"){A.innerHTML=top+noteHTML(c.unit,true)+`<div class="actbar"><div class="in"><button class="btn" id="rLessonDone">노트 확인 → 문제 시작</button></div></div>`;return}
 if(c.stage==="words"){
  const o=VBYID[c.words[c.wi]];
  if(!o){A.innerHTML=top+`<div class="card"><h2>단어 완료</h2><p style="margin:0">알아요 ${c.wk} / ${c.words.length}</p><div class="actbar"><div class="in"><button class="btn" id="rFinish">결과 보기</button></div></div></div>`;return}
  A.innerHTML=top+`<div class="card"><div class="row" style="justify-content:space-between"><h2>단어</h2><span class="mono note">${c.wi+1} / ${c.words.length}</span></div><button class="flash vflash" id="rFlip"><div><div class="en">${esc(o.w)}</div><div class="note">DAY ${o.day} · ${esc(o.pos)}</div>${c.flip?`<div class="ko">${esc(o.ko)}</div>${o.pt?`<div class="vpt">${esc(o.pt)}</div>`:""}${o.ex?`<div class="vex">${esc(o.ex)}<br><span class="note">${esc(o.exk)}</span></div>`:""}`:`<div class="note">탭해서 뜻 보기</div>`}</div></button><div class="actbar"><div class="in"><button class="btn ghost" id="rUnk">몰라요</button><button class="btn" id="rKnow">알아요</button></div></div></div>`;return}
 if(c.stage==="done"){document.body.classList.remove("running");A.innerHTML=top+resultHTML();return}
 const q=curQ(),it=c.items[c.i],i=c.i,pk=c.ans[i],needSlot=q.kind==="g"&&c.slot&&q.r&&c.sl[i]==null&&!it.rt;
 const qu=q.kind==="g"?UID[q.u]:null;
 let h=`<div class="card qcard"><div class="row" style="justify-content:space-between"><span class="row" style="gap:6px"><span class="qn">${i+1}</span><span class="tagc">${esc(it.rt?"다시":it.tag)}</span><span class="note">${q.kind==="g"?esc(qu.n):q.kind==="lc"?"Part 2 듣기":"Part 7 독해"}</span></span><span class="clock mono" id="qClock">${pk!=null?Math.round((c.ms[i]||0)/1000)+"초":"0초"}</span></div>`;
 if(q.kind==="g")h+=`<div class="q-stem">${blankFill(q,pk)}</div>`;
 else if(q.kind==="lc")h+=`<div class="row"><button class="btn small" id="rSay">▶ 듣기</button><button class="btn small ghost" id="rScr">${c.scr?"스크립트 숨기기":"스크립트 보기"}</button></div>${pk!=null||c.scr?`<div class="passage">Q. ${esc(q.q)}\n${q.c.map((x,j)=>`(${L[j]}) ${esc(x)}`).join("\n")}</div>`:""}`;
 else h+=`<div class="passage">${esc(q.x)}</div><b>${esc(q.q)}</b>`;
 if(needSlot){
  h+=`<div class="slotq"><span class="lbl">1단계 · 빈칸은 어떤 자리?</span><div class="slots">${SLOTS.map(s=>`<button class="slotb" data-slot="${s[0]}"><b>${s[0]==="J"?"연결":s[0]}</b><span>${s[1]}</span></button>`).join("")}</div><p class="note" style="margin:0">문장의 동사(V)부터 찾고, 빈칸이 S·V·O·C·M 중 어디인지 고르세요. 접속사·전치사·관계사 자리는 '연결'.</p></div>`;
 }else{
  if(q.kind==="g"&&c.sl[i]!=null&&!it.rt){const okS=c.sl[i]===q.r;h+=`<div class="explain${okS?"":" bad"}"><b>자리 ${okS?"정답":"오답"}</b> 이 빈칸은 ${SLOTN[q.r]}(${q.r==="J"?"연결":q.r}) 자리${okS?"":" — 고른 답: "+SLOTN[c.sl[i]]}</div>`}
  const hide=q.kind==="lc"&&pk==null&&!c.scr;
  h+=`<div class="choices">${q.c.map((x,j)=>{let cl="";if(pk!=null){if(j===q.a)cl=" right";else if(j===pk)cl=" wrong"}return `<button class="choice${cl}" data-pick="${j}" ${pk!=null?"disabled":""}><span class="bub" aria-pressed="${pk===j}">${L[j]}</span><span>${hide?'<span class="muted">음성 ('+L[j]+')</span>':esc(x)}</span></button>`}).join("")}</div>`;
 }
 if(pk!=null){
  const ok=pk===q.a;
  h+=`<div class="explain${ok?"":" bad"}" id="rExp"><b>${ok?"정답":"오답 · 정답 ("+L[q.a]+")"}</b> ${esc(q.e)} <span class="note mono">${Math.round((c.ms[i]||0)/1000)}초</span></div>`;
  if(!ok&&!it.rt){h+=`<div class="errq"><span class="lbl">왜 틀렸나요? (분석에 반영)</span><div class="seg">${[["concept","개념을 몰라서"],["slot","자리 판단 실수"],["vocab","단어 뜻 몰라서"],["time","시간 부족·찍음"]].map(x=>`<button data-err="${x[0]}" aria-pressed="${c.err[i]===x[0]}">${x[1]}</button>`).join("")}</div></div>`}
  if(qu)h+=`<div class="row"><button class="btn small ghost" data-unit="${qu.id}" id="rNote">노트: ${esc(qu.n)}</button></div>`;
  h+=`<div class="actbar"><div class="in"><button class="btn" id="rNext">${c.i+1<c.items.length?"다음 문제 ("+(c.i+2)+"/"+c.items.length+")":c.words.length?"단어로":"결과 보기"}</button></div></div>`;
 }
 h+=`</div>`;
 A.innerHTML=top+h;
 document.body.classList.toggle("running",!$("#v-run").hidden);
 if(pk!=null&&window.innerWidth<=640){const ex=A.querySelector(".qcard .explain:last-of-type, .qcard .errq");const t=A.querySelector("#rExp")||ex;if(t&&RUN_SCROLL){RUN_SCROLL=false;t.scrollIntoView({block:"center",behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}
 if(pk==null){qStart=Date.now();const el=$("#qClock");qTick=setInterval(()=>{const s=Math.floor((Date.now()-qStart)/1000);el.textContent=s+"초"+(c.speed?" / "+c.speed:"");el.classList.toggle("over",!!c.speed&&s>c.speed)},500)}
}
$("#v-run").addEventListener("click",e=>{
 const c=S.cur;if(!c)return;const b=e.target.closest("button");if(!b)return;const q=curQ(),i=c.i;
 if(b.id==="rNote"){e.stopPropagation();NOTE=b.dataset.unit;show("notes");return}
 if(b.dataset.slot){c.sl[i]=b.dataset.slot;save();renderRun();return}
 if(b.dataset.pick!=null&&c.ans[i]==null){
  const pk=+b.dataset.pick,ok=pk===q.a,ms=Math.min(Date.now()-qStart,180000),it=c.items[i];
  c.ans[i]=pk;c.ms[i]=ms;
  const sl=q.kind==="g"&&c.sl[i]!=null&&!it.rt?(c.sl[i]===q.r?1:0):undefined;
  record(q,ok,ms,!!it.rt,sl);
  if(!ok&&!it.rt&&!c.retried[q.id]){c.retried[q.id]=1;c.items.push({id:q.id,tag:"다시",rt:1})}
  RUN_SCROLL=true;save();renderRun();return}
 if(b.dataset.err){c.err[i]=b.dataset.err;setErr(q.id,b.dataset.err);save();renderRun();return}
 if(b.id==="rSay"){if(!speakLines([q.q,...q.c.map((x,j)=>L[j]+". "+x)])){c.scr=true;renderRun()}return}
 if(b.id==="rScr"){c.scr=!c.scr;renderRun();return}
 if(b.id==="rLessonDone"){c.stage="q";save();renderRun();window.scrollTo(0,0);return}
 if(b.id==="rNext"){c.scr=false;if(c.i+1<c.items.length){c.i++}else{c.stage=c.words.length?"words":"done";if(c.stage==="done")finishRun()}save();renderRun();window.scrollTo(0,0);return}
 if(b.id==="rFlip"||b.closest("#rFlip")){c.flip=!c.flip;renderRun();return}
 if(b.id==="rKnow"||b.id==="rUnk"){const o=VBYID[c.words[c.wi]];
  if(o)vRecord(o,b.id==="rKnow",null);if(b.id==="rKnow")c.wk++;
  c.wi++;c.flip=false;save();renderRun();return}
 if(b.id==="rFinish"){c.stage="done";finishRun();save();renderRun();return}
 if(b.id==="rAgain"){startRun();return}
});
function finishRun(){
 const c=S.cur;if(c.finished)return;c.finished=1;
 const d=S.days[TODAY]=S.days[TODAY]||{n:0,c:0,ms:0,ss:0,sec:0};d.ss++;d.sec+=Math.round((Date.now()-c.t0)/1000);
 if(c.kind==="daily")S.wpos=c.wpos;
 const r=refreshPlan();c.msgs=r.msgs;setTimeout(()=>ghFlush(),300);
}
function resultHTML(){
 const c=S.cur;const first=c.items.map((it,i)=>({it,i,q:BYID[it.id]})).filter(x=>!x.it.rt&&c.ans[x.i]!=null);
 const ok=first.filter(x=>c.ans[x.i]===x.q.a).length;
 const per={};first.forEach(x=>{const k=x.q.kind==="g"?UID[x.q.u].n:x.q.kind==="lc"?"Part 2 듣기":"Part 7 독해";per[k]=per[k]||[0,0];per[k][1]++;if(c.ans[x.i]===x.q.a)per[k][0]++});
 const avg=first.length?Math.round(first.reduce((a,x)=>a+(c.ms[x.i]||0),0)/first.length/1000):0;
 const sl=first.filter(x=>c.sl[x.i]!=null);const slOk=sl.filter(x=>c.sl[x.i]===x.q.r).length;
 const p=S.plan;
 return `<div class="card"><div class="res"><div class="big mono">${ok}<span style="font-size:20px">/${first.length}</span></div><div class="note">평균 ${avg}초${sl.length?" · 자리 판단 "+slOk+"/"+sl.length:""} · 단어 ${c.wk}/${c.words.length}</div></div>
  <div class="tbl"><table><thead><tr><th>영역</th><th style="text-align:right">정답</th></tr></thead><tbody>${Object.entries(per).map(([k,v])=>`<tr><td>${esc(k)}</td><td class="n">${v[0]}/${v[1]}</td></tr>`).join("")}</tbody></table></div></div>
  <div class="card"><h2>다음 세션은 이렇게 바뀝니다</h2>
   ${c.msgs&&c.msgs.length?`<ul class="alog">${c.msgs.map(m=>`<li>${esc(m)}</li>`).join("")}</ul>`:`<p class="note" style="margin:0">구성 유지. 집중 단원: ${esc(UID[p.focus].n)} (${esc(p.why)})</p>`}
   <p class="note" style="margin:0">틀린 문제는 내일 복습으로 다시 나오고, 맞히면 2일 → 4일 → 7일 → 15일 간격으로 늘어납니다.</p>
   <div class="row"><button class="btn" id="rAgain">한 세션 더</button><button class="btn ghost" data-go="stats">분석 보기</button><button class="btn ghost" data-go="home">오늘로</button></div></div>`;
}

/* ===================== 노트 ===================== */
let NOTE=null;
function noteHTML(id,brief){
 const u=UID[id],s=unitStat(id);
 return `<div class="card note-card"><div class="row" style="justify-content:space-between"><span class="lbl">${esc(GROUPS[u.g][0])} · 단원 ${u.ix}</span>${chip(s.m)}</div><h2>${esc(u.n)}</h2>
  ${u.sec.map(sc=>`<div class="nsec"><h3>${esc(sc.h)}</h3><div class="lesson">${sc.rows.map(r=>`<div class="lr"><div><b>${esc(r[0])}</b>${r[1]?`<div class="note">${esc(r[1])}</div>`:""}</div><div class="ex">${esc(r[2]||"")}</div></div>`).join("")}</div></div>`).join("")}
  <div class="explain"><b>시험장 규칙</b> ${esc(u.exam)}</div>
  ${u.trap.length?`<div class="nsec"><h3>함정</h3><ul class="trap">${u.trap.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`:""}
  ${u.fix.length?`<div class="nsec"><h3>노트 수정 사항</h3>${u.fix.map(f=>`<div class="fix"><div><span class="fixtag">원래 노트</span> ${esc(f[0])}</div><div><span class="fixtag ok">수정</span> ${esc(f[1])}</div></div>`).join("")}</div>`:""}
  ${brief?"":`<div class="row"><button class="btn" data-practice="${u.id}">이 단원 10문제 풀기</button><span class="note">${s.seen}/${s.total}문제 풀어봄</span></div>`}</div>`;
}
function renderNotes(){
 const A=$("#v-notes");
 if(NOTE&&UID[NOTE]){A.innerHTML=`<div class="row"><button class="btn small ghost" id="nBack">← 단원 목록</button></div>`+noteHTML(NOTE,false);return}
 const fixes=UNITS.reduce((a,u)=>a+u.fix.length,0);
 A.innerHTML=`<div class="card"><h2>공부의 메인: 문장 구조 S · V · C · O · M</h2><p class="note" style="margin:0">노트 순서 그대로 단원을 만들었습니다. 원래 노트와 다른 부분 ${fixes}곳은 각 단원의 '노트 수정 사항'에 표시했습니다.</p>
  <div class="svcom">${SLOTS.slice(0,5).map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join("")}</div></div>`+
 GROUPS.map((g,gi)=>`<div class="card"><div class="row" style="justify-content:space-between"><h2>${esc(g[0])}</h2><span class="note">${esc(g[1])}</span></div><div class="ulist">${UNITS.filter(u=>u.g===gi).map(u=>{const s=unitStat(u.id);return `<button class="urow" data-unit="${u.id}"><span><span class="mono note">${u.ix}</span> ${esc(u.n)}${u.fix.length?' <span class="fixtag">수정 '+u.fix.length+'</span>':""}</span>${chip(s.m)}<span class="note mono">${s.seen}/${s.total}</span></button>`}).join("")}</div></div>`).join("");
}
$("#v-notes").addEventListener("click",e=>{if(e.target.id==="nBack"){NOTE=null;renderNotes();window.scrollTo(0,0)}});

/* ===================== 분석 ===================== */
function renderStats(){
 const A=$("#v-stats"),all=S.log.filter(x=>!x.rt),g=recentG(30),okg=g.filter(x=>x.ok);
 const acc=g.length?Math.round(okg.length/g.length*100):null,avg=okg.length?Math.round(okg.reduce((a,x)=>a+x.ms,0)/okg.length/1000):null;
 const p=S.plan||makePlan(),em=errMix(),sa=slotAcc(60);
 let h=`<div class="card"><h2>실력 요약</h2><div class="tiles">
  <div><span class="lbl">푼 문제</span><b class="mono">${all.length}</b></div>
  <div><span class="lbl">최근 30 정답률</span><b class="mono">${acc==null?"-":acc+"%"}</b></div>
  <div><span class="lbl">정답 평균 시간</span><b class="mono">${avg==null?"-":avg+"초"}</b></div>
  <div><span class="lbl">연속 학습</span><b class="mono">${streak()}일</b></div></div>
  <p class="note" style="margin:0">Part 5 예상 정답: ${acc==null?"기록 부족":"약 "+Math.round(acc*0.3)+" / 30 (추정: 최근 정답률 × 30)"} · 목표는 문항당 20초 이내</p></div>`;
 h+=vStatsHTML();
 h+=`<div class="card"><h2>단원별 실력</h2><p class="note" style="margin:0">최근 20문제 기준, 최근 것일수록 크게 반영. 3문제 미만은 미학습.</p><div class="bars">${UNITS.map(u=>{const s=unitStat(u.id),l=lvl(s.m);return `<button class="brow" data-unit="${u.id}"><span class="bn">${esc(u.n)}</span><span class="bt"><i class="${l[1]}" style="width:${s.m||0}%"></i></span><span class="bv mono">${s.m==null?"-":s.m+"%"}</span></button>`}).join("")}</div></div>`;
 h+=`<div class="card chart"><h2>최근 14일</h2>${trendSVG()}</div>`;
 const slotRows=SLOTS.map(s=>{const L2=S.log.filter(x=>(x.sl===0||x.sl===1)&&BYID[x.id]&&BYID[x.id].r===s[0]);return [s,L2.length,L2.length?Math.round(L2.filter(x=>x.sl).length/L2.length*100):null]});
 h+=`<div class="card"><h2>자리 판단 (S·V·O·C·M) 정답률</h2><p class="note" style="margin:0">문제 풀기 전 '빈칸은 어떤 자리?' 단계 기록. 낮은 자리가 구조 분석 약점입니다.${sa.n?" 최근 "+sa.n+"회 "+sa.acc+"%":""}</p><div class="tbl"><table><thead><tr><th>자리</th><th style="text-align:right">시도</th><th style="text-align:right">정답률</th></tr></thead><tbody>${slotRows.map(r=>`<tr><td>${r[0][0]==="J"?"연결":r[0][0]} ${esc(r[0][1])}</td><td class="n">${r[1]}</td><td class="n">${r[2]==null?"-":r[2]+"%"}</td></tr>`).join("")}</tbody></table></div></div>`;
 const EN={concept:"개념을 몰라서",slot:"자리 판단 실수",vocab:"단어 뜻 몰라서",time:"시간 부족·찍음"};
 h+=`<div class="card"><h2>틀린 이유 (최근 20개)</h2>${em.n?`<div class="bars">${Object.entries(em.c).map(([k,v])=>`<div class="brow"><span class="bn">${EN[k]}</span><span class="bt"><i class="lv1" style="width:${Math.round(v/em.n*100)}%"></i></span><span class="bv mono">${v}</span></div>`).join("")}</div>`:`<p class="empty">틀린 문제에서 이유를 고르면 여기에 쌓입니다.</p>`}</div>`;
 const worst=Object.entries(S.qs).filter(([id,v])=>v.n>=2&&BYID[id]&&BYID[id].kind==="g").sort((a,b)=>a[1].c/a[1].n-b[1].c/b[1].n).slice(0,5);
 h+=`<div class="card"><h2>자주 틀린 문제</h2>${worst.length?`<div class="tbl"><table><thead><tr><th>문제</th><th>정답</th><th style="text-align:right">정답/시도</th></tr></thead><tbody>${worst.map(([id,v])=>{const q=BYID[id];return `<tr><td>${esc(q.s)}</td><td>${esc(q.c[q.a])}</td><td class="n">${v.c}/${v.n}</td></tr>`}).join("")}</tbody></table></div>`:`<p class="empty">같은 문제를 2번 이상 풀면 나옵니다.</p>`}</div>`;
 h+=`<div class="card"><h2>다음 세션 계획 (자동)</h2><ul class="alog"><li>집중 단원: <b>${esc(UID[p.focus].n)}</b> — ${esc(p.why)}</li><li>노트 먼저 보기: ${p.lessonFirst?"예":"아니오"}</li><li>자리 판별 단계: ${p.slot?"켬":"생략"} · 속도 목표: ${p.speed?p.speed+"초":"없음"} · 단어 ${p.words}개</li><li>오늘 복습 대상: ${BANK.filter(q=>S.qs[q.id]&&S.qs[q.id].due<=TODAY).length}문제</li></ul></div>`;
 h+=`<div class="card"><h2>조정 기록</h2>${S.adapt.length?`<ul class="alog">${S.adapt.slice().reverse().slice(0,15).map(a=>`<li><span class="mono note">${a.d.slice(5).replace("-","/")}</span> ${esc(a.m)}</li>`).join("")}</ul>`:`<p class="empty">아직 없음</p>`}</div>`;
 A.innerHTML=h;
}
function trendSVG(){
 const W=640,H=200,pl=34,pr=34,pt=12,pb=26,days=[];for(let i=13;i>=0;i--)days.push(addDays(TODAY,-i));
 const mx=Math.max(10,...days.map(d=>S.days[d]?S.days[d].n:0)),bw=(W-pl-pr)/14;
 const X=i=>pl+bw*i+bw/2,Yn=v=>pt+(H-pt-pb)*(1-v/mx),Ya=v=>pt+(H-pt-pb)*(1-v/100);
 let g="";[0,50,100].forEach(v=>{g+=`<line x1="${pl}" x2="${W-pr}" y1="${Ya(v)}" y2="${Ya(v)}" stroke="var(--line)"/><text x="${W-pr+4}" y="${Ya(v)+4}" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono,monospace">${v}%</text>`});
 g+=`<text x="${pl-4}" y="${pt+8}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono,monospace">${mx}</text>`;
 const pts=[];days.forEach((d,i)=>{const x=S.days[d];if(x&&x.n){g+=`<rect x="${X(i)-bw*0.3}" y="${Yn(x.n)}" width="${bw*0.6}" height="${H-pb-Yn(x.n)}" fill="var(--omr-soft)" stroke="var(--omr)" stroke-width="1"/>`;pts.push([X(i),Ya(x.c/x.n*100)])}
  if(i%2===0||i===13)g+=`<text x="${X(i)}" y="${H-8}" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="IBM Plex Mono,monospace">${d.slice(5).replace("-","/")}</text>`});
 if(pts.length>1)g+=`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
 pts.forEach((p,i)=>g+=`<circle cx="${p[0]}" cy="${p[1]}" r="${i===pts.length-1?4.5:3}" fill="var(--ink)"/>`);
 if(!pts.length)g+=`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="13" fill="var(--muted)">세션을 풀면 날짜별 기록이 그려집니다</text>`;
 return `<p class="note" style="margin:0">막대 = 푼 문제 수 · 선 = 정답률</p><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="최근 14일 학습량과 정답률">${g}</svg>`;
}

/* ===================== 실전 전략 ===================== */
function renderStrat(){
 $("#stratArea").innerHTML=`<div class="card"><h2>Part 5 빈칸 판별 순서 (시험장용)</h2>
 <ol class="steps2">
  <li><b>보기 4개부터 본다 (3초)</b><span>같은 어근·다른 품사 → 품사 문제 / 같은 동사·다른 형태 → 동사 문제 / 접속사·전치사·관계사 → 연결어 문제 / 뜻이 다른 단어 → 어휘 문제</span></li>
  <li><b>품사 문제 → S·V·C·O·M</b><span>문장의 동사에 동그라미 → 빈칸이 S·O(명사), C(형용사·명사), M(부사) 중 어디인지. 해석하지 않는다.</span></li>
  <li><b>동사 문제 → 수 일치 → 태 → 시제</b><span>주어 단수/복수 → 빈칸 뒤 목적어 유무 → 시간 표현 순서로 지운다.</span></li>
  <li><b>연결어 문제 → 빈칸 뒤 구조</b><span>주어+동사 → 접속사 / 명사만 → 전치사 / 주어·목적어 빠짐 → 관계대명사·what / 완전한 문장 → that·관계부사</span></li>
  <li><b>어휘 문제 → 짝 단어</b><span>앞뒤 단어와 짝(comply with, take effect)부터. 모르면 10초 안에 찍고 표시.</span></li>
 </ol>
 <div class="tbl"><table><thead><tr><th>파트</th><th style="text-align:right">목표 시간</th></tr></thead><tbody><tr><td>Part 5 (30문항)</td><td class="n">10분</td></tr><tr><td>Part 6 (16문항)</td><td class="n">8분</td></tr><tr><td>Part 7 (54문항)</td><td class="n">55분</td></tr></tbody></table></div>
 <p class="note" style="margin:0">준비물: 신분증 · 연필 · 지우개 · 아날로그 시계. 전자기기 반입 제한.</p></div>
 <div class="card"><h2>Part 6·7 질문 유형별 전략</h2><div class="tbl"><table><thead><tr><th>유형</th><th>질문 모양</th><th>푸는 법</th></tr></thead><tbody>
  <tr><td>Part 6 단어·문법</td><td>빈칸 1개 + 보기 4개</td><td>Part 5처럼 자리 판단. 단, 시제·대명사는 앞뒤 문장까지 확인</td></tr>
  <tr><td>Part 6 문장 고르기</td><td>빈칸에 들어갈 문장</td><td>빈칸 앞뒤 문장의 지시어(this, they)·연결어(however)와 이어지는 것</td></tr>
  <tr><td>주제·목적</td><td>What is the purpose of ~?</td><td>첫 2~3문장. 마지막 단락의 요청도 확인</td></tr>
  <tr><td>육하원칙</td><td>When / Where / What ~?</td><td>질문 키워드를 지문에서 찾고 그 문장만 읽기</td></tr>
  <tr><td>NOT·True</td><td>What is (NOT) mentioned/true?</td><td>보기 4개를 지문과 하나씩 대조해 지우기</td></tr>
  <tr><td>추론</td><td>What is suggested / most likely?</td><td>지문 근거 + 한 단계만 추론. 지나친 확대 해석 X</td></tr>
  <tr><td>의도 파악</td><td>What does X mean when he writes "~"?</td><td>바로 앞 메시지에 대한 반응으로 해석</td></tr>
  <tr><td>문장 위치</td><td>[1]~[4] 중 문장이 들어갈 곳</td><td>주어진 문장의 대명사·연결어가 가리킬 대상이 바로 앞에 있는 곳</td></tr>
  <tr><td>동의어</td><td>"X" is closest in meaning to</td><td>사전 뜻이 아니라 문맥 뜻으로. 단어장의 'Part 7 동의어' 테스트로 연습</td></tr>
 </tbody></table></div></div>`;
}

/* ===================== 설정 · 자가 점검 ===================== */
function renderSet(){
 const h=S.health||selfCheck();
 $("#v-set").innerHTML=`
 ${typeof window.claude==="undefined"||!window.claude?`<div class="card"><h2>기기 간 동기화</h2>
  ${GH?`<p style="margin:0"><b>연결됨</b> · ${esc(GH.owner)}/${esc(GH.repo)}</p><p class="note" style="margin:0" id="ghStat">${esc(ghState)}</p>
   <div class="row"><button class="btn small" id="ghNow">지금 동기화</button><button class="btn small ghost" id="ghOff">이 기기 연결 해제</button></div>`
  :`<p class="note" style="margin:0">기록을 비공개 GitHub 저장소에 저장해 PC·휴대폰 어디서든 같은 기록으로 이어 풉니다. 기기마다 한 번만 입력하면 됩니다.</p>
   <div class="setrow"><label for="ghOwner">GitHub 아이디</label><input id="ghOwner" value="kkachi980208" autocomplete="off"></div>
   <div class="setrow"><label for="ghRepo">기록 저장소</label><input id="ghRepo" value="toeic900-data" autocomplete="off"></div>
   <div class="setrow"><label for="ghTok">토큰</label><input id="ghTok" type="password" placeholder="github_pat_…" autocomplete="off"></div>
   <div class="row"><button class="btn small" id="ghOn">연결</button><span class="note" id="ghMsg"></span></div>
   <p class="note" style="margin:0">처음 한 번: <a href="https://github.com/new?name=toeic900-data&visibility=private&description=TOEIC%20900%20study%20record" target="_blank" rel="noopener">① 비공개 저장소 만들기</a> → <a href="https://github.com/settings/personal-access-tokens/new?name=toeic900-sync&description=TOEIC%20900%20sync&target_name=kkachi980208&expires_in=365&contents=write" target="_blank" rel="noopener">② 토큰 만들기</a> (Repository access에서 toeic900-data만 선택) → 토큰을 위 칸에 붙여넣고 연결.</p>
   <p class="note" style="margin:0">토큰은 이 기기 브라우저에만 보관되고 화면에 다시 표시되지 않습니다. 다른 기기용으로 메모장 등에 보관하세요.</p>`}</div>`:""}
 ${window.claude?`<div class="card"><h2>저장 상태</h2><p style="margin:0" id="syncState">${esc(dbState)}</p><p class="note" style="margin:0">클라우드 저장이 연결되면 다른 기기에서도 이어지고, 매일 자동 개선 작업이 이 기록을 읽어 새 문제를 추가합니다.</p></div>`:""}
 <div class="card"><div class="row" style="justify-content:space-between"><h2>자가 점검</h2><button class="btn small" id="chkRun">다시 점검</button></div>
  <ul class="alog"><li>문제 은행: 문법 ${h.bank.grammar} · 듣기 ${h.bank.lc} · 독해 ${h.bank.rc} (자동 추가 ${h.bank.extra})</li><li>제외된 손상 문제: ${h.bank.broken}개</li><li>자동 복구한 기록: ${h.fixed}건</li><li>점검 시각: ${new Date(h.ts).toLocaleString("ko-KR")} · 버전 ${esc(h.ver)}</li></ul>
  ${h.issues.length?`<div class="explain bad"><b>발견된 문제</b><ul class="trap">${h.issues.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:`<div class="explain"><b>이상 없음</b> 문제·기록 모두 정상</div>`}</div>
 <div class="card"><h2>학습 설정</h2>
  <div class="setrow"><span>세션 문제 수</span><div class="seg" id="setSize">${[10,15,20].map(n=>`<button data-v="${n}" aria-pressed="${+S.settings.size===n}">${n}</button>`).join("")}</div></div>
  <div class="setrow"><span>자리 판별 단계</span><div class="seg" id="setSlot">${[["auto","자동"],["on","항상"],["off","끄기"]].map(x=>`<button data-v="${x[0]}" aria-pressed="${S.settings.slot===x[0]}">${x[1]}</button>`).join("")}</div></div>
  <div class="setrow"><span>속도 훈련</span><div class="seg" id="setSpeed">${[["auto","자동"],["on","항상"],["off","끄기"]].map(x=>`<button data-v="${x[0]}" aria-pressed="${S.settings.speed===x[0]}">${x[1]}</button>`).join("")}</div></div>
  <p class="note" style="margin:0">자동: 자리 판단 정답률 90% 이상이면 단계를 생략하고, 정답 평균이 22초를 넘으면 속도 목표를 켭니다.</p></div>
 <div class="card"><h2>Claude 개선 기록</h2>${UPD.length?`<ul class="alog">${UPD.map(u=>`<li><span class="mono note">${esc(String(u.d||"").slice(5))}</span> <b>${esc(u.title||"")}</b> ${esc(u.body||"")}</li>`).join("")}</ul>`:`<p class="empty">매일 자동 개선 작업이 기록을 분석해 약점 단원 문제를 추가하면 여기에 남습니다.</p>`}</div>
 <div class="card"><h2>백업 · 복원</h2>
  <div class="row"><button class="btn small" id="bkCopy">백업 복사</button><span class="note" id="bkMsg"></span></div>
  <textarea id="bkText" rows="3" placeholder="복원할 백업 내용을 붙여넣기"></textarea>
  <div class="row"><button class="btn small ghost" id="bkLoad">붙여넣은 내용으로 복원</button></div></div>
 <div class="card"><h2>기록 초기화</h2><p class="note" style="margin:0">모든 풀이 기록·분석이 지워집니다. 시험일과 점수 기록은 유지.</p><div class="row"><button class="btn small ghost" id="rstBtn">초기화</button></div></div>`;
}
$("#v-set").addEventListener("click",async e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.id==="chkRun"){selfCheck();save();renderSet();return}
 if(b.id==="ghOn"){const owner=$("#ghOwner").value.trim(),repo=$("#ghRepo").value.trim(),token=$("#ghTok").value.trim();
  if(!owner||!repo||!token){$("#ghMsg").textContent="세 칸을 모두 입력하세요";return}
  GH={owner,repo,token,path:"progress.json"};$("#ghMsg").textContent="연결 확인 중…";
  try{await ghPull()}catch(x){GH=null;$("#ghMsg").textContent=x&&x.code==="auth"?"토큰 권한 오류: 저장소 선택·Contents 읽기/쓰기 권한을 확인하세요":"저장소에 연결하지 못했습니다 ("+(x&&x.code||"네트워크")+")";return}
  try{localStorage.setItem(GH_KEY,JSON.stringify(GH))}catch(x){}
  await ghSyncNow();renderSet();return}
 if(b.id==="ghNow"){await ghSyncNow();renderSet();return}
 if(b.id==="ghOff"){if(b.dataset.sure!=="1"){b.dataset.sure="1";b.textContent="연결 해제 (기록은 이 기기와 저장소에 남음)";return}
  GH=null;try{localStorage.removeItem(GH_KEY)}catch(x){}ghSetState("");renderSet();renderSync();return}
 const seg=b.closest(".seg");
 if(seg&&seg.id==="setSize"){S.settings.size=+b.dataset.v;save();renderSet();return}
 if(seg&&seg.id==="setSlot"){S.settings.slot=b.dataset.v;refreshPlan();save();renderSet();return}
 if(seg&&seg.id==="setSpeed"){S.settings.speed=b.dataset.v;refreshPlan();save();renderSet();return}
 if(b.id==="bkCopy"){const t=JSON.stringify(S);try{await navigator.clipboard.writeText(t);$("#bkMsg").textContent="복사됨 ("+Math.round(t.length/1024)+"KB). 메모장 등에 붙여 보관."}catch(x){const ta=$("#bkText");ta.value=t;ta.select();$("#bkMsg").textContent="자동 복사가 막혀 아래 칸에 넣었습니다. 전체 선택 후 복사하세요."}return}
 if(b.id==="bkLoad"){let o;try{o=JSON.parse($("#bkText").value)}catch(x){$("#bkMsg").textContent="백업 형식이 아닙니다 (JSON 오류)";return}
  if(!o||o.v!==2){$("#bkMsg").textContent="이 앱 2.0의 백업이 아닙니다";return}
  if(b.dataset.sure!=="1"){b.dataset.sure="1";b.textContent="현재 기록을 덮어쓰고 복원";return}
  S=normalize(o);selfCheck();save();renderAll();$("#bkMsg").textContent="복원 완료";return}
 if(b.id==="rstBtn"){if(b.dataset.sure!=="1"){b.dataset.sure="1";b.textContent="정말 초기화";return}
  const keep={exam:S.exam,scores:S.scores,mocks:S.mocks};S=normalize(Object.assign(blankState(),keep));adaptLog("기록 초기화");selfCheck();save();renderAll();return}
});

function renderAll(){if(typeof vMyRebuild==="function")vMyRebuild();renderVoca();renderHome();renderStrat();renderNotes();if(!$("#v-stats").hidden)renderStats();if(!$("#v-set").hidden)renderSet();if(!$("#v-run").hidden)renderRun();try{renderMock();renderLog()}catch(e){}renderSync()}

document.addEventListener("keydown",e=>{
 if($("#v-run").hidden||!S.cur||e.target.closest("input,textarea,select")||e.metaKey||e.ctrlKey||e.altKey)return;
 const k=e.key.toLowerCase(),A=$("#v-run");let el=null;
 const sm={s:"S",v:"V",o:"O",c:"C",m:"M",j:"J"};
 if(A.querySelector("[data-slot]")&&sm[k])el=A.querySelector('[data-slot="'+sm[k]+'"]');
 else if("abcd".includes(k)&&k.length===1)el=A.querySelector('[data-pick="'+"abcd".indexOf(k)+'"]:not([disabled])');
 else if("1234".includes(k)&&k.length===1)el=A.querySelector('[data-pick="'+(+k-1)+'"]:not([disabled])');
 else if(k==="enter"||k===" ")el=A.querySelector("#rNext,#rLessonDone,#rFinish");
 if(el){e.preventDefault();el.click()}
});
