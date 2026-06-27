/**
 * Smith-Waterman Local Sequence Alignment Algorithm
 *
 * Finds the best matching subsequence within two sequences.
 * Ideal for finding conserved regions or functional domains.
 *
 * Key differences from Needleman-Wunsch:
 * - Initialize first row/column with zeros (not gap penalties)
 * - Negative scores become zero
 * - Traceback starts from maximum score in matrix
 * - Traceback stops when reaching zero
 */

import { ScoringScheme, AlignmentResult } from '@/types/algorithms';
import { AnimationStep, MatrixStepData } from '@/lib/stores/animationStore';

/**
 * Default scoring scheme for Smith-Waterman
 */
export const DEFAULT_SW_SCORING: ScoringScheme = {
  match: 2,
  mismatch: -1,
  gap: -1
};

/**
 * Smith-Waterman local sequence alignment algorithm
 *
 * @param seq1 - First sequence to align
 * @param seq2 - Second sequence to align
 * @param scoring - Scoring scheme (match, mismatch, gap penalties)
 * @returns AlignmentResult with aligned subsequences, score, matrix, and statistics
 */
export function smithWaterman(
  seq1: string,
  seq2: string,
  scoring: ScoringScheme = DEFAULT_SW_SCORING
): AlignmentResult {
  const m = seq1.length;
  const n = seq2.length;

  // Handle edge cases
  if (m === 0 || n === 0) {
    return createEmptyResult();
  }

  // Step 1: Initialize the scoring matrix with zeros
  const matrix: number[][] = [];
  for (let i = 0; i <= m; i++) {
    matrix[i] = new Array(n + 1).fill(0);
  }
  // First row and column are already 0 (key difference from NW)

  // Track the maximum score and its position
  let maxScore = 0;
  let maxI = 0;
  let maxJ = 0;

  // Step 2: Fill the matrix using the recurrence relation
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Calculate score for diagonal (match/mismatch)
      const matchScore = seq1[i - 1] === seq2[j - 1]
        ? scoring.match
        : scoring.mismatch;

      // Three possible moves:
      const diagonal = matrix[i - 1][j - 1] + matchScore;  // Match/mismatch
      const up = matrix[i - 1][j] + scoring.gap;           // Gap in seq2
      const left = matrix[i][j - 1] + scoring.gap;         // Gap in seq1

      // Take the maximum, but never go below 0 (key difference from NW)
      matrix[i][j] = Math.max(0, diagonal, up, left);

      // Track the maximum score position
      if (matrix[i][j] > maxScore) {
        maxScore = matrix[i][j];
        maxI = i;
        maxJ = j;
      }
    }
  }

  // If no alignment found (max score is 0), return empty result
  if (maxScore === 0) {
    return createEmptyResult();
  }

  // Step 3: Traceback from maximum score until reaching 0
  const traceback: [number, number][] = [];
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  let i = maxI;
  let j = maxJ;

  // Record ending position
  const endPos = { seq1: i - 1, seq2: j - 1 };

  while (i > 0 && j > 0 && matrix[i][j] > 0) {
    traceback.push([i, j]);

    const matchScore = seq1[i - 1] === seq2[j - 1]
      ? scoring.match
      : scoring.mismatch;

    const currentScore = matrix[i][j];
    const diagonalScore = matrix[i - 1][j - 1] + matchScore;
    const upScore = matrix[i - 1][j] + scoring.gap;

    // Prefer diagonal (match/mismatch), then up (gap in seq2), then left (gap in seq1)
    if (currentScore === diagonalScore && matrix[i - 1][j - 1] >= 0) {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      i--;
      j--;
    } else if (currentScore === upScore && matrix[i - 1][j] >= 0) {
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } else {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      j--;
    }
  }

  // Record starting position
  const startPos = { seq1: i, seq2: j };

  // Add the final position (where score becomes 0 or boundary)
  traceback.push([i, j]);
  traceback.reverse();

  // Step 4: Calculate statistics
  const { matches, mismatches, gaps } = calculateStatistics(alignedSeq1, alignedSeq2);
  const alignmentLength = alignedSeq1.length;
  const identity = alignmentLength > 0 ? (matches / alignmentLength) * 100 : 0;

  return {
    alignedSeq1,
    alignedSeq2,
    score: maxScore,
    matrix,
    traceback,
    matches,
    mismatches,
    gaps,
    identity: Math.round(identity * 100) / 100,  // Round to 2 decimal places
    startPos,
    endPos
  };
}

/**
 * Calculate alignment statistics from aligned sequences
 */
function calculateStatistics(
  aligned1: string,
  aligned2: string
): { matches: number; mismatches: number; gaps: number } {
  let matches = 0;
  let mismatches = 0;
  let gaps = 0;

  for (let i = 0; i < aligned1.length; i++) {
    if (aligned1[i] === '-' || aligned2[i] === '-') {
      gaps++;
    } else if (aligned1[i] === aligned2[i]) {
      matches++;
    } else {
      mismatches++;
    }
  }

  return { matches, mismatches, gaps };
}

/**
 * Create an empty result for cases with no valid alignment
 */
