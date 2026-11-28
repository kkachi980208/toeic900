/* ===================== 단어장 (기출 보카식 30일 + 내 단어장) ===================== */
const VW=[],VBYID={},VBROKEN=[];
function vAdd(x,day,id,src){
 const o={id,day,w:x[0],pos:x[1]||"",ko:x[2],pt:x[3]||"",ex:x[4]||"",exk:x[5]||"",syn:x[6]||"",src};
 if(!o.w||!o.ko||VBYID[id]){VBROKEN.push(id);return}
 VW.push(o);VBYID[id]=o;
}
VOCA.forEach(d=>d.w.forEach((x,i)=>vAdd(x,d.d,"v"+d.d+"-"+i,"기본")));
const VDAYS=VOCA.map(d=>({d:d.d,t:d.t}));
function vMyRebuild(){
 for(let i=VW.length-1;i>=0;i--)if(VW[i].day===0){delete VBYID[VW[i].id];VW.splice(i,1)}
 (S.myw||[]).forEach(m=>vAdd([m.w,m.pos,m.ko,m.pt,m.ex,"",m.syn],0,m.id,"내 단어"));
}
const VTYPE={m:"뜻 고르기",r:"단어 고르기",b:"Part 5 어휘 빈칸",s:"Part 7 동의어"};
function vStat(id){return S.vq[id]}
function vMastered(id){const v=S.vq[id];return !!v&&v.box>=3}
function vDayWords(day){return VW.filter(x=>x.day===day)}
function vRecord(o,ok,k){
 const v=S.vq[o.id]||{n:0,c:0,box:0,due:TODAY,last:TODAY};v.n++;if(ok)v.c++;v.last=TODAY;
 const IV=[0,1,2,4,7,15];
 if(ok){v.box=Math.min(5,(v.box||0)+1);v.due=addDays(TODAY,IV[v.box])}else{v.box=1;v.due=addDays(TODAY,1)}
 S.vq[o.id]=v;
 if(k){S.vlog.push({t:Date.now(),d:TODAY,id:o.id,k,ok:ok?1:0});if(S.vlog.length>800)S.vlog=S.vlog.slice(-800)}
}
function vDue(){return VW.filter(o=>S.vq[o.id]&&S.vq[o.id].due<=TODAY).sort((a,b)=>S.vq[a.id].box-S.vq[b.id].box)}
function vCurrentDay(){for(const d of VDAYS){const ws=vDayWords(d.d);if(ws.some(o=>!vMastered(o.id)))return d.d}return VDAYS[VDAYS.length-1].d}
/* --- 문제 만들기 --- */
function inflect(w,f){
 if(f==="ing"){if(/ie$/.test(w))return w.slice(0,-2)+"ying";if(/[^e]e$/.test(w))return w.slice(0,-1)+"ing";return w+"ing"}
 if(f==="ed"){if(/e$/.test(w))return w+"d";if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+"ied";return w+"ed"}
 if(f==="s"){if(/(s|x|sh|ch)$/.test(w))return w+"es";if(/[^aeiou]y$/.test(w))return w.slice(0,-1)+"ies";return w+"s"}
 return w;
}
function vFindToken(o){
 const ex=o.ex;if(!ex)return null;const w=o.w.toLowerCase();
 if(w.includes(" ")||w.includes("-")){const i=ex.toLowerCase().indexOf(w);return i<0?null:{i,len:w.length,form:""}}
 const re=/[A-Za-zÀ-ÿ'-]+/g;let m;
 while((m=re.exec(ex))){const t=m[0].toLowerCase();
  if(t===w)return {i:m.index,len:m[0].length,form:""};
  for(const f of ["s","ed","ing"])if(inflect(w,f)===t)return {i:m.index,len:m[0].length,form:f};
 }
 return null;
}
function vPick(arr,k,ex){const a=shuffle(arr.filter(x=>!ex.includes(x)));return a.slice(0,k)}
function vMakeQ(o,k,pool){
 const same=pool.filter(x=>x.id!==o.id);
 const others=same.length>=8?same:VW.filter(x=>x.id!==o.id);
 if(k==="b"){
  const tk=vFindToken(o);
  const cand=others.filter(x=>x.pos===o.pos&&!/[ -]/.test(x.w)&&x.w.toLowerCase()!==o.w.toLowerCase()).map(x=>x.w);
  if(tk&&cand.length>=3&&!/[ -]/.test(o.w)){
   const ds=vPick([...new Set(cand)],3,[o.w]).map(w=>inflect(w,tk.form));
   const right=o.ex.substr(tk.i,tk.len),cap=/^[A-Z]/.test(right);
   const fix=s=>cap?s[0].toUpperCase()+s.slice(1):s;
   const opts=shuffle([right,...ds.map(fix)]);
   return {k,o,stem:o.ex.slice(0,tk.i)+"____"+o.ex.slice(tk.i+tk.len),c:opts,a:opts.indexOf(right)};
  }
  k="m";
 }
 if(k==="s"){
  const sy=others.map(x=>x.syn).filter(s=>s&&s!==o.syn&&s.toLowerCase()!==o.w.toLowerCase());
  if(o.syn&&sy.length>=3){
   const opts=shuffle([o.syn,...vPick([...new Set(sy)],3,[o.syn])]);
   const tk=vFindToken(o);
   const sent=tk?esc(o.ex.slice(0,tk.i))+"<u><b>"+esc(o.ex.substr(tk.i,tk.len))+"</b></u>"+esc(o.ex.slice(tk.i+tk.len)):esc(o.ex);
   return {k,o,stemHTML:sent,q:`밑줄 친 "${o.ex.substr(tk?tk.i:0,tk?tk.len:0)||o.w}"와 뜻이 가장 가까운 것은?`,c:opts,a:opts.indexOf(o.syn)};
  }
  k="m";
 }
 if(k==="r"){
  const ds=vPick([...new Set(others.map(x=>x.w))],3,[o.w]);const opts=shuffle([o.w,...ds]);
  return {k,o,q:o.ko,c:opts,a:opts.indexOf(o.w)};
 }
 const ds=vPick([...new Set(others.map(x=>x.ko))],3,[o.ko]);const opts=shuffle([o.ko,...ds]);
 return {k:"m",o,q:o.w,c:opts,a:opts.indexOf(o.ko)};
}
function vBuildTest(words,poolForDistractors,n){
 const ks=["m","r","b","s"],L2=shuffle(words.slice()).slice(0,n||20);
 return L2.map((o,i)=>{const pref=ks[i%4];return vMakeQ(o,pref,poolForDistractors)});
}
/* --- 화면 --- */
let VV={view:"list",day:1,hide:false,mode:null,card:null,test:null};
function speakWord(t){try{const sy=window.speechSynthesis;if(!sy)return;sy.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.85;sy.speak(u)}catch(e){}}
function vDayChip(d){const ws=vDayWords(d),m=ws.filter(o=>vMastered(o.id)).length,seen=ws.filter(o=>S.vq[o.id]).length;return {m,seen,n:ws.length}}
function renderVoca(){
 const A=$("#v-voca");if(!A)return;
 if(VV.mode==="card")return renderVCard(A);
 if(VV.mode==="test")return renderVTest(A);
 if(VV.view==="day")return renderVDay(A);
 const due=vDue(),cur=vCurrentDay(),mastered=VW.filter(o=>o.day>0&&vMastered(o.id)).length,total=VW.filter(o=>o.day>0).length;
 const vl=S.vlog.slice(-60),acc=vl.length?Math.round(vl.filter(x=>x.ok).length/vl.length*100):null;
 A.innerHTML=`<div class="card sscard"><div class="row" style="justify-content:space-between"><span class="lbl">단어 공부</span><span class="note mono">외운 단어 ${mastered} / ${total}</span></div>
  <div class="big">DAY ${cur} · ${esc((VDAYS.find(x=>x.d===cur)||{}).t||"")}</div>
  <p class="note" style="margin:0">주제별 30일 구성 · 단어마다 뜻·출제포인트·예문·유의어 · 테스트는 뜻 고르기 / 단어 고르기 / Part 5 어휘 빈칸 / Part 7 동의어${acc!=null?" · 최근 정답률 "+acc+"%":""}</p>
  <div class="row"><button class="btn" data-vday="${cur}">DAY ${cur} 공부하기</button>${due.length?`<button class="btn ghost" id="vDueTest">복습 테스트 (${Math.min(due.length,20)})</button>`:""}</div></div>
 <div class="card"><h2>30일 단어장</h2><p class="note" style="margin:0">초록 = 외운 단어 비율(연속 3번 이상 맞힘)</p><div class="vgrid">${VDAYS.map(d=>{const c=vDayChip(d.d);return `<button class="vtile${d.d===cur?" cur":""}" data-vday="${d.d}"><span class="mono">${d.d>30?"VIDEO":"DAY "+String(d.d).padStart(2,"0")}</span><b>${esc(d.t)}</b><span class="vbar"><i style="width:${c.n?Math.round(c.m/c.n*100):0}%"></i></span><span class="note mono">${c.m}/${c.n}</span></button>`}).join("")}
  <button class="vtile my" data-vday="0"><span class="mono">MY</span><b>내 단어장</b><span class="note">책에서 직접 추가</span><span class="note mono">${vDayWords(0).length}개</span></button></div></div>`;
}
function renderVDay(A){
 const d=VV.day,ws=vDayWords(d),th=d===0?"내 단어장":(VDAYS.find(x=>x.d===d)||{}).t;
 let h=`<div class="row"><button class="btn small ghost" id="vBack">← 단어장</button></div>
 <div class="card"><div class="row" style="justify-content:space-between"><span class="lbl">${d===0?"MY":"DAY "+String(d).padStart(2,"0")}</span><span class="note mono">${ws.filter(o=>vMastered(o.id)).length}/${ws.length} 외움</span></div><h2>${esc(th)}</h2>
  <div class="row">${ws.length?`<button class="btn" id="vCard">암기 카드</button><button class="btn" id="vTest">테스트 ${Math.min(20,ws.length)}문제</button>`:""}<button class="btn small ghost" id="vHide" aria-pressed="${VV.hide}">${VV.hide?"뜻 보이기":"뜻 가리기"}</button></div></div>`;
 if(d===0)h+=`<div class="card"><h2>단어 추가</h2><p class="note" style="margin:0">교재(예: 기출 보카)에서 외울 단어를 직접 넣으면 같은 방식으로 카드·테스트에 나옵니다.</p>
  <div class="vform"><input id="mwW" placeholder="단어 (예: comply)" autocomplete="off"><input id="mwK" placeholder="뜻 (예: 준수하다)" autocomplete="off"><input id="mwE" placeholder="예문 (선택)" autocomplete="off"><input id="mwS" placeholder="유의어 (선택)" autocomplete="off"></div>
  <div class="row"><button class="btn small" id="mwAdd">추가</button><span class="note" id="mwMsg"></span></div></div>`;
 h+=`<div class="card vlist">${ws.length?ws.map(o=>{const v=S.vq[o.id];return `<div class="vrow"><div class="vw"><button class="spk" data-say="${esc(o.w)}" aria-label="발음 듣기">▶</button><b>${esc(o.w)}</b><span class="note">${esc(o.pos)}</span>${v?`<span class="vdot b${Math.min(v.box,5)}" title="복습 단계 ${v.box}"></span>`:""}${d===0?`<button class="btn small ghost" data-mwdel="${o.id}">삭제</button>`:""}</div>
  <div class="vko${VV.hide?" hid":""}" data-reveal>${esc(o.ko)}</div>
  ${o.pt?`<div class="vpt"><span class="fixtag ok">출제포인트</span> ${esc(o.pt)}</div>`:""}
  ${o.ex?`<div class="vex">${esc(o.ex)}${o.exk?`<span class="note${VV.hide?" hid":""}" data-reveal> ${esc(o.exk)}</span>`:""}</div>`:""}
  ${o.syn?`<div class="note">유의어: ${esc(o.syn)}</div>`:""}</div>`}).join(""):`<p class="empty">아직 단어가 없습니다.</p>`}</div>`;
 A.innerHTML=h;
}
function renderVCard(A){
 const c=VV.card,o=VBYID[c.ids[c.i]];
 if(!o){A.innerHTML=`<div class="card"><h2>카드 완료</h2><p style="margin:0">알아요 ${c.k} / ${c.ids.length}</p><div class="row"><button class="btn" id="vTest">이어서 테스트</button><button class="btn ghost" id="vExit">단어 목록</button></div></div>`;return}
 A.innerHTML=`<div class="card"><div class="row" style="justify-content:space-between"><span class="lbl">암기 카드 · ${c.i+1}/${c.ids.length}</span><button class="btn small ghost" id="vExit">그만하기</button></div>
 <button class="flash vflash" id="vFlip"><div><div class="en">${esc(o.w)}</div><div class="note">${esc(o.pos)}</div>${c.flip?`<div class="ko">${esc(o.ko)}</div>${o.pt?`<div class="vpt">${esc(o.pt)}</div>`:""}${o.ex?`<div class="vex">${esc(o.ex)}<br><span class="note">${esc(o.exk)}</span></div>`:""}${o.syn?`<div class="note">유의어: ${esc(o.syn)}</div>`:""}`:`<div class="note">탭해서 뜻 보기</div>`}</div></button>
 <div class="row"><button class="btn small ghost spk2" data-say="${esc(o.w)}">▶ 발음</button></div>
 <div class="actbar"><div class="in"><button class="btn ghost" id="vUnk">몰라요</button><button class="btn" id="vKnow">알아요</button></div></div></div>`;
}
function renderVTest(A){
 const t=VV.test,q=t.qs[t.i];
 if(!q){const ok=t.ans.filter((a,i)=>a===t.qs[i].a).length,per={};t.qs.forEach((x,i)=>{per[x.k]=per[x.k]||[0,0];per[x.k][1]++;if(t.ans[i]===x.a)per[x.k][0]++});
  const wrong=t.qs.filter((x,i)=>t.ans[i]!==x.a);
  A.innerHTML=`<div class="card"><div class="res"><div class="big mono">${ok}<span style="font-size:20px">/${t.qs.length}</span></div><div class="note">${esc(t.title)}</div></div>
  <div class="tbl"><table><thead><tr><th>유형</th><th style="text-align:right">정답</th></tr></thead><tbody>${Object.entries(per).map(([k,v])=>`<tr><td>${VTYPE[k]}</td><td class="n">${v[0]}/${v[1]}</td></tr>`).join("")}</tbody></table></div>
  ${wrong.length?`<h3>틀린 단어 (내일 복습에 다시 나옴)</h3><div class="tbl"><table><tbody>${wrong.map(x=>`<tr><td><b>${esc(x.o.w)}</b></td><td>${esc(x.o.ko)}</td><td class="note">${esc(x.o.pt)}</td></tr>`).join("")}</tbody></table></div>`:""}
  <div class="row"><button class="btn" id="vRetry">${wrong.length?"틀린 단어만 다시":"한 번 더"}</button><button class="btn ghost" id="vExit">단어 목록</button></div></div>`;return}
 const pk=t.ans[t.i];
 let stem="";
 if(q.k==="m")stem=`<div class="vq"><span class="tagc">${VTYPE.m}</span><div class="vbig">${esc(q.q)}</div><button class="btn small ghost spk2" data-say="${esc(q.o.w)}">▶ 발음</button></div>`;
 else if(q.k==="r")stem=`<div class="vq"><span class="tagc">${VTYPE.r}</span><div class="vbig">${esc(q.q)}</div></div>`;
 else if(q.k==="b")stem=`<div class="vq"><span class="tagc">${VTYPE.b}</span><div class="q-stem">${esc(q.stem).replace("____",pk==null?'<span class="blank">빈칸</span>':`<span class="blank on${pk===q.a?" ok":" ng"}">${esc(q.c[pk])}</span>`)}</div></div>`;
 else stem=`<div class="vq"><span class="tagc">${VTYPE.s}</span><div class="q-stem">${q.stemHTML}</div><b>${esc(q.q)}</b></div>`;
 A.innerHTML=`<div class="card qcard"><div class="row" style="justify-content:space-between"><span class="lbl">${esc(t.title)} · ${t.i+1}/${t.qs.length}</span><button class="btn small ghost" id="vExit">그만하기</button></div>
 <div class="sbar">${t.qs.map((x,i)=>`<i class="${i<t.i?(t.ans[i]===x.a?"d":"x"):i===t.i?"c":""}"></i>`).join("")}</div>
 ${stem}
 <div class="choices">${q.c.map((x,j)=>{let cl="";if(pk!=null){if(j===q.a)cl=" right";else if(j===pk)cl=" wrong"}return `<button class="choice${cl}" data-vpick="${j}" ${pk!=null?"disabled":""}><span class="bub" aria-pressed="${pk===j}">${L[j]}</span><span>${esc(x)}</span></button>`}).join("")}</div>
 ${pk!=null?`<div class="explain${pk===q.a?"":" bad"}" id="vExp"><b>${pk===q.a?"정답":"오답 · 정답 ("+L[q.a]+")"}</b> <b>${esc(q.o.w)}</b> ${esc(q.o.pos)} ${esc(q.o.ko)}${q.o.pt?" — "+esc(q.o.pt):""}${q.k!=="b"&&q.o.ex?`<div class="vex">${esc(q.o.ex)} <span class="note">${esc(q.o.exk)}</span></div>`:""}${q.k==="b"&&q.o.exk?`<div class="note">${esc(q.o.exk)}</div>`:""}</div>
  <div class="actbar"><div class="in"><button class="btn" id="vNext">${t.i+1<t.qs.length?"다음 ("+(t.i+2)+"/"+t.qs.length+")":"결과 보기"}</button></div></div>`:""}</div>`;
 if(pk!=null&&window.innerWidth<=640&&VV.scroll){VV.scroll=false;const e=$("#vExp");if(e)e.scrollIntoView({block:"center"})}
}
function vStartTest(words,title){
 const pool=VV.day>0?vDayWords(VV.day):VW;
 VV.test={qs:vBuildTest(words,pool.length>=8?pool:VW,20),i:0,ans:[],title,words};VV.mode="test";
 document.body.classList.add("running");renderVoca();window.scrollTo(0,0);
}
function vExit(){VV.mode=null;VV.card=null;VV.test=null;document.body.classList.remove("running");renderVoca();window.scrollTo(0,0)}
$("#v-voca").addEventListener("click",e=>{
 const b=e.target.closest("button");
 const rv=e.target.closest("[data-reveal]");if(rv&&rv.classList.contains("hid")){rv.classList.remove("hid");return}
 if(!b)return;
 if(b.dataset.say){speakWord(b.dataset.say);return}
 if(b.dataset.vday!=null){VV.day=+b.dataset.vday;VV.view="day";renderVoca();window.scrollTo(0,0);return}
 if(b.id==="vBack"){VV.view="list";renderVoca();window.scrollTo(0,0);return}
 if(b.id==="vHide"){VV.hide=!VV.hide;renderVoca();return}
 if(b.id==="vDueTest"){VV.day=-1;vStartTest(vDue().slice(0,20),"복습 테스트");return}
 if(b.id==="vCard"){const ws=vDayWords(VV.day);const order=ws.filter(o=>!vMastered(o.id)).concat(ws.filter(o=>vMastered(o.id)));VV.card={ids:order.map(o=>o.id),i:0,k:0,flip:false};VV.mode="card";document.body.classList.add("running");renderVoca();window.scrollTo(0,0);return}
 if(b.id==="vFlip"||b.closest("#vFlip")){VV.card.flip=!VV.card.flip;renderVoca();return}
 if(b.id==="vKnow"||b.id==="vUnk"){const c=VV.card,o=VBYID[c.ids[c.i]];vRecord(o,b.id==="vKnow",null);if(b.id==="vKnow")c.k++;c.i++;c.flip=false;save();renderVoca();return}
 if(b.id==="vTest"){const ws=vDayWords(VV.day>=0?VV.day:vCurrentDay());vStartTest(ws,(VV.day===0?"내 단어장":"DAY "+VV.day)+" 테스트");return}
 if(b.dataset.vpick!=null){const t=VV.test;if(t.ans[t.i]!=null)return;const pk=+b.dataset.vpick,q=t.qs[t.i];t.ans[t.i]=pk;vRecord(q.o,pk===q.a,q.k);VV.scroll=true;save();renderVoca();return}
 if(b.id==="vNext"){VV.test.i++;renderVoca();window.scrollTo(0,0);return}
 if(b.id==="vRetry"){const t=VV.test,w=t.qs.filter((x,i)=>t.ans[i]!==x.a).map(x=>x.o);vStartTest(w.length?w:t.words,t.title);return}
 if(b.id==="vExit"){vExit();return}
 if(b.id==="mwAdd"){const w=$("#mwW").value.trim(),k=$("#mwK").value.trim();if(!w||!k){$("#mwMsg").textContent="단어와 뜻을 입력하세요";return}
  S.myw.push({id:"m"+Date.now(),w,ko:k,ex:$("#mwE").value.trim(),syn:$("#mwS").value.trim(),pos:"",pt:""});vMyRebuild();save();renderVoca();return}
 if(b.dataset.mwdel){if(b.dataset.sure!=="1"){b.dataset.sure="1";b.textContent="삭제 확인";return}S.myw=S.myw.filter(m=>m.id!==b.dataset.mwdel);delete S.vq[b.dataset.mwdel];vMyRebuild();save();renderVoca();return}
});
function vStatsHTML(){
 const vl=S.vlog,last=vl.slice(-100),acc=last.length?Math.round(last.filter(x=>x.ok).length/last.length*100):null;
 const per={};last.forEach(x=>{per[x.k]=per[x.k]||[0,0];per[x.k][1]++;if(x.ok)per[x.k][0]++});
 const dayAcc=VDAYS.map(d=>{const ids=new Set(vDayWords(d.d).map(o=>o.id));const L3=vl.filter(x=>ids.has(x.id));return {d,n:L3.length,acc:L3.length?Math.round(L3.filter(x=>x.ok).length/L3.length*100):null}}).filter(x=>x.n>=5).sort((a,b)=>a.acc-b.acc).slice(0,3);
 const weakW=Object.entries(S.vq).filter(([id,v])=>VBYID[id]&&v.n>=2).sort((a,b)=>a[1].c/a[1].n-b[1].c/b[1].n).slice(0,6);
 return `<div class="card"><h2>단어 실력</h2><div class="tiles"><div><span class="lbl">학습한 단어</span><b class="mono">${Object.keys(S.vq).filter(id=>VBYID[id]).length}</b></div><div><span class="lbl">외운 단어</span><b class="mono">${VW.filter(o=>vMastered(o.id)).length}</b></div><div><span class="lbl">최근 정답률</span><b class="mono">${acc==null?"-":acc+"%"}</b></div><div><span class="lbl">오늘 복습</span><b class="mono">${vDue().length}</b></div></div>
 ${Object.keys(per).length?`<div class="tbl"><table><thead><tr><th>문제 유형</th><th style="text-align:right">정답률 (최근 100)</th></tr></thead><tbody>${Object.entries(per).map(([k,v])=>`<tr><td>${VTYPE[k]}</td><td class="n">${Math.round(v[0]/v[1]*100)}% (${v[0]}/${v[1]})</td></tr>`).join("")}</tbody></table></div>`:`<p class="empty">단어 테스트를 풀면 유형별 정답률이 나옵니다.</p>`}
 ${dayAcc.length?`<p class="note" style="margin:0">약한 DAY: ${dayAcc.map(x=>"DAY "+x.d.d+" "+esc(x.d.t)+" "+x.acc+"%").join(" · ")}</p>`:""}
 ${weakW.length?`<p class="note" style="margin:0">자주 틀린 단어: ${weakW.map(([id,v])=>esc(VBYID[id].w)+"("+v.c+"/"+v.n+")").join(", ")}</p>`:""}</div>`;
}
