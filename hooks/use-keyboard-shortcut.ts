"use client";

import { useEffect } from "react";

type ShortcutMap = Record<string, () => void>;

/**
 * Register keyboard shortcuts for tool pages.
 *
 * Supported format: "ctrl+enter", "ctrl+shift+c", "ctrl+shift+x"
 * Modifier keys: ctrl (or cmd on Mac), shift, alt
 */
export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Don't trigger when typing in inputs (unless it's a modifier combo)
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput = tag === "INPUT" || tag === "SELECT";

      for (const [combo, action] of Object.entries(shortcuts)) {
        const parts = combo.toLowerCase().split("+");
        const key = parts[parts.length - 1];
        const needCtrl = parts.includes("ctrl") || parts.includes("cmd");
        const needShift = parts.includes("shift");
        const needAlt = parts.includes("alt");

        const ctrlMatch = needCtrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = needShift ? e.shiftKey : true;
        const altMatch = needAlt ? e.altKey : true;
        const keyMatch = e.key.toLowerCase() === key || e.code.toLowerCase() === `key${key}`;

        // For Enter key
        const enterMatch = key === "enter" && e.key === "Enter";

        if (ctrlMatch && shiftMatch && altMatch && (keyMatch || enterMatch)) {
          // Allow ctrl combos even in textareas, but block plain keys in inputs
          if (!needCtrl && isInput) continue;
          e.preventDefault();
          action();
          return;
        }
      }
    }

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
