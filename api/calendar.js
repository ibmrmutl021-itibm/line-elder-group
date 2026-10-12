// Short LINE-friendly calendar link -> prefilled Google Calendar.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');
  const id = String(req.query?.id || '').trim();
  if (!/^EVT[0-9]{1,12}$/.test(id)) return res.status(400).send('Invalid event ID');
  const url = process.env.GAS_WEB_APP_URL;
  const secret = process.env.GAS_API_SHARED_SECRET;
  if (!url || !secret) return res.status(503).send('Calendar is not configured');
  try {
    const response = await fetch(url, {
      method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({secret,action:'getCalendarEvent',payload:{eventId:id}}),
      redirect:'follow',signal:AbortSignal.timeout(18000)
    });
    if (!response.ok) throw Error('Unable to read event');
    const data = await response.json();
    if (!data.ok || !data.result) return res.status(404).send('Event not found');
    const event = data.result;
    const match = String(event.date || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) throw Error('Invalid event date');
    const start = match[1]+match[2]+match[3];
    const next = new Date(Date.UTC(+match[1],+match[2]-1,+match[3]+1));
    if (!Number.isFinite(next.getTime())) throw Error('Invalid calendar date');
    const end = next.toISOString().slice(0,10).replace(/-/g,'');
    const target = new URL('https://calendar.google.com/calendar/render');
    target.searchParams.set('action','TEMPLATE');
    target.searchParams.set('text',String(event.title || 'กิจกรรม'));
    target.searchParams.set('dates',start+'/'+end);
    target.searchParams.set('details',String(event.description || ''));
    res.writeHead(302,{Location:target.toString(),'Cache-Control':'no-store'});
    res.end();
  } catch(err) {
    console.error('Calendar link error',err);
    return res.status(502).send('เปิดกิจกรรมไม่สำเร็จ กรุณาลองอีกครั้ง');
  }
}
