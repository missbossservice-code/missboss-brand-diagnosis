const CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzJJnw0e24mpywFUjnMYkNGAhuMbSW9hjmqcpm5LK3XJ2hXNm2jpXFsB9jCaSsYG3av/exec",
  CONTACT_EMAIL: "missboss.service@gmail.com"
};

const OPTIONS = {
  identity:["企業主／創業者","顧問／教練","講師","自媒體創作者","專業工作者","職場工作者","正在轉職／規劃第二人生","其他"],
  brandStatus:["尚未開始","剛開始","已經營一段時間但定位不清","已有穩定內容與粉絲","已有產品／服務並開始變現"],
  platforms:["Facebook","Instagram","Threads","YouTube","Podcast","LINE 官方帳號","個人／品牌官網","電子報","Skool／線上社群","尚未經營","其他"],
  challenges:["定位不清","客群不清","專業無法整理","內容題材","社群內容","AI 工具","Podcast 不知如何開始","Podcast 成長有限","時間不足","剪輯上架","變現","課程／顧問商品化","搜尋能見度","其他"],
  podcastStatus:["尚未開始","籌備中","已有但停更","固定更新","希望重新定位"],
  purposes:["建立個人品牌","分享專業","累積信任","訪談業界人物","推廣課程／顧問服務","企業／品牌內容","建立第二事業","SEO／搜尋曝光","記錄人生故事","尚不確定"],
  support:["品牌定位","Podcast 定位","名稱與品牌設計","節目企劃","訪綱／腳本","設備與工具","陪同錄製","音訊剪輯","片頭片尾","Podcast 上架","YouTube Podcast","封面設計","節目簡介","SEO 文章","社群圖文","短影音","完整代製","一對一陪跑","尚不確定"],
  showType:["個人獨講","來賓訪談","專業知識型","故事／人物型","商業／品牌型","混合型","尚未確定"],
  outcomes:["品牌定位","Podcast 上線","完成 3–5 集","穩定內容流程","增加曝光","Google 搜尋","建立名單","增加預約","銷售課程／服務","建立官網","建立第二收入","其他"],
  offerStatus:["已有且有客戶","有但未穩定銷售","規劃中","沒有"],
  collaboration:["品牌策略諮詢","Podcast 教學陪跑","節目企劃＋製作","Podcast 全程代製","個人品牌＋Podcast 完整客製","希望由 MISSBOSS 評估"],
  supportLevel:["教我自己做","一起做需要陪跑","大部分交給團隊","完全客製代製"],
  startTime:["立即","一個月內","1–3 個月","3–6 個月","先了解"],
  budget:["NT$5,000 以下單次諮詢","NT$5,000–15,000","NT$15,000–30,000","NT$30,000–60,000","NT$60,000 以上完整代製","尚未設定"]
};
const MULTI = new Set(["platforms","challenges","purposes","support","outcomes"]);
const REQUIRED_RADIO = new Set(["identity","brandStatus","podcastStatus","showType","offerStatus","collaboration","supportLevel","startTime","budget"]);
const STORAGE_KEY = "missboss_submissions_v2";
const CSV_HEADERS = ["編號","提交日期","姓名／稱呼","Email","LINE／聯絡方式","目前身份","專業領域／產業","個人品牌現況","目前經營平台","網站／社群連結","希望被如何認識","品牌最大困難","最優先解決問題","Podcast 現況","Podcast 主要目的","希望 MISSBOSS 協助項目","節目類型","三個月期待成果","是否已有產品／服務","產品／服務說明","希望合作模式","期待協助程度","預計開始時間","預算","為什麼是現在","第一次諮詢想回答的三個問題","其他補充","個資同意","名單分數（手動）","名單等級（手動）","跟進狀態","下一次跟進日期","負責人","備註","來源"];

