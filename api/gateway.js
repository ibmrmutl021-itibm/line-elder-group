// Public member-only gateway. Administrator mutations are intentionally blocked.
const PUBLIC_ACTIONS = new Set(['getInitialData', 'submitResponse']);
export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});
  const {action,payload={}} = req.body || {};
  if (!PUBLIC_ACTIONS.has(action)) return res.status(403).json({error:'Action unavailable on public site'});
  const url=process.env.GAS_WEB_APP_URL;
  const secret=process.env.GAS_API_SHARED_SECRET;
  if (!url || !secret) return res.status(503).json({error:'Backend is not configured'});
  try {
    const response=await fetch(url,{
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({secret,action,payload}),
      redirect:'follow',
      signal:AbortSignal.timeout(18000)
    });
    if (!response.ok) throw new Error('GAS HTTP '+response.status);
    const result=await response.json();
    if (!result.ok) throw new Error(result.error||'GAS request failed');
    if (action==='getInitialData' && result.result) {
      const data=result.result;
      data.isAdmin=false;
      data.members=(data.members||[]).map(m=>({id:m.id,name:m.name}));
      delete data.allEvents;
      // Prior answers are currently sent as a map; review privacy before public launch.
    }
    return res.status(200).json({result:result.result});
  } catch (err) {
    console.error('Gateway failure:',err);
    return res.status(502).json({error:'Unable to connect. Please try again.'});
  }
}
