/** Escapes a string so it can be used safely inside a RegExp. */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Case-insensitive, whitespace-tolerant RegExp for matching visible text. */
export function looseText(value: string): RegExp {
  return new RegExp(escapeRegExp(value).replace(/\s+/g, '\\s+'), 'i');
}

/** Indonesian short-date format used across the site, e.g. "17 Sep 2026". */
export const SHORT_DATE = /\b\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\b/;

/** Normalises a scheme name for comparison (case, spacing, "BAZNAS" casing). */
export function normaliseName(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}
