interface CachedLicense {
  valid: boolean;
  expiresAt: number;
}

// In-memory bounded TTL cache for Edge Runtime
const LICENSE_CACHE = new Map<string, CachedLicense>();
const MAX_CACHE_ENTRIES = 500;
const VALID_TTL_MS = 60 * 60 * 1000; // 1 hour for valid licenses
const INVALID_TTL_MS = 5 * 60 * 1000; // 5 minutes for invalid keys (rate limit guard)

/**
 * Validates a Lemon Squeezy license key with in-memory TTL caching,
 * input format sanitization, and timeout protection.
 */
export async function validateLicenseKey(
  key: string | null | undefined
): Promise<boolean> {
  if (!key) return false;

  const trimmed = key.trim();

  // Basic sanity check: Lemon Squeezy keys are typically UUIDs or alphanumeric (8 to 100 chars)
  if (trimmed.length < 8 || trimmed.length > 100) {
    return false;
  }

  // Master bypass key for local development and automated testing
  if (
    process.env.PRO_LICENSE_KEY &&
    trimmed === process.env.PRO_LICENSE_KEY.trim()
  ) {
    return true;
  }

  // Check in-memory cache
  const cached = LICENSE_CACHE.get(trimmed);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.valid;
  }

  try {
    const formData = new FormData();
    formData.append("license_key", trimmed);

    // Timeout protection: abort if Lemon Squeezy API hangs beyond 3.5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      "https://api.lemonsqueezy.com/v1/licenses/validate",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Temporary network or upstream 5xx error: don't cache as permanently invalid
      return false;
    }

    const data = await response.json();

    // 1. Lemon Squeezy base validity check
    const isBaseValid = Boolean(data && data.valid === true);

    // 2. Key status check: must be 'active' (rejects 'disabled', 'expired', etc.)
    const isActive = !data.license_key || data.license_key.status === "active";

    // 3. Test mode defense: reject test-generated keys in production unless LEMONSQUEEZY_ALLOW_TEST_MODE=true
    const isTestModeAllowed =
      process.env.LEMONSQUEEZY_ALLOW_TEST_MODE === "true" ||
      !data.license_key ||
      data.license_key.test_mode === false;

    // 4. Store isolation: verify that key was issued by the configured Lemon Squeezy store
    const expectedStoreId = process.env.LEMONSQUEEZY_STORE_ID?.trim();
    const isStoreValid =
      !expectedStoreId || String(data.meta?.store_id) === expectedStoreId;

    const isValid = Boolean(
      isBaseValid && isActive && isTestModeAllowed && isStoreValid
    );

    // Maintain cache size to prevent memory leaks in long-running edge instances
    if (LICENSE_CACHE.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = LICENSE_CACHE.keys().next().value;
      if (oldestKey) LICENSE_CACHE.delete(oldestKey);
    }

    // Cache result with respective TTL
    LICENSE_CACHE.set(trimmed, {
      valid: isValid,
      expiresAt: now + (isValid ? VALID_TTL_MS : INVALID_TTL_MS),
    });

    return isValid;
  } catch (error) {
    console.warn("License verification network/timeout error:", error);
    return false;
  }
}
