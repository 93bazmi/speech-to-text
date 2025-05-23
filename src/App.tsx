import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RealTimeTranslate from "./components/RealTimeTranslate";
import { AlertCircle } from "lucide-react";

function App() {
  const hasRecognitionSupport =
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <RealTimeTranslate />

          {!hasRecognitionSupport && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/50 border-l-4 border-amber-500 text-amber-700 dark:text-amber-200 rounded">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>
                  Speech recognition is not supported in this browser. Please
                  try Chrome, Edge, or Safari.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
