/**
 * Application constants
 * Centralized location for all app-wide constant values
 */

export const PASSWORD_REGEX = /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
export const PASSWORD_ERROR_MESSAGE = 'Must contain 8 characters, 1 uppercase, and 1 number';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_PREFERENCES: 'userPreferences',
} as const;

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 4000,
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

