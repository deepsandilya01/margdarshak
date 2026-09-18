import env from '../src/config/env.js';

const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'];

for (const model of models) {
  try {
    const url = `${env.GEMINI_BASE_URL}/models/${model}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
    const payload = {
      contents: [{ role: 'user', parts: [{ text: 'Reply with one word only: OK' }] }],
      generationConfig: { temperature: 0.1, responseMimeType: 'text/plain' },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log(JSON.stringify({ model, status: res.status, ok: res.ok, body: text.slice(0, 220) }));
  } catch (error) {
    console.log(JSON.stringify({ model, error: error.message }));
  }
}
