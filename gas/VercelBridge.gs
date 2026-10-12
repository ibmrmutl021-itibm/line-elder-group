/**
 * LineGroup Vercel bridge — append to existing spreadsheet-bound Code.gs.
 * Keep your existing getInitialData() and submitResponse() implementations.
 * In Apps Script Project Settings > Script properties set API_SHARED_SECRET.
 * This public bridge intentionally exposes member actions only.
 */
function doPost(e) {
  function reply(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  try {
    var request = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var expected = PropertiesService.getScriptProperties().getProperty('API_SHARED_SECRET');
    if (!expected || request.secret !== expected) throw new Error('Unauthorized');
    var result;
    if (request.action === 'getInitialData') {
      var source = getInitialData();
      if (source.error) throw new Error(source.error);
      result = {
        members: (source.members || []).map(function (m) {
          return { id: String(m.id || ''), name: String(m.name || '') };
        }),
        activeEvents: source.activeEvents || [],
        allEvents: [],
        userResponses: source.userResponses || {},
        isAdmin: false,
        error: null
      };
    } else if (request.action === 'submitResponse') {
      result = submitResponse(request.payload || {});
    } else {
      throw new Error('Unsupported public action');
    }
    return reply({ ok: true, result: result });
  } catch (err) {
    return reply({ ok: false, error: String(err.message || err) });
  }
}
