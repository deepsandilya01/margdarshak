const base = 'http://localhost:3000';
const email = 'runtime.ai.check@local.dev';
const password = 'RuntimePass123!';

async function registerOrLogin() {
  const registerRes = await fetch(`${base}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Runtime RAG Checker',
      email,
      password,
      preferredLanguage: 'en',
    }),
  });

  const registerJson = await registerRes.json();
  if (registerRes.status === 409) {
    const loginRes = await fetch(`${base}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const loginJson = await loginRes.json();
    if (!loginJson.success) {
      throw new Error(`Login failed: ${loginJson.message || 'unknown'}`);
    }
    return loginJson.data.accessToken;
  }

  if (!registerJson.success) {
    throw new Error(`Register failed: ${registerJson.message || 'unknown'}`);
  }

  return registerJson.data.accessToken;
}

async function callChat(token, message, language = 'en') {
  const res = await fetch(`${base}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, language }),
  });

  const json = await res.json();
  return { status: res.status, body: json };
}

function normalizeDiag(payload) {
  const evidence = Array.isArray(payload.evidence) ? payload.evidence : [];
  const pdfEvidence = evidence.filter((item) => item && item.sourceType !== 'web');
  const webEvidence = evidence.filter((item) => item && item.sourceType === 'web');
  const pdfScores = pdfEvidence.map((item) => Number(item.score || 0));
  const pdfScore = pdfScores.length ? pdfScores.reduce((sum, val) => sum + val, 0) / pdfScores.length : 0;

  return {
    requestId: payload.requestId || null,
    pdfChunkCount: pdfEvidence.length,
    pdfEvidenceScore: Number(pdfScore.toFixed(4)),
    tavilyTriggered: webEvidence.length > 0,
    tavilyResultCount: webEvidence.length,
    finalEvidenceSourceTypes: Array.from(new Set(evidence.map((item) => item && item.sourceType).filter(Boolean))),
    citationCount: Array.isArray(payload.citations) ? payload.citations.length : 0,
    status: payload.status || null,
    answerPreview: typeof payload.answer?.text === 'string' ? payload.answer.text.slice(0, 220) : '',
    citations: Array.isArray(payload.citations) ? payload.citations.slice(0, 5) : [],
  };
}

const token = await registerOrLogin();

const scenarios = [
  { label: 'PDF_FIRST', message: 'What is BIS?', language: 'en' },
  { label: 'TAVILY_FALLBACK', message: 'What are the latest BIS Quality Control Orders for cement products in 2026?', language: 'en' },
  { label: 'PDF_WEB_COMBO', message: 'What testing and marking requirements apply to BIS certification for cement products?', language: 'en' },
  { label: 'INSUFFICIENT', message: 'What is the personal mobile number of the current BIS Chairman?', language: 'en' },
];

for (const scenario of scenarios) {
  const result = await callChat(token, scenario.message, scenario.language);
  const payload = result.body && result.body.data ? result.body.data : {};
  const diag = normalizeDiag(payload);

  console.log(`CASE ${scenario.label}`);
  console.log(JSON.stringify(diag));
  console.log('---');
}