function createEmptyResult(): AlignmentResult {
  return {
    alignedSeq1: '',
    alignedSeq2: '',
    score: 0,
    matrix: [[0]],
    traceback: [[0, 0]],
    matches: 0,
    mismatches: 0,
    gaps: 0,
    identity: 0,
    startPos: { seq1: 0, seq2: 0 },
    endPos: { seq1: 0, seq2: 0 }
  };
}

/**
 * Generate match/mismatch string for display
 * Returns '|' for match, '.' for mismatch, ' ' for gap
 */
export function generateMatchString(aligned1: string, aligned2: string): string {
  let result = '';
  for (let i = 0; i < aligned1.length; i++) {
    if (aligned1[i] === '-' || aligned2[i] === '-') {
      result += ' ';
    } else if (aligned1[i] === aligned2[i]) {
      result += '|';
    } else {
      result += '.';
    }
  }
  return result;
}

/**
 * Find all local alignments above a threshold score
 * Useful for finding multiple conserved regions
 */
export function findAllLocalAlignments(
  seq1: string,
  seq2: string,
  scoring: ScoringScheme = DEFAULT_SW_SCORING,
  minScore: number = 10
): AlignmentResult[] {
  const m = seq1.length;
  const n = seq2.length;

  if (m === 0 || n === 0) {
    return [];
  }

  // Build the matrix first
  const matrix: number[][] = [];
  for (let i = 0; i <= m; i++) {
    matrix[i] = new Array(n + 1).fill(0);
  }

  // Collect all high-scoring positions
  const highScores: { i: number; j: number; score: number }[] = [];

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore = seq1[i - 1] === seq2[j - 1]
        ? scoring.match
        : scoring.mismatch;

      const diagonal = matrix[i - 1][j - 1] + matchScore;
      const up = matrix[i - 1][j] + scoring.gap;
      const left = matrix[i][j - 1] + scoring.gap;

      matrix[i][j] = Math.max(0, diagonal, up, left);

      if (matrix[i][j] >= minScore) {
        highScores.push({ i, j, score: matrix[i][j] });
      }
    }
  }

  // Sort by score descending
  highScores.sort((a, b) => b.score - a.score);

  // Traceback from each high-scoring position, avoiding overlaps
  const results: AlignmentResult[] = [];
  const usedCells = new Set<string>();

  for (const { i: startI, j: startJ, score } of highScores) {
    // Skip if this cell was already used in a previous alignment
    if (usedCells.has(`${startI},${startJ}`)) {
      continue;
    }

    // Perform traceback
    const traceback: [number, number][] = [];
    let alignedSeq1 = '';
    let alignedSeq2 = '';
    let i = startI;
    let j = startJ;

    while (i > 0 && j > 0 && matrix[i][j] > 0) {
      // Mark cell as used
      usedCells.add(`${i},${j}`);
      traceback.push([i, j]);

      const matchScore = seq1[i - 1] === seq2[j - 1]
        ? scoring.match
        : scoring.mismatch;

      const currentScore = matrix[i][j];
      const diagonalScore = matrix[i - 1][j - 1] + matchScore;
      const upScore = matrix[i - 1][j] + scoring.gap;

      if (currentScore === diagonalScore && matrix[i - 1][j - 1] >= 0) {
        alignedSeq1 = seq1[i - 1] + alignedSeq1;
        alignedSeq2 = seq2[j - 1] + alignedSeq2;
        i--;
        j--;
      } else if (currentScore === upScore && matrix[i - 1][j] >= 0) {
        alignedSeq1 = seq1[i - 1] + alignedSeq1;
        alignedSeq2 = '-' + alignedSeq2;
        i--;
      } else {
        alignedSeq1 = '-' + alignedSeq1;
        alignedSeq2 = seq2[j - 1] + alignedSeq2;
        j--;
      }
    }

    if (alignedSeq1.length > 0) {
      traceback.push([i, j]);
      traceback.reverse();

      const stats = calculateStatistics(alignedSeq1, alignedSeq2);
      const identity = alignedSeq1.length > 0
        ? (stats.matches / alignedSeq1.length) * 100
        : 0;

      results.push({
        alignedSeq1,
        alignedSeq2,
        score,
        matrix, // Share the same matrix
        traceback,
        ...stats,
        identity: Math.round(identity * 100) / 100,
        startPos: { seq1: i, seq2: j },
        endPos: { seq1: startI - 1, seq2: startJ - 1 }
      });
    }
  }

  return results;
}

/**
 * Generate animation steps for Smith-Waterman algorithm
 * For small sequences only (max 15 characters each)
 */
