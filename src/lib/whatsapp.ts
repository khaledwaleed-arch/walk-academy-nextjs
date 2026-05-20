export async function sendWhatsApp(message: string) {
  const instance = process.env.GREENAPI_INSTANCE;
  const token = process.env.GREENAPI_TOKEN;
  const to = process.env.WHATSAPP_TO;
  if (!instance || !token || !to) return;
  const apiUrl = process.env.GREENAPI_API_URL || `https://${instance.slice(0, 4)}.api.greenapi.com`;
  const url = `${apiUrl}/waInstance${instance}/sendMessage/${token}`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: `${to}@c.us`, message }),
    });
  } catch (e) {
    console.error("WhatsApp send failed:", e);
  }
}
