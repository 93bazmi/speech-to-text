const FUNCTION_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export async function testGoogleApi() {
  console.log('[testGoogleApi] Calling:', `${FUNCTION_BASE_URL}/test`);
  const res = await fetch(`${FUNCTION_BASE_URL}/test`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, // เพิ่ม Authorization header
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
  const FUNCTION_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  const res = await fetch(`${FUNCTION_BASE_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
