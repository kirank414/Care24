/**
 * normalize.ts
 * Shared frontend utility functions for input normalization.
 * Applied on onBlur (display) and before API submission (data).
 * Backend also enforces these rules independently.
 */

/**
 * Converts a string to Proper Case.
 * e.g. "KIRAN KUMAR" → "Kiran Kumar"
 * e.g. "mary anne" → "Mary Anne"
 */
export function toProperCase(str: string): string {
  if (!str) return str;
  return str
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Normalizes an email address to lowercase and trims whitespace.
 * e.g. "JOHNDOE@GMAIL.COM" → "johndoe@gmail.com"
 * e.g. "Kiran.K@Outlook.Com" → "kiran.k@outlook.com"
 */
export function normalizeEmail(email: string): string {
  if (!email) return email;
  return email.trim().toLowerCase();
}

/**
 * Cleans a phone number to digits only, preserving an optional leading '+'.
 * e.g. "  +1 (555) 019-2" → "+15550192"
 * e.g. "abc123" → "123"
 */
export function cleanPhone(phone: string): string {
  if (!phone) return phone;
  const trimmed = phone.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return (hasPlus ? '+' : '') + digits;
}
