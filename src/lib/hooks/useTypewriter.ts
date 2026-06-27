'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface UseTypewriterOptions {
  charDelay?: number;
  lineDelay?: number;
}

export default function useTypewriter(
  lines: string[],
  { charDelay = 38, lineDelay = 180 }: UseTypewriterOptions = {}
) {
  const prefersReducedMotion = useReducedMotion();
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [done, setDone] = useState(() => prefersReducedMotion || lines.length === 0);

  useEffect(() => {
    if (prefersReducedMotion || done || lines.length === 0) {
      return;
    }

    const currentLine = lines[activeLineIndex];

    const timeout = window.setTimeout(() => {
      if (charIndex < currentLine.length) {
        setCharIndex(current => current + 1);
        return;
      }

      if (activeLineIndex < lines.length - 1) {
        setActiveLineIndex(current => current + 1);
        setCharIndex(0);
        return;
      }

      setDone(true);
    }, charIndex < currentLine.length ? charDelay : lineDelay);

    return () => window.clearTimeout(timeout);
  }, [activeLineIndex, charDelay, charIndex, done, lineDelay, lines, prefersReducedMotion]);

  const revealedLines = useMemo(() => {
    if (prefersReducedMotion || done) {
      return lines;
    }

    return lines.map((line, index) => {
      if (index < activeLineIndex) {
        return line;
      }

      if (index === activeLineIndex) {
        return line.slice(0, charIndex);
      }

      return '';
    });
  }, [activeLineIndex, charIndex, done, lines, prefersReducedMotion]);

  return {
    revealedLines,
    showCursor: !prefersReducedMotion && !done,
    activeLine: prefersReducedMotion || lines.length === 0
      ? Math.max(lines.length - 1, 0)
      : activeLineIndex,
    done,
  };
}
