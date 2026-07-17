export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, description, reference_id, callback_url } = req.body;

  if (!amount || !description) {
    return res.status(400).json({ error: 'amount and description are required' });
  }

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    return res.status(500).json({ error: 'Razorpay credentials not configured. Add RAZORPAY_KEY_SECRET to Vercel env vars.' });
  }

  try {
    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');

    const body = {
      amount,
      currency: 'INR',
      accept_partial: false,
      description,
      reference_id: reference_id || `MER-${Date.now()}`,
      notify: { sms: false, email: false },
      reminder_enable: false,
    };

    if (callback_url) {
      body.callback_url = callback_url;
      body.callback_method = 'get';
    }

    const response = await fetch('https://api.razorpay.com/v1/payment_links/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.short_url) {
      return res.status(200).json({
        short_url: data.short_url,
        id: data.id,
        status: data.status,
      });
    } else {
      console.error('Razorpay error:', data);
      return res.status(response.status || 400).json({
        error: data.error?.description || data.error || 'Failed to create payment link',
      });
    }
  } catch (err) {
    console.error('Payment link creation failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
