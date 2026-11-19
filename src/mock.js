/* ---------- mock test ---------- */
S.mocks=S.mocks||[];
const MOCK=[
 {part:"Part 2",sec:"LC",dir:"▶를 눌러 질문과 응답 (A)(B)(C)를 듣고 가장 알맞은 응답을 고르세요. 보기는 제출 후 공개.",groups:[
  {items:[{audio:["Where should I put these documents?","A. In the top drawer.","B. Yes, I put them there.","C. About ten pages."],c:["In the top drawer.","Yes, I put them there.","About ten pages."],a:0,e:"Where → 장소. Yes/No 응답은 오답."}]},
  {items:[{audio:["When is the new store opening?","A. Next to the bank.","B. Early next month.","C. The door is open."],c:["Next to the bank.","Early next month.","The door is open."],a:1,e:"When → 시점. (A)는 Where 답, (C)는 open 반복 함정."}]},
  {items:[{audio:["Why don't we take a taxi to the station?","A. Because it's late.","B. The train station.","C. Good idea, let's go."],c:["Because it's late.","The train station.","Good idea, let's go."],a:2,e:"Why don't we ~ = 제안. Because로 답하면 함정."}]},
  {items:[{audio:["Has Mr. Davis approved the budget?","A. A budget hotel.","B. He's still reviewing it.","C. In the finance office."],c:["A budget hotel.","He's still reviewing it.","In the finance office."],a:1,e:"아직이라는 간접 응답. budget 반복 함정."}]},
  {items:[{audio:["How many people are coming to the workshop?","A. Next Thursday.","B. It's a car workshop.","C. About thirty."],c:["Next Thursday.","It's a car workshop.","About thirty."],a:2,e:"How many → 숫자."}]},
  {items:[{audio:["Should I call the client now or after lunch?","A. Now would be better.","B. I already had lunch.","C. The client list."],c:["Now would be better.","I already had lunch.","The client list."],a:0,e:"선택 의문문 → 둘 중 하나 선택."}]}
 ]},
 {part:"Part 3",sec:"LC",dir:"대화를 듣고 3문항에 답하세요. 듣기 전에 문제를 먼저 읽으세요.",groups:[
  {audio:["W: Hi, I'm calling about the printer I ordered last week. It was supposed to arrive on Monday, but it still hasn't come.","M: I'm sorry about that. Let me check. It looks like the shipment was sent to your old office address.","W: Oh, we moved to the Park Building two weeks ago.","M: I'll update the address and send you a new printer today by express delivery, at no extra charge."],
   items:[
   {q:"Why is the woman calling?",c:["To cancel an order","To ask about a late delivery","To request a refund","To change a printer model"],a:1,e:"첫 대사 it still hasn't come → 배송 지연 문의."},
   {q:"What caused the problem?",c:["A product was out of stock.","A payment was not received.","An order was sent to the wrong address.","A delivery truck broke down."],a:2,e:"sent to your old office address → 잘못된 주소."},
   {q:"What will the man do?",c:["Visit the woman's office","Offer a discount","Call a manufacturer","Send a new printer by express delivery"],a:3,e:"마지막 대사 = 다음 할 일. send ~ by express delivery."}]}
 ]},
 {part:"Part 5",sec:"RC",dir:"빈칸에 알맞은 것을 고르세요. 문항당 20초 목표.",groups:[
  {items:[{q:"The sales report must be ____ to the manager by 5 P.M.",c:["submit","submitted","submitting","submission"],a:1,e:"must be + p.p. 수동태."}]},
  {items:[{q:"Mr. Seo will be out of the office ____ next Wednesday.",c:["since","by","until","among"],a:2,e:"상태 계속 → until."}]},
  {items:[{q:"The new software is ____ easier to use than the old version.",c:["very","much","more","most"],a:1,e:"비교급 강조 → much. very는 비교급 수식 불가."}]},
  {items:[{q:"Please keep your receipt ____ you need to return the item.",c:["in case","so that","despite","unless"],a:0,e:"~할 경우에 대비해 → in case."}]},
  {items:[{q:"Our customer service team is available ____ assist you 24 hours a day.",c:["for","to","at","with"],a:1,e:"available to V."}]},
  {items:[{q:"The board members ____ the proposal at yesterday's meeting.",c:["discuss","discussed","will discuss","are discussing"],a:1,e:"yesterday → 과거."}]},
  {items:[{q:"Visitors must sign in at the front desk ____ entering the building.",c:["because","unless","before","although"],a:2,e:"before + V-ing (전치사 용법)."}]},
  {items:[{q:"The ____ of the new factory is expected to create 300 jobs.",c:["construct","constructive","construction","constructed"],a:2,e:"The + ____ + of → 명사."}]},
  {items:[{q:"Ms. Lim, ____ joined the company last year, was promoted to team leader.",c:["which","whom","who","whose"],a:2,e:"사람 + 뒤에 동사 → 주격 who."}]},
  {items:[{q:"The price includes ____ breakfast and airport transportation.",c:["either","neither","whether","both"],a:3,e:"both A and B."}]}
 ]},
 {part:"Part 6",sec:"RC",dir:"지문의 빈칸에 알맞은 것을 고르세요.",groups:[
  {passage:"To: All staff\nSubject: Parking lot repairs\n\nStarting Monday, March 3, the east parking lot will be closed for repairs. The work is expected to __(1)__ about two weeks. During this time, employees __(2)__ to use the west lot or the public garage on Main Street. __(3)__ We apologize for any inconvenience and thank you for your __(4)__.",
   items:[
   {q:"(1)",c:["lasting","lastly","lasted","last"],a:3,e:"be expected to + 동사원형."},
   {q:"(2)",c:["encourage","are encouraged","encouraging","have encouraged"],a:1,e:"직원이 권장'받는' 것 → 수동태."},
   {q:"(3) 문장 삽입",c:["The east lot opened in 2015.","Please submit your timesheets by Friday.","Parking permits for the garage are available at the front desk.","Our cafeteria menu has changed."],a:2,e:"앞 문장의 public garage와 이어지는 내용."},
   {q:"(4)",c:["patient","patients","patience","patiently"],a:2,e:"your + 명사. thank you for your patience는 공지문 단골."}]}
 ]},
 {part:"Part 7",sec:"RC",dir:"지문을 읽고 답하세요. 질문 먼저 읽고 근거를 찾으세요.",groups:[
  {passage:P7.text,items:P7.qs},
  {passage:"Greenfield Fitness Center — Holiday Hours\n\nDecember 24: 6 A.M. – 2 P.M.\nDecember 25: Closed\nDecember 31: 6 A.M. – 6 P.M.\nJanuary 1: Closed\n\nMembers who renew their annual membership before December 31 will receive one free personal training session. Visit the front desk or our Web site for details.",
   items:[
   {q:"On which day is the center closed?",c:["December 24","December 25","December 31","January 2"],a:1,e:"December 25: Closed. 1월 1일도 휴무지만 보기에 없음."},
   {q:"What is offered to members who renew early?",c:["A discount on the fee","Extended hours","A gift card","A free personal training session"],a:3,e:"receive one free personal training session."}]}
 ]}
];
const MLIST=[];MOCK.forEach((p,pi)=>p.groups.forEach((g,gi)=>g.items.forEach((it,ii)=>MLIST.push({pi,gi,ii,it,part:p.part,sec:p.sec}))));
const RC_TARGET=15*60;
let M={phase:"intro",ans:{},t0:0,tRC:0,timer:null,result:null};
function fmt(s){s=Math.max(0,Math.floor(s));return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function speakLines(lines){
 try{const sy=window.speechSynthesis;if(!sy)return false;sy.cancel();
  const vs=sy.getVoices().filter(v=>/^en/i.test(v.lang));
  lines.forEach(l=>{const m=l.match(/^(M|W):\s*/);const u=new SpeechSynthesisUtterance(l.replace(/^(M|W):\s*/,""));u.lang="en-US";u.rate=.9;
   if(m){u.pitch=m[1]==="M"?.8:1.15;const v=vs[m[1]==="M"?1:0];if(v)u.voice=v}sy.speak(u)});
  return true}catch(e){return false}
}
function renderMock(){
 const A=$("#mockArea"),sec=$("#v-mock");
 sec.classList.toggle("testing",M.phase==="test");
 if(M.phase==="intro"){
  const last=S.mocks.slice(-5).reverse();
  A.innerHTML=`<div class="card">
   <h2>미니 모의고사</h2>
   <div class="tbl"><table><thead><tr><th>구분</th><th>파트</th><th style="text-align:right">문항</th></tr></thead><tbody>
   <tr><td rowspan="2">LC</td><td>Part 2 질의응답</td><td class="n">6</td></tr><tr><td>Part 3 대화</td><td class="n">3</td></tr>
   <tr><td rowspan="3">RC</td><td>Part 5 단문</td><td class="n">10</td></tr><tr><td>Part 6 장문</td><td class="n">4</td></tr><tr><td>Part 7 독해</td><td class="n">5</td></tr>
   <tr><td colspan="2"><b>합계</b></td><td class="n"><b>28</b></td></tr></tbody></table></div>
   <p class="note" style="margin:0">LC는 기기 음성으로 듣고, RC는 15분 안에 푸는 연습. 자체 제작 문제라 실제 점수 환산은 안 됨. 200문항 실전은 기출문제집으로 풀고 점수 탭에 기록.</p>
   <div class="row"><button class="btn" id="mStart">시작</button></div>
  </div>
  <div class="card"><h2>최근 결과</h2>${last.length?`<div class="tbl"><table><thead><tr><th>날짜</th><th style="text-align:right">LC</th><th style="text-align:right">RC</th><th style="text-align:right">합계</th><th style="text-align:right">RC 시간</th></tr></thead><tbody>${last.map(r=>`<tr><td class="mono">${r.d}</td><td class="n">${r.lc}/9</td><td class="n">${r.rc}/19</td><td class="n"><b>${r.lc+r.rc}/28</b></td><td class="n">${fmt(r.t)}</td></tr>`).join("")}</tbody></table></div>`:`<p class="empty">아직 응시 기록이 없습니다.</p>`}</div>`;
  return;
 }
 const done=M.phase==="result";
 let n=0,html="";
 if(done){const r=M.result;const parts={};MLIST.forEach((x,i)=>{parts[x.part]=parts[x.part]||[0,0];parts[x.part][1]++;if(M.ans[i]===x.it.a)parts[x.part][0]++});
  html+=`<div class="card"><div class="res"><div class="big mono">${r.lc+r.rc}<span style="font-size:20px">/28</span></div><div class="note">LC ${r.lc}/9 · RC ${r.rc}/19<br>RC 소요 ${fmt(r.t)} (목표 15:00)</div></div>
  <div class="tbl"><table><thead><tr><th>파트</th><th style="text-align:right">정답</th><th>판정</th></tr></thead><tbody>${Object.entries(parts).map(([k,v])=>{const pc=v[0]/v[1];return `<tr><td>${k}</td><td class="n">${v[0]}/${v[1]}</td><td>${pc>=.9?'<span style="color:var(--good)">유지</span>':pc>=.7?'<span style="color:var(--warn)">보완</span>':'<span style="color:var(--omr)">집중</span>'}</td></tr>`}).join("")}</tbody></table></div>
  <div class="row"><button class="btn" id="mAgain">다시 풀기</button><button class="btn ghost" id="mHome">처음으로</button></div></div>`}
 MOCK.forEach((p,pi)=>{
  if(!done&&pi===2&&!M.tRC)html+=`<div class="card"><h2>RC 시작</h2><p class="note" style="margin:0">LC를 다 풀었으면 RC 타이머를 시작하세요. 목표 15분.</p><div class="row"><button class="btn" id="mRC">RC 타이머 시작</button></div></div>`;
  if(!done&&pi>=2&&!M.tRC)return;
  html+=`<div class="mpart"><div class="hd"><h2>${p.part}</h2><span class="tag">${p.sec}</span></div><p class="note" style="margin:0">${esc(p.dir)}</p>`;
  p.groups.forEach(g=>{
   html+=`<div class="card">`;
   if(g.audio)html+=`<div class="row"><button class="btn small" data-say="g${pi}-${p.groups.indexOf(g)}">▶ 대화 듣기</button></div>${done?`<div class="passage">${g.audio.map(esc).join("\n")}</div>`:""}`;
   const base=n,hasBlanks=g.passage&&/__\(\d\)__/.test(g.passage);
   if(g.passage)html+=`<div class="passage">${hasBlanks?esc(g.passage).replace(/__\((\d)\)__/g,(m,d)=>{const i=base+ +d-1,it=g.items[+d-1];return blankHTML(i,it,M.ans[i],done,/삽입/.test(it.q))}):esc(g.passage)}</div>`;
   g.items.forEach(it=>{const i=n++,pk=M.ans[i];
    const showText=!it.audio||done;
    let stem="";
    if(hasBlanks){const lab=it.q.replace(/^\(\d\)\s*/,"");stem=`<span><b>위 지문 ${i+1}번 빈칸</b>${lab?" · "+esc(lab):""}</span>`}
    else if(it.q&&it.q.includes("____"))stem=`<div class="mstem">${esc(it.q).replace("____",blankHTML(i,it,pk,done,false))}</div>`;
    else if(it.q)stem=`<span>${esc(it.q)}</span>`;
    const inline=stem.startsWith("<div");
    html+=`<div class="mq" id="mq${i}"><div class="row"><span class="qn">${i+1}</span>${it.audio?`<button class="btn small ghost" data-say="i${i}">▶ 듣기</button>`:""}${inline?"":stem}</div>${inline?stem:""}`;
    html+=`<div class="choices">${it.c.map((c,ci)=>{let cls="";if(done){if(ci===it.a)cls=" right";else if(ci===pk)cls=" wrong"}return `<button class="choice${cls}" data-m="${i}" data-c="${ci}" ${done?"disabled":""}><span class="bub" aria-pressed="${pk===ci}">${L[ci]}</span><span>${showText?esc(c):'<span class="muted">음성 ('+L[ci]+')</span>'}</span></button>`}).join("")}</div>`;
    if(done)html+=`<div class="explain${pk===it.a?"":" bad"}"><b>${pk===it.a?"정답":pk==null?"미응답 · 정답 ("+L[it.a]+")":"오답 · 정답 ("+L[it.a]+")"}</b> ${esc(it.e)}</div>`;
    html+=`</div>`});
   html+=`</div>`});
  html+=`</div>`});
 if(!done){const cnt=Object.keys(M.ans).length;
  html+=`<div class="mbar"><div class="in"><div><div class="clock" id="mClock">--:--</div><div class="note" id="mClockLbl"></div></div><span class="note mono">${cnt}/28</span><button class="btn" id="mSubmit">제출</button></div></div>`}
 A.innerHTML=html;tick();
}
function blankHTML(i,it,pk,done,sentence){
 if(pk==null)return `<span class="blank" data-jump="${i}">${i+1}${sentence?" 문장":""}</span>`;
 let cls="blank on";if(done)cls+=pk===it.a?" ok":" ng";
 const w=sentence?L[pk]+"번 문장":it.c[pk];
 return `<span class="${cls}" data-jump="${i}">${esc(w)}</span>`;
}
function tick(){const c=$("#mClock");if(!c)return;const now=Date.now();
 if(M.tRC){const s=(now-M.tRC)/1000;c.textContent=fmt(RC_TARGET-s);c.classList.toggle("over",s>RC_TARGET);$("#mClockLbl").textContent=s>RC_TARGET?"RC 시간 초과 "+fmt(s-RC_TARGET):"RC 남은 시간"}
 else{c.textContent=fmt((now-M.t0)/1000);c.classList.remove("over");$("#mClockLbl").textContent="LC 진행 시간"}}
$("#mockArea").addEventListener("click",e=>{
 const ch=e.target.closest("[data-m]");
 if(ch){M.ans[+ch.dataset.m]=+ch.dataset.c;const y=window.scrollY;renderMock();window.scrollTo(0,y);return}
 const jp=e.target.closest("[data-jump]");
 if(jp){const q=document.getElementById("mq"+jp.dataset.jump);if(q){q.scrollIntoView({block:"center"});q.classList.add("flash-q");setTimeout(()=>q.classList.remove("flash-q"),1200)}return}
 const sy=e.target.closest("[data-say]");
 if(sy){const k=sy.dataset.say;let lines;if(k[0]==="i")lines=MLIST[+k.slice(1)].it.audio;else{const [pi,gi]=k.slice(1).split("-").map(Number);lines=MOCK[pi].groups[gi].audio}
  if(!speakLines(lines)){sy.textContent="음성 미지원";sy.disabled=true}return}
 const id=e.target.id;
 if(id==="mStart"||id==="mAgain"){M={phase:"test",ans:{},t0:Date.now(),tRC:0,timer:setInterval(tick,1000),result:null};renderMock();window.scrollTo(0,0)}
 if(id==="mHome"){M.phase="intro";renderMock();window.scrollTo(0,0)}
 if(id==="mRC"){M.tRC=Date.now();const y=window.scrollY;renderMock();window.scrollTo(0,y)}
 if(id==="mSubmit"){
  const left=28-Object.keys(M.ans).length;
  if(left>0&&e.target.dataset.sure!=="1"){e.target.dataset.sure="1";e.target.textContent=left+"문항 미응답 · 그래도 제출";return}
  clearInterval(M.timer);try{speechSynthesis.cancel()}catch(x){}
  let lc=0,rc=0;MLIST.forEach((x,i)=>{if(M.ans[i]===x.it.a){x.sec==="LC"?lc++:rc++}});
  const t=M.tRC?(Date.now()-M.tRC)/1000:0;
  M.result={lc,rc,t};M.phase="result";S.mocks.push({d:TODAY,lc,rc,t:Math.round(t)});save();renderMock();window.scrollTo(0,0)}
});

