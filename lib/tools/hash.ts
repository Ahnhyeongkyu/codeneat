export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: { value: HashAlgorithm; label: string }[] = [
  { value: "MD5", label: "MD5" },
  { value: "SHA-1", label: "SHA-1" },
  { value: "SHA-256", label: "SHA-256" },
  { value: "SHA-384", label: "SHA-384" },
  { value: "SHA-512", label: "SHA-512" },
];

// --- MD5 pure-JS implementation (RFC 1321) ---
function md5(input: string): string {
  const utf8 = new TextEncoder().encode(input);
  const len = utf8.length;

  // Pre-processing: add padding
  const bitLen = len * 8;
  const padLen = ((56 - (len + 1) % 64) + 64) % 64;
  const buf = new Uint8Array(len + 1 + padLen + 8);
  buf.set(utf8);
  buf[len] = 0x80;
  // Append length in bits as 64-bit little-endian
  const view = new DataView(buf.buffer);
  view.setUint32(buf.length - 8, bitLen >>> 0, true);
  view.setUint32(buf.length - 4, Math.floor(bitLen / 0x100000000), true);

  // Per-round shift amounts
  const s = [
    7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
    5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
    4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
    6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21,
  ];
  // Pre-computed K table
  const K = Array.from({ length: 64 }, (_, i) =>
    (Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000)) >>> 0
  );

  let a0 = 0x67452301 >>> 0;
  let b0 = 0xefcdab89 >>> 0;
  let c0 = 0x98badcfe >>> 0;
  let d0 = 0x10325476 >>> 0;

  for (let offset = 0; offset < buf.length; offset += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(offset + j * 4, true);
    }

    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + ((F << s[i]) | (F >>> (32 - s[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  // Output as little-endian hex
  const toHex = (n: number) => {
    const bytes = [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];
    return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
  };
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

export interface HashResult {
  hash: string;
  error: string | null;
}

export async function generateHash(
  input: string,
  algorithm: HashAlgorithm = "SHA-256"
): Promise<HashResult> {
  try {
    if (!input) {
      return { hash: "", error: null };
    }
    if (algorithm === "MD5") {
      return { hash: md5(input), error: null };
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return { hash, error: null };
  } catch (e) {
    return { hash: "", error: e instanceof Error ? e.message : String(e) };
  }
}

function md5FromBytes(bytes: Uint8Array): string {
  const len = bytes.length;
  const bitLen = len * 8;
  const padLen = ((56 - (len + 1) % 64) + 64) % 64;
  const buf = new Uint8Array(len + 1 + padLen + 8);
  buf.set(bytes);
  buf[len] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(buf.length - 8, bitLen >>> 0, true);
  view.setUint32(buf.length - 4, Math.floor(bitLen / 0x100000000), true);
  const s = [
    7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
    5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
    4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
    6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21,
  ];
  const K = Array.from({ length: 64 }, (_, i) =>
    (Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000)) >>> 0
  );
  let a0 = 0x67452301 >>> 0, b0 = 0xefcdab89 >>> 0, c0 = 0x98badcfe >>> 0, d0 = 0x10325476 >>> 0;
  for (let offset = 0; offset < buf.length; offset += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) M[j] = view.getUint32(offset + j * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + ((F << s[i]) | (F >>> (32 - s[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const toHex = (n: number) => {
    const b = [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];
    return b.map(x => x.toString(16).padStart(2, "0")).join("");
  };
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

export async function generateHashFromFile(
  file: ArrayBuffer,
  algorithm: HashAlgorithm = "SHA-256"
): Promise<HashResult> {
  try {
    if (file.byteLength === 0) {
      return { hash: "", error: null };
    }
    if (algorithm === "MD5") {
      return { hash: md5FromBytes(new Uint8Array(file)), error: null };
    }
    const hashBuffer = await crypto.subtle.digest(algorithm, file);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return { hash, error: null };
  } catch (e) {
    return { hash: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export async function generateAllHashesFromFile(
  file: ArrayBuffer
): Promise<Record<HashAlgorithm, string>> {
  const entries = await Promise.all(
    HASH_ALGORITHMS.map(async (algo) => {
      const result = await generateHashFromFile(file, algo.value);
      return [algo.value, result.hash] as const;
    })
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}

export async function generateAllHashes(
  input: string
): Promise<Record<HashAlgorithm, string>> {
  const entries = await Promise.all(
    HASH_ALGORITHMS.map(async (algo) => {
      const result = await generateHash(input, algo.value);
      return [algo.value, result.hash] as const;
    })
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}
