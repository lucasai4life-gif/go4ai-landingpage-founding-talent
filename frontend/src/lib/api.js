export async function getSeason() {
  const res = await fetch('/api/season');
  if (!res.ok) throw new Error('season');
  return res.json();
}

export async function submitLead(payload) {
  let res;
  try {
    res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, network: true, message: 'Mất kết nối. Nội dung vẫn được giữ, vui lòng thử lại.' };
  }
  const body = await res.json().catch(() => ({}));
  return { status: res.status, ...body, ok: res.ok && body.ok };
}
