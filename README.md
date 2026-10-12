# LineGroup Mobile — Senior-friendly event web app

Repository for **LineGroup Mobile v5**. This project uses Vercel for the mobile-facing website, Google Apps Script for business logic and Google Sheets for Members, Events, and Responses.

## Current status

The repository is initialized. Source package **LineGroup_Mobile_v5_Popup_Vercel.zip** was prepared in ChatGPT, but full frontend/backend source is **not yet committed here**. Do not connect this repository to production Vercel until the complete application has been committed and tested.

## Deployment structure

- `index.html` — Vercel frontend; readable text and large controls with in-page confirmation dialog (not browser alert/confirm).
- `api/gateway.js` — Vercel API proxy to a Google Apps Script Web App.
- `gas/Code.gs` — spreadsheet-bound Apps Script with `doPost` gateway.
- `gas/index.html` — Google Apps Script version of the mobile website.
- `vercel.json`, `package.json`, `.env.example` — deployment configuration.

## Configuration

Set `GAS_WEB_APP_URL` and `GAS_API_SHARED_SECRET` on Vercel; set the same secret as Apps Script property `API_SHARED_SECRET`. **Never commit real secrets**.

## Important: no-login access

No login for senior members. Before public launch, the API must not expose administrator modifications without additional server-side protection. Hiding an Admin tab is not protection. Protect member phone numbers, contact details, and prior voting records.

Dates use `dd/MM/yyyy` for display. Store real dates in Sheets and phone numbers as **Plain text** so leading zeroes are preserved.

## Testing

Test on mobile Safari/Chrome and LINE in-app browser: load activities, search member, submit and change answer, cancel/confirm dialog, date formatting, closed events, phone number formatting, and read/write through Vercel API.
