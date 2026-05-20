export async function sendWhatsApp(message: string) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey || apikey === "SETUP_REQUIRED") return;
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apikey}`;
  try {
    await fetch(url);
  } catch (e) {
    console.error("WhatsApp send failed:", e);
  }
}
