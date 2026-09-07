"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Custom hook to handle clipboard copying with haptic visual feedback
 */
export function useCopy(timeoutMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        await navigator.clipboard.writeText(text);
        setCopied(true);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, timeoutMs);
        return true;
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        setCopied(false);
        return false;
      }
    },
    [timeoutMs]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copied, copy };
}
