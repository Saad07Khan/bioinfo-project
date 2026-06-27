/**
 * Pre-loaded sequence pairs for demonstration
 * These examples showcase various alignment scenarios
 */

export interface AlignmentExample {
  id: string;
  name: string;
  description: string;
  seq1: string;
  seq2: string;
  category: 'educational' | 'evolutionary' | 'medical';
}

export const alignmentExamples: AlignmentExample[] = [
  // Educational Examples - Simple concepts
  {
    id: 'perfect-match',
    name: 'Perfect Match',
    description: 'Two identical sequences - demonstrates 100% identity',
    seq1: 'ATCGATCGATCG',
    seq2: 'ATCGATCGATCG',
    category: 'educational'
  },
  {
    id: 'single-mismatch',
    name: 'Single Mismatch',
    description: 'One nucleotide difference - shows mismatch scoring',
    seq1: 'ATCGATCGATCG',
    seq2: 'ATCGTTCGATCG',
    category: 'educational'
  },
  {
    id: 'single-gap',
    name: 'Single Gap',
    description: 'One insertion/deletion - demonstrates gap penalty',
    seq1: 'ATCGATCGATCG',
    seq2: 'ATCGACGATCG',
    category: 'educational'
  },
  {
    id: 'multiple-gaps',
    name: 'Multiple Gaps',
    description: 'Several insertions - shows gap accumulation',
    seq1: 'ATCGATCGATCGATCG',
    seq2: 'ATCGTCGTCG',
    category: 'educational'
  },
  {
    id: 'short-vs-long',
    name: 'Length Difference',
    description: 'Sequences of different lengths - demonstrates end gaps',
    seq1: 'ATCGATCG',
    seq2: 'ATCGATCGATCGATCG',
    category: 'educational'
  },
  {
    id: 'no-similarity',
    name: 'No Similarity',
    description: 'Completely different sequences - shows worst case',
    seq1: 'AAAAAAAAAA',
    seq2: 'TTTTTTTTTT',
    category: 'educational'
  },

  // Evolutionary Examples - Real biological patterns
  {
    id: 'conserved-region',
    name: 'Conserved Region',
    description: 'Highly conserved sequence with variable flanks',
    seq1: 'NNNATCGATCGATCGNNN',
    seq2: 'XXXATCGATCGATCGXXX',
    category: 'evolutionary'
  },
  {
    id: 'human-mouse-insulin-snippet',
    name: 'Insulin Gene Snippet',
    description: 'Simulated human vs mouse insulin gene fragment',
    seq1: 'ATGGCCCTGTGGATGCGCTTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCC',
    seq2: 'ATGGCCCTGTGGATGCGCTTCCTGCCCTTGCTGGCCCTCTGGGGACCTGACCCAGCC',
    category: 'evolutionary'
  },
  {
    id: 'hemoglobin-alpha',
    name: 'Hemoglobin Alpha Chain',
    description: 'Conserved hemoglobin sequence comparison',
    seq1: 'ATGGTGCTGTCTCCTGCCGACAAGACCAACGTCAAGGCCGCCTGGGGTAAG',
    seq2: 'ATGGTGCTGTCTCCCGCCGACAAGACCAACGTCAAGGCCGCCTGGGGTAAG',
    category: 'evolutionary'
  },
  {
    id: 'cytochrome-c',
    name: 'Cytochrome C',
    description: 'Highly conserved mitochondrial protein gene',
    seq1: 'ATGGGTGATGTTGAGAAAGGCAAGAAGATTTTCCAGAAATGTAAGAAGAAC',
    seq2: 'ATGGGTGATGTTGAGAAGGGCAAGAAGATCTTCCAGAAATGCAAGAAGAAC',
    category: 'evolutionary'
  },

  // Medical Examples - Disease-related sequences
  {
    id: 'brca1-mutation',
    name: 'BRCA1 Mutation Site',
    description: 'Normal vs cancer-associated BRCA1 variant',
    seq1: 'ATGCAACTGGAGCCAAGAAGAGTAACAAGCCAAATGAACAGACAAGTAAAA',
    seq2: 'ATGCAACTGGAGCCAATAAGAGTAACAAGCCAAATGAACAGACAAGTAAAA',
    category: 'medical'
  },
  {
    id: 'tp53-hotspot',
    name: 'TP53 Hotspot Mutation',
    description: 'Tumor suppressor gene mutation comparison',
    seq1: 'ATGACTGAATATAAACTTGTGGTAGTTGGAGCTGGTGGCGTAGGC',
    seq2: 'ATGACTGAATATAAACTTGTGATAGTTGGAGCTGGTGGCGTAGGC',
    category: 'medical'
  },
  {
    id: 'sickle-cell',
    name: 'Sickle Cell Mutation',
    description: 'Normal vs sickle cell hemoglobin variant',
    seq1: 'ATGGTGCATCTGACTCCTGAGGAGAAGTCTGCC',
    seq2: 'ATGGTGCATCTGACTCCTGTGGAGAAGTCTGCC',
    category: 'medical'
  },
  {
    id: 'cystic-fibrosis',
    name: 'CFTR Delta F508',
    description: 'Most common cystic fibrosis mutation',
    seq1: 'ATCATCTTTGGTGTTTCCTATGATGAATATAGATACAGAAGC',
    seq2: 'ATCATTGGTGTTTCCTATGATGAATATAGATACAGAAGC',
    category: 'medical'
  },

  // More Educational Examples
  {
    id: 'palindrome',
    name: 'Palindromic Sequence',
    description: 'Self-complementary restriction site',
    seq1: 'GAATTCGAATTCGAATTC',
    seq2: 'GAATTCGAATTC',
    category: 'educational'
  },
  {
    id: 'repeat-region',
    name: 'Tandem Repeat',
    description: 'Variable number tandem repeat comparison',
    seq1: 'ATGATGATGATGATGATG',
    seq2: 'ATGATGATGATG',
    category: 'educational'
  },
  {
    id: 'gc-rich',
    name: 'GC-Rich Region',
    description: 'High GC content sequences',
    seq1: 'GCGCGCGCGCGCGCGC',
    seq2: 'GCGCGCATGCGCGCGC',
    category: 'educational'
  },
  {
    id: 'at-rich',
    name: 'AT-Rich Region',
    description: 'High AT content sequences (promoter-like)',
    seq1: 'TATAATATAATATAATA',
    seq2: 'TATAAAATATAATATA',
    category: 'educational'
  }
];

/**
 * Get examples by category
 */
export function getExamplesByCategory(category: AlignmentExample['category']): AlignmentExample[] {
  return alignmentExamples.filter(ex => ex.category === category);
}

/**
 * Get example by ID
 */
export function getExampleById(id: string): AlignmentExample | undefined {
  return alignmentExamples.find(ex => ex.id === id);
}

/**
 * Get all categories with counts
 */
export function getCategoryCounts(): Record<AlignmentExample['category'], number> {
  const counts: Record<AlignmentExample['category'], number> = {
    educational: 0,
    evolutionary: 0,
    medical: 0
  };

  for (const example of alignmentExamples) {
    counts[example.category]++;
  }

  return counts;
}
