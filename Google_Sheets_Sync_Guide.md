# Google Sheets Sync Setup Guide

## Overview
This guide explains how to connect your Kanban dashboard to a Google Sheet so that card positions are saved and synced between Dinko and Nikhil's browsers.

## Architecture
```
[Your Browser] ←→ [Google Apps Script (Free)] ←→ [Google Sheet]
                          ↑
[Nikhil's Browser] ←──────┘
```

---

## Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: `Creativity Boosters - Dashboard State`
4. In cell **A1**, paste this initial data:
```json
[{"id":"ep1","title":"Ep 01: First Mover Advantage","desc":"Hook: \"In 2008...\"","status":"production","checklist":{"record":true,"edit":true,"publish":false,"promo":false}},{"id":"ep2","title":"Ep 02: Subtraction Innovation","desc":"Hook: \"$753M Pill Bottle\"","status":"ready"},{"id":"ep3","title":"Ep 03: AI Consulting Disruption","desc":"Hook: \"Two Scandals...\"","status":"production","checklist":{"record":true,"edit":false,"publish":false,"promo":false}},{"id":"ep4","title":"Ep 04: Middle Manager Dilemma","desc":"Hook: \"Best idea died...\"","status":"ready"},{"id":"ep5","title":"Ep 05: Stealth Innovation","desc":"Hook: \"Pfizer HR...\"","status":"production","checklist":{"record":true,"edit":false,"publish":false,"promo":false}},{"id":"ep6","title":"Ep 06: Negative Emotions","desc":"Hook: \"Velcro from burrs\"","status":"ready"},{"id":"ep7","title":"Ep 07: Creative Constraints","desc":"The beauty of limits","status":"researching"},{"id":"ep8","title":"Ep 08: The Agentic Future","desc":"AI as a colleague","status":"ideas"}]
```
5. Copy the **Spreadsheet ID** from the URL:
   - This is the actual URL: `https://docs.google.com/spreadsheets/d/1rZuCg_Y0lkOSd7Iw-D3LdvzpqhU2wZvSUjo-hUeHe0A/edit`

---

## Step 2: Create the Apps Script Backend

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any code in the editor
3. Paste this code:

```javascript
// Replace with your actual spreadsheet ID (just the ID, not the full URL)
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Sheet1';
const DATA_CELL = 'A1';

function doGet(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getRange(DATA_CELL).getValue();
  
  return ContentService
    .createTextOutput(data)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  
  let newData;
  
  // Handle form-encoded data (from URLSearchParams)
  if (e.parameter && e.parameter.data) {
    // Decode URL-encoded characters like %22 back to "
    newData = decodeURIComponent(e.parameter.data);
  }
  // Fallback: Handle raw JSON POST
  else if (e.postData && e.postData.contents) {
    newData = e.postData.contents;
  }
  
  if (newData) {
    sheet.getRange(DATA_CELL).setValue(newData);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
5. Click **Deploy → New deployment**
6. Select **Web app**
7. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy**
9. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`)


---

## Step 3: Update the Dashboard

Give me the Web app URL and I will update `app.js` to use it.

---

## Security Note
- The Apps Script URL is "obscure" (hard to guess)
- Anyone with the URL can read/write
- For a 2-person podcast team, this is acceptable risk
- Do NOT share the URL publicly
