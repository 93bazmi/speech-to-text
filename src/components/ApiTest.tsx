import React, { useState } from 'react';
import { translateText } from '../lib/api';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const ApiTest: React.FC = () => {
  const [text, setText] = useState('Hello');
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('es-ES');

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await translateText(text, sourceLang, targetLang);
      console.log('Translation result:', response);

      setResult({
        translation: response.translation,
        project_id: 'frontend-test',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Google Translate API Test
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Text to Translate
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              Source Language
            </label>
            <input
              type="text"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              placeholder="en-US"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              Target Language
            </label>
            <input
              type="text"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              placeholder="es-ES"
            />
          </div>
        </div>

        <button
          onClick={handleTest}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors w-full ${
            loading
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </span>
          ) : (
            'Translate'
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700 font-medium">Translation Success</p>
            </div>
            <p className="text-sm text-green-600">
              Project ID: {result.project_id}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Result</h3>
            <p className="text-sm text-gray-800">{`"${text}" → "${result.translation}"`}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
