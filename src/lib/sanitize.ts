/**
 * Sanitizes input strings to prevent DoS, memory exhaustion,
 * and rendering crashes in Satori / Resvg edge SVG compiler.
 */
export function sanitizeText(
  raw: string | null | undefined,
  maxLength: number,
  fallback = ""
): string {
  if (!raw) return fallback;

  // 1. Unicode NFC Normalization (prevents composite character decomposition attacks)
  let text = raw.normalize("NFC");

  // 2. Remove unprintable control characters and dangerous terminal escape codes
  // Retains standard readable characters and spaces, strips 0x00-0x08, 0x0B, 0x0C, 0x0E-0x1F, 0x7F-0x9F
  text = text.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E]/g,
    ""
  );

  // 3. Normalize multiple whitespace and line breaks to single space
  text = text.replace(/\s+/g, " ").trim();

  // 4. Safe grapheme/surrogate slice using Array.from to prevent breaking multi-byte emojis
  const characters = Array.from(text);
  if (characters.length > maxLength) {
    text = characters.slice(0, maxLength).join("").trim();
  }

  return text || fallback;
}
