import { SpeechClient } from 'npm:@google-cloud/speech@6.1.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioContent, languageCode } = await req.json();

    if (!audioContent || !languageCode) {
      throw new Error('Missing required parameters');
    }

    const credentials = JSON.parse(Deno.env.get('GOOGLE_CREDENTIALS') || '');
    const speechClient = new SpeechClient({ credentials });

    const request = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: languageCode.split('-')[0],
        enableAutomaticPunctuation: true,
        model: 'latest_long',
        useEnhanced: true,
        enableWordTimeOffsets: true,
        enableSpokenPunctuation: true,
        enableSpokenEmojis: true,
        maxAlternatives: 1,
        profanityFilter: true,
        streamingFeatures: {
          interimResults: true,
        },
      },
      interimResults: true,
      singleUtterance: false,
    };

    const recognizeStream = speechClient
      .streamingRecognize(request)
      .on('error', console.error)
      .on('data', (data) => {
        const result = data.results[0];
        if (result?.alternatives[0]) {
          const transcription = result.alternatives[0].transcript;
          console.log(`Transcription: ${transcription}`);
        }
      });

    return new Response(
      JSON.stringify({ status: 'success' }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
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