function mountOptions(){
  Object.entries(OPTIONS).forEach(([name, items])=>{
    const wrap=document.querySelector(`[data-name="${name}"]`); if(!wrap)return;
    items.forEach((item)=>{
      const label=document.createElement("label"); label.className="opt";
      label.innerHTML=`<input type="${MULTI.has(name)?"checkbox":"radio"}" name="${name}" value="${escapeHtml(item)}" ${REQUIRED_RADIO.has(name)?"required":""}><span>${escapeHtml(item)}</span>`;
      wrap.appendChild(label);
    });
  });
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function formToObject(form){
  const fd=new FormData(form); const out={};
  Object.keys(OPTIONS).forEach(k=>out[k]=MULTI.has(k)?fd.getAll(k):String(fd.get(k)||""));
  ["name","email","contact","industry","links","knownFor","priority","offerDescription","whyNow","questions","notes"].forEach(k=>out[k]=String(fd.get(k)||"").trim());
  out.consent=fd.get("consent")==="on";
  return out;
}
function submissionFrom(values){
  const d=new Date(); const stamp=d.toISOString().slice(0,10).replaceAll("-","");
  return {id:`MB-${stamp}-${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}${String(d.getSeconds()).padStart(2,"0")}`,submittedAt:d.toISOString(),values};
}
function formatDate(iso){return new Intl.DateTimeFormat("zh-TW",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(iso)).replaceAll("/","-")}
function row(s){const v=s.values;return [s.id,formatDate(s.submittedAt),v.name,v.email,v.contact,v.identity,v.industry,v.brandStatus,(v.platforms||[]).join("、"),v.links,v.knownFor,(v.challenges||[]).join("、"),v.priority,v.podcastStatus,(v.purposes||[]).join("、"),(v.support||[]).join("、"),v.showType,(v.outcomes||[]).join("、"),v.offerStatus,v.offerDescription,v.collaboration,v.supportLevel,v.startTime,v.budget,v.whyNow,v.questions,v.notes,v.consent?"同意":"未同意","","","","","","","官網 GitHub Pages"]}
function csvEscape(x){x=String(x??"");return /[",\r\n]/.test(x)?`"${x.replaceAll('"','""')}"`:x}
function makeCsv(items){return "\ufeff"+[CSV_HEADERS,...items.map(row)].map(r=>r.map(csvEscape).join(",")).join("\r\n")+"\r\n"}
function download(filename,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8"}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function localItems(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return []}}
function saveLocal(s){localStorage.setItem(STORAGE_KEY,JSON.stringify([...localItems(),s]))}
function validateRadios(){for(const name of REQUIRED_RADIO){if(!document.querySelector(`input[name="${name}"]:checked`))return name}return ""}
async function sendCentral(s){
  if(!CONFIG.GOOGLE_APPS_SCRIPT_URL)return false;
  const params=new URLSearchParams({payload:JSON.stringify(s)});
  await fetch(CONFIG.GOOGLE_APPS_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded;charset=UTF-8"},body:params});
  return true;
}
function updateBackendNotice(){
  document.getElementById("backendText").textContent=CONFIG.GOOGLE_APPS_SCRIPT_URL
    ?"此版本已設定中央收件：送出後會寫入 Google Sheet，並寄通知信到 MISSBOSS。"
    :"尚未設定 Google Apps Script；送出後請下載 CSV 並寄到 missboss.service@gmail.com。";
}
let latest=null;
document.getElementById("consultationForm").addEventListener("submit",async e=>{
  e.preventDefault(); const form=e.currentTarget,error=document.getElementById("formError"),btn=document.getElementById("submitBtn");
  error.hidden=true;
  if(!form.reportValidity())return;
  const missing=validateRadios(); if(missing){error.textContent="請完成所有必填選項。";error.hidden=false;return}
  const values=formToObject(form); if(!values.consent){error.textContent="請同意個資與聯繫說明。";error.hidden=false;return}
  latest=submissionFrom(values); saveLocal(latest);
  btn.disabled=true;btn.textContent="送出中…";
  let central=false; try{central=await sendCentral(latest)}catch(err){console.error(err)}
  form.hidden=true; const success=document.getElementById("success");success.hidden=false;
  document.getElementById("centralStatus").textContent=central
    ?"感謝您的耐心填寫,我們將盡快與您聯繫!"
    :"目前尚未設定中央資料庫；請下載 CSV，並寄至 missboss.service@gmail.com，以確保 MISSBOSS 收到妳的需求。";
  success.scrollIntoView({behavior:"smooth",block:"center"});
});
document.getElementById("downloadCsvBtn").addEventListener("click",()=>{
  if(!latest)return; const stamp=latest.submittedAt.slice(0,10).replaceAll("-",""); const safe=latest.values.name.replace(/[\\/:*?"<>|,\s，]+/g,"_");
  download(`MISSBOSS_品牌診斷_${safe}_${stamp}.csv`,makeCsv([latest]));
});
document.getElementById("exportAllBtn").addEventListener("click",()=>download(`MISSBOSS_本機測試名單_${new Date().toISOString().slice(0,10).replaceAll("-","")}.csv`,makeCsv(localItems())));
document.getElementById("clearLocalBtn").addEventListener("click",()=>{if(confirm("確定要清除這台瀏覽器中的本機測試資料嗎？")){localStorage.removeItem(STORAGE_KEY);alert("已清除本機測試資料。")}});
mountOptions(); updateBackendNotice();