/**
 * Needleman-Wunsch Global Sequence Alignment Algorithm
 *
 * Finds the optimal alignment between two complete sequences.
 * Uses dynamic programming to maximize alignment score.
 *
 * Algorithm steps:
 * 1. Initialize matrix with gap penalties
 * 2. Fill matrix using scoring scheme
 * 3. Traceback from bottom-right to top-left
 * 4. Return aligned sequences with gaps
 */

import { ScoringScheme, AlignmentResult } from '@/types/algorithms';
import { AnimationStep, MatrixStepData } from '@/lib/stores/animationStore';

/**
 * Default scoring scheme for Needleman-Wunsch
 */
export const DEFAULT_NW_SCORING: ScoringScheme = {
  match: 1,
  mismatch: -1,
  gap: -2
};

/**
 * Needleman-Wunsch global sequence alignment algorithm
 *
 * @param seq1 - First sequence to align
 * @param seq2 - Second sequence to align
 * @param scoring - Scoring scheme (match, mismatch, gap penalties)
 * @returns AlignmentResult with aligned sequences, score, matrix, and statistics
 */
export function needlemanWunsch(
  seq1: string,
  seq2: string,
  scoring: ScoringScheme = DEFAULT_NW_SCORING
): AlignmentResult {
  const m = seq1.length;
  const n = seq2.length;

  // Handle edge cases
  if (m === 0 && n === 0) {
    return createEmptyResult();
  }
  if (m === 0) {
    return createGapOnlyResult(seq2, 'seq1', scoring);
  }
  if (n === 0) {
    return createGapOnlyResult(seq1, 'seq2', scoring);
  }

  // Step 1: Initialize the scoring matrix
  // Matrix is (m+1) x (n+1) to include initial gap row/column
  const matrix: number[][] = [];
  for (let i = 0; i <= m; i++) {
    matrix[i] = new Array(n + 1).fill(0);
  }

  // Initialize first row with cumulative gap penalties
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j * scoring.gap;
  }

  // Initialize first column with cumulative gap penalties
  for (let i = 0; i <= m; i++) {
    matrix[i][0] = i * scoring.gap;
  }

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

      // Take the maximum
      matrix[i][j] = Math.max(diagonal, up, left);
    }
  }

  // Step 3: Traceback from bottom-right to top-left
  const traceback: [number, number][] = [];
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    traceback.push([i, j]);

    if (i === 0) {
      // Only gaps in seq1 remain
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = seq2[j - 1] + alignedSeq2;
      j--;
    } else if (j === 0) {
      // Only gaps in seq2 remain
      alignedSeq1 = seq1[i - 1] + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } else {
      const matchScore = seq1[i - 1] === seq2[j - 1]
        ? scoring.match
        : scoring.mismatch;

      const currentScore = matrix[i][j];
      const diagonalScore = matrix[i - 1][j - 1] + matchScore;
      const upScore = matrix[i - 1][j] + scoring.gap;

      // Prefer diagonal (match/mismatch), then up (gap in seq2), then left (gap in seq1)
      if (currentScore === diagonalScore) {
        alignedSeq1 = seq1[i - 1] + alignedSeq1;
        alignedSeq2 = seq2[j - 1] + alignedSeq2;
        i--;
        j--;
      } else if (currentScore === upScore) {
        alignedSeq1 = seq1[i - 1] + alignedSeq1;
        alignedSeq2 = '-' + alignedSeq2;
        i--;
      } else {
        alignedSeq1 = '-' + alignedSeq1;
        alignedSeq2 = seq2[j - 1] + alignedSeq2;
        j--;
      }
    }
  }

  // Add the starting position
  traceback.push([0, 0]);
  traceback.reverse();

  // Step 4: Calculate statistics
  const { matches, mismatches, gaps } = calculateStatistics(alignedSeq1, alignedSeq2);
  const alignmentLength = alignedSeq1.length;
  const identity = alignmentLength > 0 ? (matches / alignmentLength) * 100 : 0;

  return {
    alignedSeq1,
    alignedSeq2,
    score: matrix[m][n],
    matrix,
    traceback,
    matches,
    mismatches,
    gaps,
    identity: Math.round(identity * 100) / 100  // Round to 2 decimal places
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
 * Create an empty result for empty input sequences
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
    identity: 0
  };
}

/**
 * Create a result when one sequence is empty (all gaps)
 */
