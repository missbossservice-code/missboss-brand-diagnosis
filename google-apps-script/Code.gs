const SHEET_NAME = "MISSBOSS諮詢名單";
const NOTIFY_EMAIL = "missboss.service@gmail.com";

const HEADERS = ["編號","提交日期","姓名／稱呼","Email","LINE／聯絡方式","目前身份","專業領域／產業","個人品牌現況","目前經營平台","網站／社群連結","希望被如何認識","品牌最大困難","最優先解決問題","Podcast 現況","Podcast 主要目的","希望 MISSBOSS 協助項目","節目類型","三個月期待成果","是否已有產品／服務","產品／服務說明","希望合作模式","期待協助程度","預計開始時間","預算","為什麼是現在","第一次諮詢想回答的三個問題","其他補充","個資同意","名單分數（手動）","名單等級（手動）","跟進狀態","下一次跟進日期","負責人","備註","來源"];

function doPost(e) {
  try {
    const data = JSON.parse(e.parameter.payload || "{}");
    const v = data.values || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) sh = ss.insertSheet(SHEET_NAME);

    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#7B2D45").setFontColor("#ffffff");
      sh.setFrozenRows(1);
    }

    const row = [
      data.id || "",
      data.submittedAt ? Utilities.formatDate(new Date(data.submittedAt), "Asia/Taipei", "yyyy-MM-dd HH:mm") : "",
      v.name || "", v.email || "", v.contact || "", v.identity || "", v.industry || "", v.brandStatus || "",
      (v.platforms || []).join("、"), v.links || "", v.knownFor || "", (v.challenges || []).join("、"), v.priority || "",
      v.podcastStatus || "", (v.purposes || []).join("、"), (v.support || []).join("、"), v.showType || "",
      (v.outcomes || []).join("、"), v.offerStatus || "", v.offerDescription || "", v.collaboration || "",
      v.supportLevel || "", v.startTime || "", v.budget || "", v.whyNow || "", v.questions || "", v.notes || "",
      v.consent ? "同意" : "未同意", "", "", "新名單", "", "Jean", "", "官網 GitHub Pages"
    ];
    sh.appendRow(row);

    const subject = `【MISSBOSS 新諮詢名單】${v.name || "未填姓名"}｜${v.collaboration || "需求待確認"}`;
    const body = [
      "收到一筆新的 MISSBOSS 個人品牌 × Podcast 諮詢需求：","",
      `姓名：${v.name || ""}`, `Email：${v.email || ""}`, `LINE／聯絡：${v.contact || ""}`,
      `身份：${v.identity || ""}`, `合作模式：${v.collaboration || ""}`, `預計開始：${v.startTime || ""}`,
      `預算：${v.budget || ""}`, `最優先解決：${v.priority || ""}`, `為什麼是現在：${v.whyNow || ""}`,
      "", "完整內容已寫入 Google Sheet：「" + SHEET_NAME + "」。"
    ].join("\n");
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}