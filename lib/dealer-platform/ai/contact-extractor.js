// Extract name / phone / email from a free-form chat or SMS message.
// Returns { name, phone, email } where each value may be null.

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

// US phone patterns: (305) 555-1234, 305-555-1234, 305.555.1234,
// 3055551234, +1 305 555 1234. Normalized to digits.
const PHONE_RE = /(?:\+?1[\s.-]?)?\(?\s*(\d{3})\s*\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\b/;

const NAME_PATTERNS = [
  /\bmy name is\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){0,2})/i,
  /\bI['']?m\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){0,2})/,
  /\bthis is\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){0,2})/i,
  /\bcall me\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){0,2})/i,
  /\bname['']?s\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+){0,2})/i,
];

const NAME_BLOCKLIST = new Set([
  'looking', 'interested', 'wondering', 'asking', 'here', 'just',
  'really', 'still', 'good', 'fine', 'okay', 'ready', 'sure',
]);

function cleanName(raw) {
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  const first = trimmed.split(' ')[0].toLowerCase();
  if (NAME_BLOCKLIST.has(first)) return null;
  return trimmed;
}

export function extractContactInfo(message) {
  if (!message || typeof message !== 'string') {
    return { name: null, phone: null, email: null };
  }

  const emailMatch = message.match(EMAIL_RE);
  const email = emailMatch ? emailMatch[0].toLowerCase() : null;

  const phoneMatch = message.match(PHONE_RE);
  const phone = phoneMatch ? `${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}` : null;

  let name = null;
  for (const re of NAME_PATTERNS) {
    const m = message.match(re);
    if (m && m[1]) {
      const cleaned = cleanName(m[1]);
      if (cleaned) { name = cleaned; break; }
    }
  }

  return { name, phone, email };
}

export function splitName(fullName) {
  if (!fullName) return { firstName: '', lastName: '' };
  const parts = fullName.trim().split(/\s+/);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}
