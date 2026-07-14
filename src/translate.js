// Lightweight translation for the under-bubble English line.
// Uses the free, keyless, CORS-enabled MyMemory API. Results are cached per
// (from,to,text) so a growing bubble / re-render doesn't refetch. Never throws.
const cache = new Map();

export async function translate(text, from = "es", to = "en") {
  const clean = (text || "").trim();
  if (!clean) return null;
  const key = `${from}|${to}|${clean}`;
  if (cache.has(key)) return cache.get(key);
  try {
    const r = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${from}|${to}`
    );
    if (!r.ok) return null;
    const j = await r.json();
    const t = j?.responseData?.translatedText;
    if (t && t.trim()) {
      cache.set(key, t.trim());
      return t.trim();
    }
    return null;
  } catch {
    return null;
  }
}
