import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as TranslateV2 } from '@google-cloud/translate';
import { SpeechClient } from '@google-cloud/speech';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const translateClient = new TranslateV2.Translate();
const speechClient = new SpeechClient();

// Route ทดสอบ
app.get('/', (req, res) => {
  res.send('Hello! Backend Server is running.');
});

// ทดสอบเชื่อมต่อ Google Cloud API
app.get('/api/test', async (req, res) => {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'unknown';
    res.json({
      status: 'success',
      message: 'Google Cloud APIs connected successfully',
      project_id: projectId,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// แปลภาษา (Google Translate API v2)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // แปลภาษาด้วย v2 API
    const [translation] = await translateClient.translate(text, targetLanguage);

    res.json({ translation });
  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Speech-to-Text API (Google Speech API v1)
app.post('/api/speech-to-text', async (req, res) => {
  try {
    const { audioContent, languageCode } = req.body;

    if (!audioContent || !languageCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const request = {
      audio: { content: audioContent },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode,
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join('\n');

    res.json({ transcription });
  } catch (error) {
    console.error('Speech-to-Text API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API Ping
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
