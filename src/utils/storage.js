/* ============================================
   CareerPilot AI — Local Storage Helpers
   Type-safe wrappers for localStorage operations
   ============================================ */

/**
 * Get an item from localStorage with JSON parsing.
 * Returns fallback if the key doesn't exist or parsing fails.
 */
export function getStorageItem(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Set an item in localStorage with JSON stringification.
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or unavailable
    console.warn(`Failed to save "${key}" to localStorage.`);
  }
}

/**
 * Remove an item from localStorage.
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`Failed to remove "${key}" from localStorage.`);
  }
}
