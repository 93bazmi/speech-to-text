const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get and validate credentials
    const credentials = Deno.env.get('GOOGLE_CREDENTIALS');
    if (!credentials) {
      throw new Error('Google Cloud credentials not found in environment variables');
    }

    const parsedCredentials = JSON.parse(credentials);
    const projectId = parsedCredentials.project_id;
    
    if (!projectId) {
      throw new Error('Project ID not found in credentials');
    }

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await generateJWT(parsedCredentials),
      }),
    });

    const { access_token } = await tokenResponse.json();
    
    if (!access_token) {
      throw new Error('Failed to get access token');
    }

    // Test Translation API
    const translateResponse = await fetch(`https://translation.googleapis.com/v3/projects/${projectId}/locations/global:translateText`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: ['Hello'],
        sourceLanguageCode: 'en',
        targetLanguageCode: 'es',
        mimeType: 'text/plain',
      }),
    });

    const translateData = await translateResponse.json();

    if (!translateResponse.ok) {
      throw new Error(`Translation API error: ${JSON.stringify(translateData)}`);
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        translation: translateData.translations[0].translatedText,
        project_id: projectId,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Google API Test Error:', error);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message,
        details: error.stack,
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

// Helper function to generate JWT for Google OAuth
async function generateJWT(credentials: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;
  
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: credentials.private_key_id
  };

  const claims = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + oneHour,
    iat: now,
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(claims));
  const signInput = `${encodedHeader}.${encodedPayload}`;

  // Convert PEM private key to CryptoKey
  const privateKey = await importPrivateKey(credentials.private_key);
  
  // Sign the input
  const encoder = new TextEncoder();
  const signBytes = encoder.encode(signInput);
  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    privateKey,
    signBytes
  );

  // Convert signature to base64
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  return `${encodedHeader}.${encodedPayload}.${signatureBase64}`;
}

async function importPrivateKey(pemKey: string): Promise<CryptoKey> {
  // Remove PEM header/footer and newlines
  const pemContents = pemKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\n/g, '');

  // Convert base64 to binary
  const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

  // Import as CryptoKey
  return await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign']
  );
}