const ENDPOINT =
  'https://api.counterapi.dev/v2/adityas-team-1-5182/portfolio-website-aditya';

// Proxies CounterAPI v2 so the API key stays server-side — CounterAPI's CORS
// policy blocks the Authorization header from browser requests entirely.
export default async function handler(req, res) {
  const shouldIncrement = req.query.up === '1';
  const url = shouldIncrement ? `${ENDPOINT}/up` : ENDPOINT;

  try {
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.COUNTER_API_KEY}` },
    });
    const j = await r.json();
    const up = j?.data?.up_count;
    const down = j?.data?.down_count;

    if (typeof up !== 'number' || typeof down !== 'number') {
      res.status(502).json({ error: 'Unexpected response from counter API' });
      return;
    }

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ count: up - down });
  } catch {
    res.status(502).json({ error: 'Counter API unreachable' });
  }
}
