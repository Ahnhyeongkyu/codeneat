export interface Base64Result {
  output: string;
  error: string | null;
}

export function encodeBase64(input: string): Base64Result {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    let binary = "";
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    const output = btoa(binary);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export function encodeBase64Url(input: string): Base64Result {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    let binary = "";
    for (let i = 0; i < data.length; i++) {
      binary += String.fromCharCode(data[i]);
    }
    const output = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export function decodeBase64Url(input: string): Base64Result {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) {
      base64 += "=".repeat(4 - pad);
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const output = decoder.decode(bytes);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export function decodeBase64(input: string): Base64Result {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    const cleaned = input.replace(/\s/g, "");
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const output = decoder.decode(bytes);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}
