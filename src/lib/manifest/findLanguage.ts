const defaultLanguage = "en";

/**
 * Extract display string in preferred language, or english, or first available
 */
export function findLanguage(
  translations: unknown,
  lang = defaultLanguage
): string {
  if (!translations || typeof translations !== "object") {
    return "";
  }
  const map = translations as Record<string, string[]>;

  const tryLang = (lang: string) =>
    Array.isArray(map[lang]) && map[lang].length ? map[lang][0] : null;

  return tryLang(lang)
    ?? tryLang(defaultLanguage)
    ?? tryLang("none")
    ?? firstValue(map)
    ?? "";
}

function firstValue(map: Record<string, string[]>): string | null {
  for (const values of Object.values(map)) {
    if (Array.isArray(values) && values.length) {
      return values[0];
    }
  }
  return null;
}