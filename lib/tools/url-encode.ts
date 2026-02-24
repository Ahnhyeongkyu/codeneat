export interface UrlEncodeResult {
  output: string;
  error: string | null;
}

export function encodeUrl(input: string): UrlEncodeResult {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    const output = encodeURIComponent(input);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function decodeUrl(input: string): UrlEncodeResult {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    const output = decodeURIComponent(input);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function encodeFullUrl(input: string): UrlEncodeResult {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    const output = encodeURI(input);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function decodeFullUrl(input: string): UrlEncodeResult {
  try {
    if (!input) {
      return { output: "", error: null };
    }
    const output = decodeURI(input);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}
