const API_BASE = import.meta.env.PROD
  ? 'https://www.meredianwatches.store'
  : '';

export async function createPaymentLink(watch) {
  const res = await fetch(`${API_BASE}/api/create-payment-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: watch.amount,
      description: `${watch.brand} ${watch.model} — Meridian`,
      reference_id: `MER-${watch.id}-${Date.now()}`,
      callback_url: `${window.location.origin}/payment-success`,
    }),
  });

  const data = await res.json();

  if (data.short_url) {
    return data.short_url;
  }

  throw new Error(data.error || 'Failed to create payment link');
}
