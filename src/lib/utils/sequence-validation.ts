/**
 * Sequence validation utilities for GENOMIX
 */

import {
  ValidationResult,
  MAX_SEQUENCE_LENGTH,
  MAX_GENE_LENGTH,
  ERROR_MESSAGES
} from '@/types/algorithms';

// Valid DNA nucleotides
const DNA_CHARS = new Set(['A', 'C', 'G', 'T']);

// Valid amino acid single-letter codes
const AMINO_ACIDS = new Set([
  'A', 'R', 'N', 'D', 'C', 'E', 'Q', 'G', 'H', 'I',
  'L', 'K', 'M', 'F', 'P', 'S', 'T', 'W', 'Y', 'V',
  'B', 'Z', 'X', '*', '-'
]);

/**
 * Clean a sequence by removing whitespace and converting to uppercase
 */
export function cleanSequence(sequence: string): string {
  return sequence
    .replace(/\s+/g, '')     // Remove all whitespace
    .replace(/\n/g, '')      // Remove newlines
    .replace(/\r/g, '')      // Remove carriage returns
    .toUpperCase();
}

/**
 * Validate a DNA sequence for alignment algorithms
 */
export function validateDNASequence(
  sequence: string,
  allowAminoAcids: boolean = false
): ValidationResult {
  const cleaned = cleanSequence(sequence);

  if (cleaned.length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.EMPTY_SEQUENCE };
  }

  if (cleaned.length > MAX_SEQUENCE_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.TOO_LONG };
  }

  const validChars = allowAminoAcids ? AMINO_ACIDS : DNA_CHARS;

  for (const char of cleaned) {
    if (!validChars.has(char)) {
      return {
        isValid: false,
        error: `Invalid character '${char}' found. ${ERROR_MESSAGES.INVALID_CHARACTERS}`
      };
    }
  }

  return { isValid: true, cleanedValue: cleaned };
}

/**
 * Validate a gene for BFS mutation algorithm (must be exactly 8 ACGT characters)
 */
export function validateGene(gene: string): ValidationResult {
  const cleaned = cleanSequence(gene);

  if (cleaned.length === 0) {
    return { isValid: false, error: 'Gene cannot be empty' };
  }

  if (cleaned.length !== MAX_GENE_LENGTH) {
    return {
      isValid: false,
      error: `Gene must be exactly ${MAX_GENE_LENGTH} characters (got ${cleaned.length})`
    };
  }

  for (const char of cleaned) {
    if (!DNA_CHARS.has(char)) {
      return {
        isValid: false,
        error: `Invalid character '${char}'. ${ERROR_MESSAGES.INVALID_GENE_CHARS}`
      };
    }
  }

  return { isValid: true, cleanedValue: cleaned };
}

/**
 * Parse a bank of genes from text input (newline or comma separated)
 */
export function parseGeneBank(input: string): string[] {
  return input
    .split(/[,\n]+/)
    .map(gene => cleanSequence(gene))
    .filter(gene => gene.length > 0);
}

/**
 * Validate a bank of genes for BFS mutation algorithm
 */
export function validateGeneBank(
  bank: string[],
  endGene?: string
): ValidationResult {
  if (bank.length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.EMPTY_BANK };
  }

  for (let i = 0; i < bank.length; i++) {
    const result = validateGene(bank[i]);
    if (!result.isValid) {
      return {
        isValid: false,
        error: `Gene at position ${i + 1}: ${result.error}`
      };
    }
  }

  if (endGene) {
    const cleanedEnd = cleanSequence(endGene);
    if (!bank.includes(cleanedEnd)) {
      return { isValid: false, error: ERROR_MESSAGES.END_NOT_IN_BANK };
    }
  }

  return { isValid: true };
}

/**
 * Check if sequence might be too long for smooth visualization
 */
export function isLargeSequence(sequence: string): boolean {
  return cleanSequence(sequence).length > 1000;
}

/**
 * Get sequence statistics
 */
export function getSequenceStats(sequence: string): {
  length: number;
  composition: Record<string, number>;
  gcContent?: number;
} {
  const cleaned = cleanSequence(sequence);
  const composition: Record<string, number> = {};

  for (const char of cleaned) {
    composition[char] = (composition[char] || 0) + 1;
  }

  // Calculate GC content for DNA sequences
  const gcCount = (composition['G'] || 0) + (composition['C'] || 0);
  const totalACGT = (composition['A'] || 0) + (composition['C'] || 0) +
                    (composition['G'] || 0) + (composition['T'] || 0);

  const gcContent = totalACGT > 0 ? (gcCount / totalACGT) * 100 : undefined;

  return {
    length: cleaned.length,
    composition,
    gcContent
  };
}
