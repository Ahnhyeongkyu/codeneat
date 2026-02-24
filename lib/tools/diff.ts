import DiffMatchPatch from "diff-match-patch";

export interface DiffSegment {
  type: "equal" | "insert" | "delete";
  text: string;
}

export interface DiffResult {
  diffs: DiffSegment[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
}

export interface LineDiff {
  left: { lineNo: number | null; text: string; type: "equal" | "delete" | "empty" };
  right: { lineNo: number | null; text: string; type: "equal" | "insert" | "empty" };
}

export function computeLineDiff(original: string, modified: string): LineDiff[] {
  const origLines = original.split("\n");
  const modLines = modified.split("\n");
  const result: LineDiff[] = [];

  // Simple LCS-based line diff
  const m = origLines.length;
  const n = modLines.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (origLines[i - 1] === modLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const lines: { type: "equal" | "delete" | "insert"; origIdx: number; modIdx: number }[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
      lines.unshift({ type: "equal", origIdx: i - 1, modIdx: j - 1 });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      lines.unshift({ type: "insert", origIdx: -1, modIdx: j - 1 });
      j--;
    } else {
      lines.unshift({ type: "delete", origIdx: i - 1, modIdx: -1 });
      i--;
    }
  }

  let origLineNo = 0;
  let modLineNo = 0;

  for (const line of lines) {
    if (line.type === "equal") {
      origLineNo++;
      modLineNo++;
      result.push({
        left: { lineNo: origLineNo, text: origLines[line.origIdx], type: "equal" },
        right: { lineNo: modLineNo, text: modLines[line.modIdx], type: "equal" },
      });
    } else if (line.type === "delete") {
      origLineNo++;
      result.push({
        left: { lineNo: origLineNo, text: origLines[line.origIdx], type: "delete" },
        right: { lineNo: null, text: "", type: "empty" },
      });
    } else {
      modLineNo++;
      result.push({
        left: { lineNo: null, text: "", type: "empty" },
        right: { lineNo: modLineNo, text: modLines[line.modIdx], type: "insert" },
      });
    }
  }

  return result;
}

export function computeDiff(original: string, modified: string): DiffResult {
  try {
    const dmp = new DiffMatchPatch();
    const rawDiffs = dmp.diff_main(original, modified);
    dmp.diff_cleanupSemantic(rawDiffs);

    let additions = 0;
    let deletions = 0;
    let unchanged = 0;

    const diffs: DiffSegment[] = rawDiffs.map(([op, text]) => {
      if (op === 1) {
        additions += text.length;
        return { type: "insert" as const, text };
      }
      if (op === -1) {
        deletions += text.length;
        return { type: "delete" as const, text };
      }
      unchanged += text.length;
      return { type: "equal" as const, text };
    });

    return {
      diffs,
      stats: { additions, deletions, unchanged },
    };
  } catch {
    return {
      diffs: [],
      stats: { additions: 0, deletions: 0, unchanged: 0 },
    };
  }
}
