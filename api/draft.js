// Vercel serverless function — keeps ANTHROPIC_API_KEY server-side only
// Set ANTHROPIC_API_KEY in your Vercel project environment variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientName, context, service, source, segment, studioName, ownerName } = req.body;

  if (!clientName || !context) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: `You write short, warm, personalised outreach messages for a beauty studio owner to send via WhatsApp or SMS.
Write like a real studio owner — not corporate, not salesy. Friendly, direct, genuine.
Keep it under 80 words. Use the client's first name once.
If the client is a hot lead who enquired: follow up on their interest naturally, no pressure.
If they've gone quiet mid-conversation: reference picking up where they left off.
If they're a lapsed client: acknowledge the time, make it warm not guilt-trippy.
If they're a promo target: offer something specific and make it feel exclusive, not generic.
Return ONLY the message text. No subject line, no signature label, no preamble.`,
        messages: [
          {
            role: 'user',
            content: `Client name: ${clientName.split(' ')[0]}
Situation: ${context}
Interested in: ${service}
Source of contact: ${source}
Segment: ${segment}
Studio owner name: ${ownerName || 'Rachel'}
Studio name: ${studioName || 'the studio'}

Write the outreach message now.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic error:', err);
      return res.status(500).json({ error: 'AI generation failed' });
    }

    const data = await response.json();
    const message = data.content?.find(b => b.type === 'text')?.text?.trim() || '';
    return res.json({ message });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
