/* ===================== 시작 ===================== */
(function boot(){
 const raw=readLocal(KEY2);
 if(raw)S=normalize(raw);else{const m=migrateV1();S=m?normalize(m):blankState()}
 selfCheck();
 if(!S.plan||S.plan.d!==TODAY)refreshPlan();
 saveLocal();
 $("#todayLbl").textContent=TODAY.replace(/-/g,".")+" "+"일월화수목금토"[today.getDay()];
 renderAll();
 let t=null;try{t=sessionStorage.getItem("tab2")}catch(e){}
 show(t==="run"&&!S.cur?"home":(t||"home"));
 connectDb();
})();
