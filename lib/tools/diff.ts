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
