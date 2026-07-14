// Word lookup for the tap-to-define popup. Uses two free, keyless, CORS-enabled
// APIs in parallel (no secret to leak):
//   - dictionaryapi.dev → part of speech + a definition (in the learning language)
//   - MyMemory          → a short English translation of the word
// Either can fail independently; we return whatever we got. If both fail →
// { notFound: true }.
export async function lookupWord(word, lang = "es") {
  const clean = (word || "").trim().toLowerCase();
  if (!clean) return { notFound: true };

  const [defR, trR] = await Promise.allSettled([
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURIComponent(clean)}`),
    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${lang}|en`),
  ]);

  let pos = null;
  let definition = null;
  let english = null;

  try {
    if (defR.status === "fulfilled" && defR.value.ok) {
      const data = await defR.value.json();
      const meaning = Array.isArray(data) ? data[0]?.meanings?.[0] : null;
      pos = meaning?.partOfSpeech || null;
      definition = meaning?.definitions?.[0]?.definition || null;
    }
  } catch {
    /* ignore — handled by the null checks below */
  }

  try {
    if (trR.status === "fulfilled" && trR.value.ok) {
      const t = await trR.value.json();
      const txt = t?.responseData?.translatedText;
      // Ignore echoes (API sometimes returns the input unchanged).
      if (txt && txt.trim().toLowerCase() !== clean) english = txt.trim();
    }
  } catch {
    /* ignore */
  }

  if (!pos && !definition && !english) return { notFound: true };
  return { word: clean, pos, definition, english };
}
