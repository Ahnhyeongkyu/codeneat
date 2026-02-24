/**
 * Permalink/Share utilities — encode tool state into URL hash
 * Uses Base64 encoding with URI-safe characters.
 * Max shareable size: 8KB (URL length limit safety)
 */

const MAX_SHARE_SIZE = 8 * 1024; // 8KB

export interface ShareState {
  [key: string]: string;
}

/** Encode state object into a URL-safe hash string */
export function encodeShareState(state: ShareState): string {
  const json = JSON.stringify(state);
  if (new Blob([json]).size > MAX_SHARE_SIZE) {
    return "";
  }
  // btoa works with Latin1, so encode UTF-8 first
  const utf8 = new TextEncoder().encode(json);
  const binary = String.fromCharCode(...utf8);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a URL hash string back into state object */
export function decodeShareState(hash: string): ShareState | null {
  try {
    if (!hash) return null;
    // Restore standard Base64
    let b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Build a full shareable URL with hash */
export function buildShareUrl(state: ShareState): string {
  const encoded = encodeShareState(state);
  if (!encoded) return "";
  return `${window.location.origin}${window.location.pathname}#${encoded}`;
}

/** Read state from current URL hash */
export function readShareState(): ShareState | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1);
  return decodeShareState(hash);
}
