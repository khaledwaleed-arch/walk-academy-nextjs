// Egyptian phone validation
export function validatePhone(phone: string): { valid: boolean; normalized?: string; error?: string } {
  if (!phone) return { valid: false, error: 'Phone is required' };
  // Convert Arabic-Indic digits to ASCII
  let p = phone.replace(/[٠-٩]/g, (d: string) => String(d.charCodeAt(0) - 1632));
  // Strip spaces, dashes, parens
  p = p.replace(/[\s\-\(\)]/g, '');
  // Normalize prefix
  const match = p.match(/^(\+20|0020|0)?(1[0125]\d{8})$/);
  if (!match) return { valid: false, error: 'Invalid Egyptian phone number. Format: +201XXXXXXXXX' };
  return { valid: true, normalized: `+20${match[2]}` };
}

// Email validation
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Payment method allowlist
export const VALID_PAYMENT_METHODS = [
  'Vodafone Cash', 'Instapay', 'Etisalat Cash', 'Orange Money',
  'WE Pay', 'Fawry', 'Bank Transfer', 'Card'
];

// Valid statuses per entity
export const VALID_STATUSES = {
  registrations: ['new', 'contacted', 'enrolled', 'cancelled'],
  contacts: ['new', 'read', 'replied', 'archived', 'resolved'],
  consultations: ['new', 'pending', 'confirmed', 'cancelled', 'completed'],
  courses: ['draft', 'published', 'archived'],
  services: ['active', 'inactive'],
  posts: ['draft', 'published', 'trash'],
  pages: ['draft', 'published'],
};

// Slug validation
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  const s = (slug || '').trim();
  if (!s) return { valid: false, error: 'Slug is required' };
  if (!/^[a-z0-9-]+$/.test(s)) return { valid: false, error: 'Slug must be lowercase letters, numbers, and hyphens only' };
  return { valid: true };
}

// Field length limits
export const MAX_LENGTHS: Record<string, number> = {
  full_name: 200,
  email: 200,
  phone: 50,
  course: 100,
  country: 100,
  payment_method: 50,
  name: 255,
  subject: 255,
  company: 255,
  slug: 200,
  title: 500,
};

export function validateLength(field: string, value: string, maxLen?: number): string | null {
  const limit = maxLen || MAX_LENGTHS[field];
  if (!limit) return null;
  if (value && value.length > limit) return `${field} must be ${limit} characters or less`;
  return null;
}

// Remove null bytes and sanitize
export function sanitizeString(s: unknown): string | null {
  if (s === null || s === undefined) return null;
  return String(s).replace(/\0/g, '');
}