export function generateSWAnimationSteps(
  seq1: string,
  seq2: string,
  scoring: ScoringScheme = DEFAULT_SW_SCORING
): AnimationStep[] {
  const MAX_SIZE = 15;
  if (seq1.length > MAX_SIZE || seq2.length > MAX_SIZE) {
    return [];
  }

  const steps: AnimationStep[] = [];
  const m = seq1.length;
  const n = seq2.length;

  // Initialize matrix
  const matrix: number[][] = [];
  for (let i = 0; i <= m; i++) {
    matrix[i] = new Array(n + 1).fill(0);
  }

  // Step 1: Initialize (all zeros for Smith-Waterman)
  steps.push({
    type: 'matrix',
    description: 'Initialize matrix with all zeros (Smith-Waterman starts fresh, no gap penalties)',
    data: {
      row: 0,
      col: 0,
      value: 0,
      matrix: matrix.map(row => [...row]),
      phase: 'init'
    } as MatrixStepData
  });

  // Track max score position
  let maxScore = 0;
  let maxI = 0;
  let maxJ = 0;

  // Step 2: Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = seq1[i - 1];
      const char2 = seq2[j - 1];
      const matchScore = char1 === char2 ? scoring.match : scoring.mismatch;

      const diagonal = matrix[i - 1][j - 1] + matchScore;
      const up = matrix[i - 1][j] + scoring.gap;
      const left = matrix[i][j - 1] + scoring.gap;

      // Key difference: never go below 0
      matrix[i][j] = Math.max(0, diagonal, up, left);

      if (matrix[i][j] > maxScore) {
        maxScore = matrix[i][j];
        maxI = i;
        maxJ = j;
      }

      const chosen = matrix[i][j] === 0 ? 'zero (reset)'
        : matrix[i][j] === diagonal ? 'diagonal (match/mismatch)'
        : matrix[i][j] === up ? 'up (gap in seq2)'
        : 'left (gap in seq1)';

      const isNewMax = matrix[i][j] === maxScore && maxI === i && maxJ === j && matrix[i][j] > 0;

      steps.push({
        type: 'matrix',
        description: `Compare ${char1} vs ${char2}: diagonal=${diagonal}, up=${up}, left=${left}. Choose max(0, ...) = ${matrix[i][j]}${isNewMax ? ' (NEW MAX!)' : ''}`,
        data: {
          row: i,
          col: j,
          value: matrix[i][j],
          matrix: matrix.map(row => [...row]),
          phase: 'fill'
        } as MatrixStepData
      });
    }
  }

  // If no alignment found
  if (maxScore === 0) {
    steps.push({
      type: 'matrix',
      description: 'No local alignment found (all scores are 0)',
      data: {
        row: 0,
        col: 0,
        value: 0,
        matrix: matrix.map(row => [...row]),
        phase: 'traceback',
        tracebackPath: []
      } as MatrixStepData
    });
    return steps;
  }

  // Step 3: Traceback from max score until 0
  const traceback: [number, number][] = [];
  let i = maxI;
  let j = maxJ;

  steps.push({
    type: 'matrix',
    description: `Start traceback from maximum score ${maxScore} at position (${maxI}, ${maxJ})`,
    data: {
      row: maxI,
      col: maxJ,
      value: maxScore,
      matrix: matrix.map(row => [...row]),
      phase: 'traceback',
      tracebackPath: [[maxI, maxJ]]
    } as MatrixStepData
  });

  while (i > 0 && j > 0 && matrix[i][j] > 0) {
    traceback.push([i, j]);

    const matchScore = seq1[i - 1] === seq2[j - 1] ? scoring.match : scoring.mismatch;
    const diagonalScore = matrix[i - 1][j - 1] + matchScore;
    const upScore = matrix[i - 1][j] + scoring.gap;

    const currentTraceback = [...traceback];

    if (matrix[i][j] === diagonalScore && matrix[i - 1][j - 1] >= 0) {
      steps.push({
        type: 'matrix',
        description: `Traceback: At (${i}, ${j}) score=${matrix[i][j]}, move diagonal (${seq1[i-1]} aligns with ${seq2[j-1]})`,
        data: {
          row: i,
          col: j,
          value: matrix[i][j],
          matrix: matrix.map(row => [...row]),
          phase: 'traceback',
          tracebackPath: currentTraceback
        } as MatrixStepData
      });
      i--;
      j--;
    } else if (matrix[i][j] === upScore && matrix[i - 1][j] >= 0) {
      steps.push({
        type: 'matrix',
        description: `Traceback: At (${i}, ${j}) score=${matrix[i][j]}, move up (gap in seq2)`,
        data: {
          row: i,
          col: j,
          value: matrix[i][j],
          matrix: matrix.map(row => [...row]),
          phase: 'traceback',
          tracebackPath: currentTraceback
        } as MatrixStepData
      });
      i--;
    } else {
      steps.push({
        type: 'matrix',
        description: `Traceback: At (${i}, ${j}) score=${matrix[i][j]}, move left (gap in seq1)`,
        data: {
          row: i,
          col: j,
          value: matrix[i][j],
          matrix: matrix.map(row => [...row]),
          phase: 'traceback',
          tracebackPath: currentTraceback
        } as MatrixStepData
      });
      j--;
    }
  }

  // Final step
  traceback.push([i, j]);
  steps.push({
    type: 'matrix',
    description: `Traceback complete! Stopped at (${i}, ${j}) where score becomes 0. This is the local alignment.`,
    data: {
      row: i,
      col: j,
      value: matrix[i][j],
      matrix: matrix.map(row => [...row]),
      phase: 'traceback',
      tracebackPath: traceback
    } as MatrixStepData
  });

  return steps;
}
