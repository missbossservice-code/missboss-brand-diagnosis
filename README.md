# MISSBOSS Brand Voice Consultation — GitHub Pages 版

這是一個不依賴 Lovable 的純靜態一頁式網站。

## 目前功能
- MISSBOSS 酒紅／粉金／米白品牌視覺
- 完整「個人品牌 × Podcast」診斷表單
- 手機／平板／桌機響應式
- 本機 localStorage 暫存
- 單筆 CSV 下載
- 本機全部名單 CSV 匯出
- 正式收件 Email：missboss.service@gmail.com
- Google Sheet / Apps Script 中央收件程式
- 新名單 Email 通知

## GitHub Pages
Repository：missbossservice-code/missboss-brand-diagnosis

網站檔案位於 main branch 根目錄。

## Google Sheet 中央收件設定
1. 建立一份新的 Google Sheet，例如「MISSBOSS 個人品牌 Podcast 諮詢名單」
2. Extensions → Apps Script
3. 將 `google-apps-script/Code.gs` 全部貼入
4. Deploy → New deployment → Web app
5. Execute as：Me
6. Who has access：Anyone
7. Deploy，複製 Web app URL
8. 回到 `app.js`，把：
   `GOOGLE_APPS_SCRIPT_URL: ""`
   改成：
   `GOOGLE_APPS_SCRIPT_URL: "你的 Web app URL"`

完成後，訪客送出表單會：
- 自動新增一列到 Google Sheet
- 寄新名單通知到 missboss.service@gmail.com
- 同時保留 CSV 備份功能

## 注意
GitHub Pages 本身不儲存表單資料；中央收件由 Google Apps Script + Google Sheet 負責。