function createGapOnlyResult(
  sequence: string,
  emptySeq: 'seq1' | 'seq2',
  scoring: ScoringScheme
): AlignmentResult {
  const gaps = '-'.repeat(sequence.length);
  const score = sequence.length * scoring.gap;

  const alignedSeq1 = emptySeq === 'seq1' ? gaps : sequence;
  const alignedSeq2 = emptySeq === 'seq2' ? gaps : sequence;

  // Build simple matrix
  const matrix: number[][] = [];
  if (emptySeq === 'seq1') {
    matrix.push([]);
    for (let j = 0; j <= sequence.length; j++) {
      matrix[0].push(j * scoring.gap);
    }
  } else {
    for (let i = 0; i <= sequence.length; i++) {
      matrix.push([i * scoring.gap]);
    }
  }

  // Build traceback
  const traceback: [number, number][] = [];
  for (let k = sequence.length; k >= 0; k--) {
    if (emptySeq === 'seq1') {
      traceback.push([0, k]);
    } else {
      traceback.push([k, 0]);
    }
  }
  traceback.reverse();

  return {
    alignedSeq1,
    alignedSeq2,
    score,
    matrix,
    traceback,
    matches: 0,
    mismatches: 0,
    gaps: sequence.length,
    identity: 0
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
 * Generate animation steps for Needleman-Wunsch algorithm
 * For small sequences only (max 15 characters each)
 */
export function generateNWAnimationSteps(
  seq1: string,
  seq2: string,
  scoring: ScoringScheme = DEFAULT_NW_SCORING
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

  // Step 1: Initialize first row
  for (let j = 0; j <= n; j++) {
    matrix[0][j] = j * scoring.gap;
    steps.push({
      type: 'matrix',
      description: j === 0
        ? 'Initialize top-left corner with 0'
        : `Initialize row 0, column ${j} with gap penalty: ${j} × ${scoring.gap} = ${matrix[0][j]}`,
      data: {
        row: 0,
        col: j,
        value: matrix[0][j],
        matrix: matrix.map(row => [...row]),
        phase: 'init'
      } as MatrixStepData
    });
  }

  // Step 2: Initialize first column
  for (let i = 1; i <= m; i++) {
    matrix[i][0] = i * scoring.gap;
    steps.push({
      type: 'matrix',
      description: `Initialize row ${i}, column 0 with gap penalty: ${i} × ${scoring.gap} = ${matrix[i][0]}`,
      data: {
        row: i,
        col: 0,
        value: matrix[i][0],
        matrix: matrix.map(row => [...row]),
        phase: 'init'
      } as MatrixStepData
    });
  }

  // Step 3: Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = seq1[i - 1];
      const char2 = seq2[j - 1];
      const matchScore = char1 === char2 ? scoring.match : scoring.mismatch;

      const diagonal = matrix[i - 1][j - 1] + matchScore;
      const up = matrix[i - 1][j] + scoring.gap;
      const left = matrix[i][j - 1] + scoring.gap;

      matrix[i][j] = Math.max(diagonal, up, left);

      const chosen = matrix[i][j] === diagonal ? 'diagonal (match/mismatch)'
        : matrix[i][j] === up ? 'up (gap in seq2)'
        : 'left (gap in seq1)';

      steps.push({
        type: 'matrix',
        description: `Compare ${char1} vs ${char2}: diagonal=${diagonal}, up=${up}, left=${left}. Choose ${chosen} = ${matrix[i][j]}`,
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

  // Step 4: Traceback
  const traceback: [number, number][] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    traceback.push([i, j]);

    const currentTraceback = [...traceback];

    if (i === 0) {
      steps.push({
        type: 'matrix',
        description: `Traceback: At (${i}, ${j}), move left (gap in seq1)`,
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
    } else if (j === 0) {
      steps.push({
        type: 'matrix',
        description: `Traceback: At (${i}, ${j}), move up (gap in seq2)`,
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
      const matchScore = seq1[i - 1] === seq2[j - 1] ? scoring.match : scoring.mismatch;
      const diagonalScore = matrix[i - 1][j - 1] + matchScore;
      const upScore = matrix[i - 1][j] + scoring.gap;

      if (matrix[i][j] === diagonalScore) {
        steps.push({
          type: 'matrix',
          description: `Traceback: At (${i}, ${j}), move diagonal (${seq1[i-1]} aligns with ${seq2[j-1]})`,
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
      } else if (matrix[i][j] === upScore) {
        steps.push({
          type: 'matrix',
          description: `Traceback: At (${i}, ${j}), move up (gap in seq2)`,
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
          description: `Traceback: At (${i}, ${j}), move left (gap in seq1)`,
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
  }

  // Final step - show complete traceback
  traceback.push([0, 0]);
  steps.push({
    type: 'matrix',
    description: 'Traceback complete! The path shows the optimal alignment.',
    data: {
      row: 0,
      col: 0,
      value: 0,
      matrix: matrix.map(row => [...row]),
      phase: 'traceback',
      tracebackPath: traceback
    } as MatrixStepData
  });

  return steps;
}
