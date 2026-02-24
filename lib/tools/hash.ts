export type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: { value: HashAlgorithm; label: string }[] = [
  { value: "SHA-1", label: "SHA-1" },
  { value: "SHA-256", label: "SHA-256" },
  { value: "SHA-384", label: "SHA-384" },
  { value: "SHA-512", label: "SHA-512" },
];

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
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return { hash, error: null };
  } catch (e) {
    return { hash: "", error: (e as Error).message };
  }
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
