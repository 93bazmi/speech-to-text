export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    const langpair = `${sourceLanguage.split("-")[0]}|${targetLanguage.split("-")[0]}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json({
      translation: data.responseData.translatedText,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
