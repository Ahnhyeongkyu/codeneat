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
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/licenses/validate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        license_key: licenseKey,
        instance_name: instanceName,
      }),
    });
  } catch {
    return { valid: false, error: "Unable to reach license server" };
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    return { valid: false, error: "Invalid response from license server" };
  }

  if (!res.ok || !data.valid) {
    return {
      valid: false,
      error: (data.error as string) || "Invalid license key",
    };
  }

  const storeId = Number(process.env.LEMONSQUEEZY_STORE_ID);
  const meta = data.meta as Record<string, unknown> | undefined;
  if (storeId && meta?.store_id !== storeId) {
    return { valid: false, error: "License key does not belong to this store" };
  }

  const licenseKeyData = data.license_key as Record<string, unknown> | undefined;

  return {
    valid: true,
    meta: {
      store_id: meta?.store_id as number,
      product_name: meta?.product_name as string,
      status: licenseKeyData?.status as string,
    },
  };
}

/** Activate a license key instance */
export async function activateLicenseKey(
  licenseKey: string,
  instanceName: string,
): Promise<LicenseValidation> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/licenses/activate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        license_key: licenseKey,
        instance_name: instanceName,
      }),
    });
  } catch {
    return { valid: false, error: "Unable to reach license server" };
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    return { valid: false, error: "Invalid response from license server" };
  }

  if (!res.ok || data.error) {
    return {
      valid: false,
      error: (data.error as string) || "Failed to activate license",
    };
  }

  return { valid: true };
}

/** Deactivate a license key instance */
export async function deactivateLicenseKey(
  licenseKey: string,
  instanceId: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/licenses/deactivate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        license_key: licenseKey,
        instance_id: instanceId,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
