const BASE_URL = "https://api.lemonsqueezy.com/v1";

function getHeaders() {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${key}`,
  };
}

interface LicenseValidation {
  valid: boolean;
  error?: string;
  meta?: {
    store_id: number;
    product_name: string;
    status: string;
  };
}

/** Validate a license key with Lemon Squeezy */
export async function validateLicenseKey(
  licenseKey: string,
  instanceName: string,
): Promise<LicenseValidation> {
  const res = await fetch(`${BASE_URL}/licenses/validate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      license_key: licenseKey,
      instance_name: instanceName,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.valid) {
    return {
      valid: false,
      error: data.error || "Invalid license key",
    };
  }

  const storeId = Number(process.env.LEMONSQUEEZY_STORE_ID);
  if (storeId && data.meta?.store_id !== storeId) {
    return { valid: false, error: "License key does not belong to this store" };
  }

  return {
    valid: true,
    meta: {
      store_id: data.meta?.store_id,
      product_name: data.meta?.product_name,
      status: data.license_key?.status,
    },
  };
}

/** Activate a license key instance */
export async function activateLicenseKey(
  licenseKey: string,
  instanceName: string,
): Promise<LicenseValidation> {
  const res = await fetch(`${BASE_URL}/licenses/activate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      license_key: licenseKey,
      instance_name: instanceName,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    return {
      valid: false,
      error: data.error || "Failed to activate license",
    };
  }

  return { valid: true };
}

/** Deactivate a license key instance */
export async function deactivateLicenseKey(
  licenseKey: string,
  instanceId: string,
): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/licenses/deactivate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      license_key: licenseKey,
      instance_id: instanceId,
    }),
  });

  return res.ok;
}
