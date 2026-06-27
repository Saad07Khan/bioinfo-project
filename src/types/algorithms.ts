/**
 * Type definitions for GENOMIX bioinformatics algorithms
 */

// Scoring scheme for sequence alignment algorithms
export interface ScoringScheme {
  match: number;      // Score for matching characters (typically +1 or +2)
  mismatch: number;   // Penalty for mismatches (typically -1)
  gap: number;        // Penalty for gaps (typically -1 or -2)
}

// Result from Needleman-Wunsch or Smith-Waterman alignment
export interface AlignmentResult {
  alignedSeq1: string;           // First sequence with gaps
  alignedSeq2: string;           // Second sequence with gaps
  score: number;                 // Total alignment score
  matrix: number[][];            // Complete DP matrix for visualization
  traceback: [number, number][]; // Path taken during traceback
  matches: number;               // Number of matching positions
  mismatches: number;            // Number of mismatching positions
  gaps: number;                  // Total number of gaps
  identity: number;              // Percentage identity (0-100)
  startPos?: {                   // For Smith-Waterman: where alignment starts
    seq1: number;
    seq2: number;
  };
  endPos?: {                     // For Smith-Waterman: where alignment ends
    seq1: number;
    seq2: number;
  };
}

// Result from BFS Minimum Genetic Mutation
export interface MutationResult {
  minMutations: number;                    // Number of steps (-1 if no path)
  path: string[];                          // Sequence of genes from start to end
  explored: string[];                      // All genes visited during BFS
  queueSnapshots: string[][];              // Queue state at each BFS step (for visualization)
  adjacencyList: Map<string, string[]>;    // Graph structure
  success: boolean;                        // Whether path was found
}

// Serializable version of MutationResult (for passing to components)
export interface MutationResultSerializable {
  minMutations: number;
  path: string[];
  explored: string[];
  queueSnapshots: string[][];
  adjacencyList: Record<string, string[]>; // Object instead of Map
  success: boolean;
}

// Algorithm types
export type AlgorithmType = 'needleman-wunsch' | 'smith-waterman' | 'bfs-mutation';

// Validation result
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  cleanedValue?: string;
}

// Performance constants
export const MAX_SEQUENCE_LENGTH = 5000;    // For alignment algorithms
export const MAX_GENE_LENGTH = 8;           // For BFS (fixed)
export const MAX_BANK_SIZE = 500;           // For BFS
export const MATRIX_VIRTUAL_THRESHOLD = 100; // Use virtual rendering above this
export const LARGE_SEQUENCE_WARNING = 1000;  // Warn user

// Error messages
export const ERROR_MESSAGES = {
  EMPTY_SEQUENCE: 'Please enter both sequences',
  INVALID_CHARACTERS: 'Sequences must contain only A, C, G, T (or amino acids)',
  TOO_LONG: `Sequences must be under ${MAX_SEQUENCE_LENGTH} characters`,
  LENGTH_MISMATCH: 'For BFS, all genes must be exactly 8 characters',
  END_NOT_IN_BANK: 'End gene must be in the mutation bank',
  EMPTY_BANK: 'Mutation bank cannot be empty',
  INVALID_GENE_CHARS: 'Genes must contain only A, C, G, T',
  GENE_LENGTH: 'Genes must be exactly 8 characters',
} as const;
