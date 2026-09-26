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

    // 自動回覆填表者
    if (v.email) {
      const visitorSubject = "MISSBOSS 已收到您的品牌診斷需求";
      const visitorBody = [
        `您好，${v.name || "朋友"}：`,
        "",
        "感謝您的耐心填寫，我們已收到您的「個人品牌 × Podcast」諮詢需求。",
        "我們將依照您目前的品牌現況、Podcast 需求、合作方式與期待成果進行初步整理。",
        "我們會在 5 個工作天內盡快回覆您，並透過您留下的 Email 或聯絡方式與您聯繫。",
        "",
        "在正式回覆前，也歡迎您先整理：",
        "想被市場如何記住、目前最希望解決的問題，以及未來 3 個月最想完成的成果?",
        "",
        "謝謝您把重要的品牌下一步交給我們。",
        "如有任何建議和回饋，也歡迎您隨時回信與我們聯絡!",
        "",
        "Jean Lee/ MissBoss",
        "個人品牌 × Podcast 聲音品牌顧問",
        "missboss.service@gmail.com",
        "www.miss-boss.com",
        "",
        "此為系統自動確認信，請勿重複提交表單。"
      ].join("\n");

      const safeName = String(v.name || "朋友")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      const visitorHtml = `
        <div style="font-family:Arial,'Noto Sans TC',sans-serif;line-height:1.8;color:#3a2a2f;font-size:15px;">
          <p>您好，${safeName}：</p>

          <p>感謝您的耐心填寫，我們已收到您的「個人品牌 × Podcast」諮詢需求。</p>

          <p>我們將依照您目前的品牌現況、Podcast 需求、合作方式與期待成果進行初步整理。</p>

          <p>我們會在 <strong>5 個工作天內盡快回覆您</strong>，並透過您留下的 Email 或聯絡方式與您聯繫。</p>

          <p>在正式回覆前，也歡迎您先整理：<br>
          想被市場如何記住、目前最希望解決的問題，以及未來 3 個月最想完成的成果?</p>

          <p>謝謝您把重要的品牌下一步交給我們。<br>
          如有任何建議和回饋，也歡迎您隨時回信與我們聯絡!</p>

          <p style="margin-top:28px;">
            Jean Lee/ MissBoss<br>
            個人品牌 × Podcast 聲音品牌顧問<br>
            <a href="mailto:missboss.service@gmail.com" style="color:#7B2D45;">missboss.service@gmail.com</a><br>
            <a href="http://www.miss-boss.com" style="color:#7B2D45;">www.miss-boss.com</a>
          </p>

          <p style="margin-top:26px;font-weight:700;color:#7B2D45;">「此為系統自動確認信，請勿重複提交表單。」</p>
        </div>`;

      MailApp.sendEmail({
        to: v.email,
        subject: visitorSubject,
        body: visitorBody,
        htmlBody: visitorHtml,
        name: "MISSBOSS",
        replyTo: NOTIFY_EMAIL
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}