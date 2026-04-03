import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Languages, Copy, Check, Download } from "lucide-react";
import LanguageDropdown from "./LanguageDropdown";

// ภาษาที่รองรับ
const languageOptions = [
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian" },
  { code: "am", name: "Amharic" },
  { code: "ar", name: "Arabic" },
  { code: "hy", name: "Armenian" },
  { code: "az", name: "Azerbaijani" },
  { code: "eu", name: "Basque" },
  { code: "be", name: "Belarusian" },
  { code: "bn", name: "Bengali" },
  { code: "bs", name: "Bosnian" },
  { code: "bg", name: "Bulgarian" },
  { code: "ca", name: "Catalan" },
  { code: "ceb", name: "Cebuano" },
  { code: "ny", name: "Chichewa" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "co", name: "Corsican" },
  { code: "hr", name: "Croatian" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian" },
  { code: "tl", name: "Filipino" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "fy", name: "Frisian" },
  { code: "gl", name: "Galician" },
  { code: "ka", name: "Georgian" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "gu", name: "Gujarati" },
  { code: "ht", name: "Haitian Creole" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian" },
  { code: "iw", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hmn", name: "Hmong" },
  { code: "hu", name: "Hungarian" },
  { code: "is", name: "Icelandic" },
  { code: "ig", name: "Igbo" },
  { code: "id", name: "Indonesian" },
  { code: "ga", name: "Irish" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "jw", name: "Javanese" },
  { code: "kn", name: "Kannada" },
  { code: "kk", name: "Kazakh" },
  { code: "km", name: "Khmer" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "ko", name: "Korean" },
  { code: "ku", name: "Kurdish (Kurmanji)" },
  { code: "ky", name: "Kyrgyz" },
  { code: "lo", name: "Lao" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian" },
  { code: "lt", name: "Lithuanian" },
  { code: "lb", name: "Luxembourgish" },
  { code: "mk", name: "Macedonian" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay" },
  { code: "ml", name: "Malayalam" },
  { code: "mt", name: "Maltese" },
  { code: "mi", name: "Maori" },
  { code: "mr", name: "Marathi" },
  { code: "mn", name: "Mongolian" },
  { code: "my", name: "Myanmar (Burmese)" },
  { code: "ne", name: "Nepali" },
  { code: "no", name: "Norwegian" },
  { code: "or", name: "Odia (Oriya)" },
  { code: "ps", name: "Pashto" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "pa", name: "Punjabi" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sm", name: "Samoan" },
  { code: "gd", name: "Scots Gaelic" },
  { code: "sr", name: "Serbian" },
  { code: "st", name: "Sesotho" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "Sindhi" },
  { code: "si", name: "Sinhala" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "so", name: "Somali" },
  { code: "es", name: "Spanish" },
  { code: "su", name: "Sundanese" },
  { code: "sw", name: "Swahili" },
  { code: "sv", name: "Swedish" },
  { code: "tg", name: "Tajik" },
  { code: "ta", name: "Tamil" },
  { code: "tt", name: "Tatar" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "tk", name: "Turkmen" },
  { code: "uk", name: "Ukrainian" },
  { code: "ur", name: "Urdu" },
  { code: "ug", name: "Uyghur" },
  { code: "uz", name: "Uzbek" },
  { code: "vi", name: "Vietnamese" },
  { code: "cy", name: "Welsh" },
  { code: "xh", name: "Xhosa" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "zu", name: "Zulu" },
];

async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
) {
  const API_BASE_URL = "/api";

  const res = await fetch(`${API_BASE_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      sourceLanguage,
      targetLanguage,
    }),
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

const RealTimeTranslate: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("th");
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const recordingRef = useRef(recording);
  const pausedRef = useRef(paused);
  const timerRef = useRef<number | null>(null);

  const [transcriptSegments, setTranscriptSegments] = useState<
    { text: string; timestamp: number; isFinal: boolean }[]
  >([]);

  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [translatedSegments, setTranslatedSegments] = useState<
    { text: string; timestamp: number }[]
  >([]);

  const recognition = useRef<SpeechRecognition | null>(null);

  const speechContainerRef = useRef<HTMLDivElement>(null);
  const translationContainerRef = useRef<HTMLDivElement>(null);

  const [copiedSpeech, setCopiedSpeech] = useState(false);
  const [copiedTranslation, setCopiedTranslation] = useState(false);

  const [showSpeechDownloadMenu, setShowSpeechDownloadMenu] = useState(false);
  const [showTranslationDownloadMenu, setShowTranslationDownloadMenu] =
    useState(false);
  const speechDownloadRef = useRef<HTMLDivElement>(null);
  const translationDownloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    if (recording && !paused) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recording, paused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        speechDownloadRef.current &&
        !speechDownloadRef.current.contains(event.target as Node)
      ) {
        setShowSpeechDownloadMenu(false);
      }
      if (
        translationDownloadRef.current &&
        !translationDownloadRef.current.contains(event.target as Node)
      ) {
        setShowTranslationDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech Recognition API is not supported in this browser.");
      console.error("Speech Recognition API not supported in this browser");
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = sourceLanguage;

    recognition.current.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.current.onresult = (event) => {
      let interim = "";
      const newFinalSegments: {
        text: string;
        timestamp: number;
        isFinal: boolean;
      }[] = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript.trim();

        if (result.isFinal) {
          newFinalSegments.push({
            text,
            timestamp: Date.now(),
            isFinal: true,
          });
        } else {
          interim += text + " ";
        }
      }

      if (newFinalSegments.length > 0) {
        setTranscriptSegments((prev) => [...prev, ...newFinalSegments]);
      }
      setInterimTranscript(interim.trim());
    };

    recognition.current.onerror = (event) => {
      console.error("Recognition error event:", event.error);
      if (event.error !== "aborted") {
        setError(`Recognition error: ${event.error}`);
      } else {
        setError(null);
      }
    };

    recognition.current.onend = () => {
      console.log(
        `Recognition ended. recording=${recordingRef.current}, paused=${pausedRef.current}`,
      );
      if (pausedRef.current) {
        console.log("Recognition paused, will NOT restart");
        return;
      }
      if (!recordingRef.current) {
        console.log("Recognition stopped, will NOT restart");
        return;
      }
      console.log(
        "Recognition ended but restarting because recording is still true",
      );
      try {
        recognition.current?.start();
      } catch (err) {
        console.error("Failed to restart recognition:", err);
        setError(
          err instanceof Error ? err.message : "Recognition failed to restart",
        );
        setRecording(false);
        setPaused(false);
      }
    };

    return () => {
      recognition.current?.stop();
    };
  }, [sourceLanguage]);

  useEffect(() => {
    if (transcriptSegments.length === 0) {
      setTranslatedSegments([]);
      return;
    }
    transcriptSegments.forEach((seg, i) => {
      if (!translatedSegments[i]) {
        translateText(seg.text, sourceLanguage, targetLanguage)
          .then((response) => {
            setTranslatedSegments((prev) => {
              const newTranslations = [...prev];
              newTranslations[i] = {
                text: response.translation,
                timestamp: seg.timestamp,
              };
              return newTranslations;
            });
            setError(null);
          })
          .catch((e) => {
            console.error("Translation error:", e);
            setTranslatedSegments((prev) => {
              const newTranslations = [...prev];
              newTranslations[i] = {
                text: "[Translation error]",
                timestamp: seg.timestamp,
              };
              return newTranslations;
            });
            setError(e instanceof Error ? e.message : "Translation failed");
          });
      }
    });
  }, [transcriptSegments, sourceLanguage, targetLanguage]);

  useEffect(() => {
    if (speechContainerRef.current) {
      speechContainerRef.current.scrollTop =
        speechContainerRef.current.scrollHeight;
    }
  }, [transcriptSegments, interimTranscript]);

  useEffect(() => {
    if (translationContainerRef.current) {
      translationContainerRef.current.scrollTop =
        translationContainerRef.current.scrollHeight;
    }
  }, [translatedSegments]);

  const startRecording = () => {
    setError(null);
    setTranscriptSegments([]);
    setInterimTranscript("");
    setTranslatedSegments([]);
    setPaused(false);
    setRecording(true);
    setRecordingTime(0);

    try {
      recognition.current?.start();
    } catch (err) {
      console.error("Failed to start recording:", err);
      setError(
        err instanceof Error ? err.message : "Failed to start recording",
      );
      setRecording(false);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    setPaused(false);
    recognition.current?.stop();
  };

  const pauseRecording = () => {
    if (recording) {
      console.log("Pausing recognition...");
      recognition.current?.stop();
      setPaused(true);
      setRecording(false);
    }
  };

  const continueRecording = () => {
    if (paused) {
      try {
        recognition.current?.start();
        setPaused(false);
        setRecording(true);
      } catch (err) {
        console.error("Failed to continue recording:", err);
        setError(
          err instanceof Error ? err.message : "Failed to continue recording",
        );
      }
    }
  };

  const copyToClipboard = (
    text: string,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadFile = (
    segments: { text: string; timestamp: number }[],
    fileType: "csv" | "txt",
  ) => {
    if (!segments.length) return;

    let fileContent = "";
    let mimeType = "text/plain";
    let extension = ".txt";

    if (fileType === "csv") {
      fileContent =
        "Timestamp,Text\n" +
        segments
          .map(
            (seg) =>
              `"${new Date(
                seg.timestamp,
              ).toLocaleTimeString()}","${seg.text.replace(/"/g, '""')}"`,
          )
          .join("\n");
      mimeType = "text/csv";
      extension = ".csv";
    } else {
      fileContent = segments
        .map(
          (seg) =>
            `[${new Date(
              seg.timestamp,
            ).toLocaleTimeString()}] ${seg.text.replace(/[\r\n]+/g, " ")}`,
        )
        .join("\n");
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowSpeechDownloadMenu(false);
    setShowTranslationDownloadMenu(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Languages className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          Real-time Translation
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LanguageDropdown
          options={languageOptions}
          value={sourceLanguage}
          onChange={setSourceLanguage}
          disabled={recording}
          label="I'm speaking in"
          id="sourceLanguage"
        />

        <LanguageDropdown
          options={languageOptions}
          value={targetLanguage}
          onChange={setTargetLanguage}
          disabled={recording}
          label="Convert to"
          id="targetLanguage"
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center items-center gap-6">
          {!recording && !paused && (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow transition-colors"
            >
              <Mic className="w-6 h-6" />
              Start Recording
            </button>
          )}
          {recording && !paused && (
            <>
              <button
                onClick={pauseRecording}
                className="flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-semibold shadow transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Pause
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow transition-colors"
              >
                <MicOff className="w-6 h-6" />
                Stop Recording
              </button>
            </>
          )}
          {paused && (
            <>
              <button
                onClick={continueRecording}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 3v18l15-9-15-9z" />
                </svg>
                Continue
              </button>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow transition-colors"
              >
                <MicOff className="w-6 h-6" />
                Stop Recording
              </button>
            </>
          )}
        </div>
        {(recording || paused) && (
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
            <div
              className={`w-2 h-2 rounded-full ${
                recording && !paused
                  ? "bg-red-500 animate-pulse"
                  : "bg-yellow-500"
              }`}
            />
            <span className="font-mono text-sm font-medium dark:text-white">
              {formatTime(recordingTime)}
            </span>
          </div>
        )}
      </div>

      <section>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Speech Text (
            {languageOptions.find((l) => l.code === sourceLanguage)?.name ||
              sourceLanguage}
            )
          </h3>
          <div className="flex gap-2">
            <div className="relative" ref={speechDownloadRef}>
              <button
                onClick={() =>
                  setShowSpeechDownloadMenu(!showSpeechDownloadMenu)
                }
                disabled={transcriptSegments.length === 0}
                className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                  transcriptSegments.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                title="Download"
                aria-label="Download"
              >
                <Download className="w-5 h-5 dark:text-gray-300" />
              </button>
              {showSpeechDownloadMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      downloadFile(transcriptSegments, "txt");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Download .txt
                  </button>
                  <button
                    onClick={() => {
                      downloadFile(translatedSegments, "csv");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Download .csv
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  transcriptSegments.map((seg) => seg.text).join(" "),
                  setCopiedSpeech,
                )
              }
              disabled={transcriptSegments.length === 0}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                transcriptSegments.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              title="Copy Speech Text"
              aria-label="Copy Speech Text"
            >
              {copiedSpeech ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-5 h-5 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
        <div
          ref={speechContainerRef}
          className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 h-56 overflow-y-auto font-mono text-gray-900 dark:text-gray-100 shadow-sm -mt-1"
          aria-live="polite"
        >
          {transcriptSegments.length === 0 && !interimTranscript && (
            <em className="italic text-gray-400 dark:text-gray-500">
              Waiting for speech...
            </em>
          )}

          {transcriptSegments.map((seg, i) => (
            <div key={seg.timestamp + i} className="mb-1 flex justify-between">
              <span>{seg.text}</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs select-none ml-2">
                {new Date(seg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}

          {interimTranscript && (
            <div className="text-gray-500 dark:text-gray-400 italic">
              ...{interimTranscript}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mt-8 mb-3 px-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Translation (
            {languageOptions.find((l) => l.code === targetLanguage)?.name ||
              targetLanguage}
            )
          </h3>
          <div className="flex gap-2">
            <div className="relative" ref={translationDownloadRef}>
              <button
                onClick={() =>
                  setShowTranslationDownloadMenu(!showTranslationDownloadMenu)
                }
                disabled={translatedSegments.length === 0}
                className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                  translatedSegments.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                title="Download"
                aria-label="Download"
              >
                <Download className="w-5 h-5 dark:text-gray-300" />
              </button>
              {showTranslationDownloadMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => downloadFile(translatedSegments, "txt")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Download .txt
                  </button>

                  <button
                    onClick={() => downloadFile(translatedSegments, "csv")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Download .csv
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  translatedSegments.map((seg) => seg.text).join(" "),
                  setCopiedTranslation,
                )
              }
              disabled={translatedSegments.length === 0}
              className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
                translatedSegments.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              title="Copy Translation"
              aria-label="Copy Translation"
            >
              {copiedTranslation ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="w-5 h-5 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
        <div
          ref={translationContainerRef}
          className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 h-56 overflow-y-auto font-mono text-gray-900 dark:text-gray-100 shadow-sm whitespace-pre-wrap -mt-1"
          aria-live="polite"
        >
          {translatedSegments.length > 0 ? (
            translatedSegments.map((seg, i) => (
              <div
                key={seg.timestamp + i}
                className="mb-1 flex justify-between"
              >
                <span>{seg.text}</span>
                <span className="text-gray-400 dark:text-gray-500 text-xs select-none ml-2">
                  {new Date(seg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <em className="italic text-gray-400 dark:text-gray-500">
              Translation will appear here...
            </em>
          )}
        </div>
      </section>
    </div>
  );
};

export default RealTimeTranslate;
