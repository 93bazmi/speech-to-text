// edge-functions/translate.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();
    if (!text || !sourceLanguage || !targetLanguage) {
      throw new Error('Missing required parameters');
    }

    const credentialsJson = Deno.env.get('GOOGLE_CREDENTIALS');
    if (!credentialsJson) {
      throw new Error('Missing GOOGLE_CREDENTIALS in environment');
    }

    const credentials = JSON.parse(credentialsJson);
    const projectId = credentials.project_id;

    // สร้าง JWT และขอ access token
    const jwt = await generateJWT(credentials);
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new Error('Failed to obtain access token');

    // เรียก Google Translate API v3
    const response = await fetch(
      `https://translation.googleapis.com/v3/projects/${projectId}/locations/global:translateText`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [text],
          sourceLanguageCode: sourceLanguage.split('-')[0],
          targetLanguageCode: targetLanguage.split('-')[0],
          mimeType: 'text/plain',
        }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(`Google API error: ${JSON.stringify(result)}`);
    }

    return new Response(
      JSON.stringify({
        translation: result.translations?.[0]?.translatedText || '',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});

// ฟังก์ชันช่วยสร้าง JWT สำหรับ Google OAuth2
async function generateJWT(credentials: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;

  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: credentials.private_key_id,
  };

  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + oneHour,
    iat: now,
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signInput = `${encodedHeader}.${encodedPayload}`;

  const privateKey = await importPrivateKey(credentials.private_key);
  const encoder = new TextEncoder();
  const signBytes = encoder.encode(signInput);

  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    privateKey,
    signBytes
  );
  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${encodedHeader}.${encodedPayload}.${signatureBase64}`;
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  const binary = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    binary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
}
