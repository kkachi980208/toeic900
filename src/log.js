/* ---------- log ---------- */
$("#sDate").value=TODAY;
$("#scoreForm").addEventListener("submit",e=>{e.preventDefault();const lc=+$("#sLC").value,rc=+$("#sRC").value;if(!lc||!rc)return;S.scores.push({d:$("#sDate").value,lc,rc});S.scores.sort((a,b)=>a.d<b.d?-1:1);save();$("#sLC").value="";$("#sRC").value="";renderLog()});
$("#scoreTbl").addEventListener("click",e=>{const b=e.target.closest("[data-del]");if(b){S.scores.splice(+b.dataset.del,1);save();renderLog()}});
function renderLog(){
 const sc=S.scores,W=640,H=240,pl=40,pr=12,pt=14,pb=28,y0=500,y1=990;
 const Y=v=>pt+(H-pt-pb)*(1-(Math.min(Math.max(v,y0),y1)-y0)/(y1-y0));
 const n=sc.length,X=i=>pl+(n<=1?(W-pl-pr)/2:(W-pl-pr)*i/(n-1));
 let g="";
 [500,600,700,800,900,990].forEach(v=>{const tgt=v===800||v===900;g+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(${tgt?"--omr":"--line"})" stroke-dasharray="${tgt?"5 4":"0"}" stroke-width="1"/><text x="${pl-6}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono,monospace">${v}</text>`});
 if(n){const pts=sc.map((s,i)=>`${X(i)},${Y(s.lc+s.rc)}`).join(" ");
  g+=`<polyline points="${pts}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
  sc.forEach((s,i)=>{const last=i===n-1;g+=`<circle cx="${X(i)}" cy="${Y(s.lc+s.rc)}" r="${last?5:3.5}" fill="${last?"var(--omr)":"var(--ink)"}"/>`;if(last||n<=6)g+=`<text x="${X(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="IBM Plex Mono,monospace">${s.d.slice(5).replace("-","/")}</text>`});
  const l=sc[n-1];g+=`<text x="${Math.min(X(n-1),W-pr-4)}" y="${Y(l.lc+l.rc)-10}" text-anchor="${n>1?"end":"middle"}" font-size="13" font-weight="700" fill="var(--omr)" font-family="IBM Plex Mono,monospace">${l.lc+l.rc}</text>`;
 }else g+=`<text x="${(W+pl)/2}" y="${H/2+30}" text-anchor="middle" font-size="13" fill="var(--muted)">첫 모의고사 점수를 입력하면 추이가 그려집니다</text>`;
 $("#chart").innerHTML=`<div class="row" style="justify-content:space-between"><h2>총점 추이</h2><span class="note">점선 = 목표 800 · 900</span></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="모의고사 총점 추이">${g}</svg>`;
 $("#scoreTbl").innerHTML=n?`<thead><tr><th>날짜</th><th style="text-align:right">LC</th><th style="text-align:right">RC</th><th style="text-align:right">총점</th><th></th></tr></thead><tbody>${sc.map((s,i)=>`<tr><td class="mono">${s.d}</td><td class="n">${s.lc}</td><td class="n">${s.rc}</td><td class="n"><b>${s.lc+s.rc}</b></td><td style="text-align:right"><button class="btn small ghost" data-del="${i}" aria-label="삭제">삭제</button></td></tr>`).join("")}</tbody>`:`<tbody><tr><td class="empty">아직 기록이 없습니다. 1단계 첫 주에 기출 1회를 풀어 현재 점수부터 기록하세요.</td></tr></tbody>`;
}

