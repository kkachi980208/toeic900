"use strict";
const APP_VER="2.0";
const KEY2="toeic900-v2",KEY1="toeic900-v1";
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function iso(d){const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)}
function dOnly(s){const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)}
function addDays(s,n){const d=dOnly(s);d.setDate(d.getDate()+n);return iso(d)}
const today=new Date();today.setHours(0,0,0,0);
const TODAY=iso(today);
const L="ABCD";
function blankState(){return {v:2,updatedAt:0,created:Date.now(),exam:"2026-12-27",start:TODAY,qs:{},log:[],days:{},unk:[],wpos:0,wd:{},
 settings:{size:15,slot:"auto",speed:"auto"},plan:null,adapt:[],mocks:[],scores:[],cur:null,health:null,migrated:false}}
function readLocal(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}}
let S=blankState();
let LOCAL_OK=true;
try{localStorage.setItem("__t","1");localStorage.removeItem("__t")}catch(e){LOCAL_OK=false}
