export const SITE_SESSION_CAPACITY = 10;
export const SITE_SESSION_CAPACITY_LONG_TERM = 50;
export const SESSION_TTL_MINUTES = 30;

export const LOCKOUT_WINDOWS_MS = {
  3: 5 * 60 * 1000,
  5: 30 * 60 * 1000,
  7: 60 * 60 * 1000,
} as const;

export function getLockoutDurationMs(failedAttempts: number) {
  if (failedAttempts >= 7) return LOCKOUT_WINDOWS_MS[7];
  if (failedAttempts >= 5) return LOCKOUT_WINDOWS_MS[5];
  if (failedAttempts >= 3) return LOCKOUT_WINDOWS_MS[3];
  return 0;
}

export function getLockoutMessage(failedAttempts: number) {
  if (failedAttempts >= 7) return 'This account is locked for 1 hour after repeated failed attempts.';
  if (failedAttempts >= 5) return 'This account is locked for 30 minutes after repeated failed attempts.';
  if (failedAttempts >= 3) return 'This account is locked for 5 minutes after repeated failed attempts.';
  return '';
}

export function getSessionExpiryDate(now = new Date()) {
  return new Date(now.getTime() + SESSION_TTL_MINUTES * 60 * 1000);
}
