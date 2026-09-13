// Google Apps Script
// 1. Skapa ett Google Sheet med rubrikerna:
// Tid, Barn, Svar, Förälder, Telefon, Allergi/specialkost, Övrigt
// 2. Extensions -> Apps Script
// 3. Klistra in denna kod.
// 4. Deploy -> New deployment -> Web app
//    Execute as: Me
//    Who has access: Anyone
// 5. Kopiera Web app URL till script.js

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const p = e.parameter || {};
  sheet.appendRow([
    new Date(),
    p.childName || "",
    p.attendance || "",
    p.parentName || "",
    p.phone || "",
    p.diet || "",
    p.notes || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ok:true}))
    .setMimeType(ContentService.MimeType.JSON);
}

function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.getRange("A1:G1").setValues([[
    "Tid","Barn","Svar","Förälder","Telefon","Allergi/specialkost","Övrigt"
  ]]);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1,7);
}
