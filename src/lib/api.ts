const API_BASE_URL = '/api';

export async function testGoogleApi() {
  console.log('[testGoogleApi] Calling:', `${API_BASE_URL}/test`);
  const res = await fetch(`${API_BASE_URL}/test`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const textRes = await res.text();
  console.log('[testGoogleApi] Raw response:', textRes);

  let data;
  try {
    data = JSON.parse(textRes);
  } catch {
    throw new Error(`Invalid JSON response in testGoogleApi: ${textRes}`);
  }

  if (!res.ok) {
    throw new Error(data?.error || 'API test failed');
  }

  return data;
}

export async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
) {
  const res = await fetch(`${API_BASE_URL}/translate-v3`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, sourceLanguage, targetLanguage }),
  });

  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON response in translateText: ${raw}`);
  }
  if (!res.ok) {
    throw new Error(data?.error || `Translation failed: ${raw}`);
  }
  return data;
}
