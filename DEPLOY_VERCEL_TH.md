# Deploy LineGroup Mobile v5

## Status
The Vercel frontend `index.html`, public member API `api/gateway.js`, and spreadsheet-side bridge `gas/VercelBridge.gs` are in this branch. **Do not deploy until the bridge is installed and configured.**

## Google Apps Script
1. Backup the current spreadsheet-bound Apps Script project.
2. Add a **new** script file named `VercelBridge.gs`; copy `gas/VercelBridge.gs` into it. Keep the existing tested `Code.gs` and `index.html`.
3. The existing Code.gs must expose `getInitialData()` and `submitResponse(data)`. The response submit payload needs `eventId`, `memberId`, and `choice`; if the existing system differs, adapt it before testing.
4. In Project Settings > Script properties, create `API_SHARED_SECRET` with a strong private value.
5. Deploy > Manage deployments > New version (Web App). Set Execute as **Me**, Access **Anyone**. Record the `/exec` URL.
6. Keep the Apps Script admin interface private. The Vercel endpoint deliberately has no admin write actions.

## Vercel
1. Import GitHub repo `ibmrmutl021-itibm/line-elder-group`.
2. Select branch `feat/mobile-v5-vercel` for a preview deployment. Framework: Other. Root Directory: repository root.
3. Configure Environment Variables:
   - `GAS_WEB_APP_URL`: exact Apps Script Web App /exec URL
   - `GAS_API_SHARED_SECRET`: same value as Script properties.
4. Deploy Preview. Production branch `main` should not be changed before user acceptance tests.

## Smoke tests
- Mobile Safari, Chrome, LINE browser: pick event; search member; confirm and cancel; save answer.
- Change answer; verify exactly one entry per member and event.
- Closed event must reject answer even when POST called directly.
- Check displayed dates dd/MM/yyyy and source Sheet date cells.
- Check telephone stored as Plain Text; leading 0 preserved.
- Test failed or unavailable backend: show helpful UI message.
- Test POST action `toggleEventStatus` to /api/gateway: expect HTTP 403.
- Confirm no member phone/contact data in the API response.

## Security limitation
This is explicitly a no-login member-facing application, not an identity-verified ballot. A person may choose someone else's member name; avoid using it for consequential elections. The shared secret is server-to-server only, not a public-user credential. For public use, consider rate limiting and avoid exposing prior responses for unrelated members.
