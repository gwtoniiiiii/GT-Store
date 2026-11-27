
const SYSTEM_PROMPT = `
Kamu adalah admin virtual GT Store (@gwtoniiiiii).
Kamu melayani pelanggan melalui WhatsApp.

ATURAN:
- Gunakan bahasa Indonesia yang ramah, sopan, alami dan santai.
- Balas seperti admin toko manusia, bukan robot.
- Jawab singkat, jelas, dan sesuai pertanyaan.
- Sapa pelanggan dengan ramah jika percakapan baru dimulai.
- Jangan mengarang harga, stok, nomor rekening, atau informasi produk.
- Jika informasi belum tersedia, katakan bahwa admin akan membantu memastikan.
- Jangan meminta password, PIN, OTP, atau API Key pelanggan.
- Jangan mengaku sudah memperpanjang QRIS jika belum dilakukan.
- Jika pelanggan meminta bantuan manusia, arahkan ke admin GT Store.
- Jangan mengaku memiliki akses ke sistem pembayaran.
- Jangan mengarang kebijakan toko.

Nama toko: GT Store.
Akun: @gwtoniiiiii.
`;

async function askGemini(env, customerMessage) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        model: "gemini-3.8-flash",
        store: false,
        input: SYSTEM_PROMPT +
          "\n\nPesan pelanggan:\n" + customerMessage
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Gemini API error: " + JSON.stringify(data));
  }

  const answer = data.output_text ||
    (data.steps || [])
      .flatMap(step => step.content || [])
      .filter(item => item.type === "text")
      .map(item => item.text)
      .join("\n");

  if (!answer) {
    throw new Error("Gemini tidak menghasilkan balasan.");
  }

  return answer.trim().slice(0, 4000);
}

async function sendWhatsApp(env, to, message) {
  const response = await fetch(
    "https://graph.facebook.com/v26.0/" +
      env.WA_PHONE_NUMBER_ID + "/messages",
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.WA_ACCESS_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          preview_url: false,
          body: message
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error("WhatsApp API error: " +
      await response.text());
  }
}

async function processWebhook(body, env) {
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};

      for (const message of value.messages || []) {
        if (message.type !== "text" || !message.text?.body) {
          continue;
        }

        const customer = message.from;
        const question = message.text.body;

        try {
          const answer = await askGemini(env, question);
          await sendWhatsApp(env, customer, answer);
        } catch (error) {
          console.error("Auto Reply Error:", error);
        }
      }
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (
        mode === "subscribe" &&
        token === env.WA_VERIFY_TOKEN &&
        challenge
      ) {
        return new Response(challenge, { status: 200 });
      }

      return new Response("Verification failed", {
        status: 403
      });
    }

    if (request.method === "POST") {
      let body;

      try {
        body = await request.json();
      } catch {
        return new Response("Invalid JSON", { status: 400 });
      }

      ctx.waitUntil(processWebhook(body, env));

      return new Response("EVENT_RECEIVED", { status: 200 });
    }

    return new Response("Method not allowed", {
      status: 405
    });
  }
};
