/**
 * Pre-loaded BFS mutation problems
 * These examples demonstrate various graph traversal scenarios
 */

export interface MutationExample {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  startGene: string;
  endGene: string;
  bank: string[];
  expectedMutations?: number; // For verification
}

export const mutationExamples: MutationExample[] = [
  // Easy Examples - Simple paths
  {
    id: 'single-step',
    name: 'Single Step',
    description: 'One mutation required - simplest case',
    difficulty: 'easy',
    startGene: 'AACCGGTT',
    endGene: 'AACCGGTA',
    bank: ['AACCGGTA'],
    expectedMutations: 1
  },
  {
    id: 'two-steps',
    name: 'Two Steps',
    description: 'Two mutations in sequence',
    difficulty: 'easy',
    startGene: 'AACCGGTT',
    endGene: 'AAACGGTA',
    bank: ['AACCGGTA', 'AAACGGTA'],
    expectedMutations: 2
  },
  {
    id: 'three-steps',
    name: 'Three Steps',
    description: 'Linear path with three mutations',
    difficulty: 'easy',
    startGene: 'AACCGGTT',
    endGene: 'AAACGATA',
    bank: ['AACCGGTA', 'AAACGGTA', 'AAACGATA'],
    expectedMutations: 3
  },
  {
    id: 'no-path-simple',
    name: 'No Path (Simple)',
    description: 'Target not reachable - demonstrates failure case',
    difficulty: 'easy',
    startGene: 'AACCGGTT',
    endGene: 'TTTTTTTT',
    bank: ['AACCGGTA', 'AACCGCTA'],
    expectedMutations: -1
  },
  {
    id: 'start-equals-end',
    name: 'Already There',
    description: 'Start equals end - zero mutations',
    difficulty: 'easy',
    startGene: 'AACCGGTT',
    endGene: 'AACCGGTT',
    bank: ['AACCGGTT'],
    expectedMutations: 0
  },

  // Medium Examples - Multiple paths, choices
  {
    id: 'two-paths-same-length',
    name: 'Two Paths',
    description: 'Multiple valid paths of same length',
    difficulty: 'medium',
    startGene: 'AACCGGTT',
    endGene: 'AACCGGCC',
    bank: [
      'AACCGGTC', // Path 1: T->C at position 7
      'AACCGGCT', // Path 2: T->C at position 6
      'AACCGGCC'  // End
    ],
    expectedMutations: 2
  },
  {
    id: 'branching-path',
    name: 'Branching Path',
    description: 'Multiple options at each step',
    difficulty: 'medium',
    startGene: 'AAAAACCC',
    endGene: 'TTTTACCC',
    bank: [
      'TAAAACCC', 'ATAAACCC', 'AATAACCC', 'AAATACCC',
      'TTAAACCC', 'TATAACCC', 'TAATACCC',
      'TTTAACCC', 'TTATACC', 'TTATACCC',
      'TTTTACCC'
    ],
    expectedMutations: 4
  },
  {
    id: 'dead-end',
    name: 'Dead End',
    description: 'Some paths lead nowhere - BFS finds optimal',
    difficulty: 'medium',
    startGene: 'AAAAAAAA',
    endGene: 'CCCCAAAA',
    bank: [
      'TAAAAAAA', 'TTAAAAAA', 'TTTAAAAA', 'TTTTAAAA', // Dead end path
      'CAAAAAAA', 'CCAAAAAA', 'CCCAAAAA', 'CCCCAAAA'  // Correct path
    ],
    expectedMutations: 4
  },
  {
    id: 'longer-path-available',
    name: 'Optimal vs Long',
    description: 'Short path exists alongside longer alternative',
    difficulty: 'medium',
    startGene: 'GGGGGGGG',
    endGene: 'GGGGGGGT',
    bank: [
      'GGGGGGGT', // Direct path (1 step)
      'TGGGGGGG', 'TTGGGGGG', 'TTTGGGGG', 'TTTTGGGG', // Long detour
      'TTTTGGGT'
    ],
    expectedMutations: 1
  },

  // Hard Examples - Complex graphs
  {
    id: 'large-bank',
    name: 'Large Gene Bank',
    description: 'Many possible genes to explore',
    difficulty: 'hard',
    startGene: 'AACCGGTT',
    endGene: 'GGCCAATT',
    bank: [
      'AACCGGTA', 'AACCGGTC', 'AACCGGTG',
      'AACCGATT', 'AACCGCTT', 'AACCGTTT',
      'AACAGGTT', 'AACTGGTT', 'AACGGGTT',
      'GACCGGTT', 'CACCGGTT', 'TACCGGTT',
      'GACCGGTA', 'GACCGATT', 'GACCAATT',
      'GGCCAATT', 'GACCAATA', 'GGCCAATA',
      'GAACGGTT', 'GACCGATT', 'GACAAATT',
      'GGCCAGTT', 'GGCCAAAT', 'GGCCAATC'
    ],
    expectedMutations: 4
  },
  {
    id: 'maze-like',
    name: 'Maze Navigation',
    description: 'Complex interconnected mutation network',
    difficulty: 'hard',
    startGene: 'AAAAAAAA',
    endGene: 'TTTTTTTT',
    bank: [
      // Layer 1
      'TAAAAAAA', 'ATAAAAAA', 'AATAAAAA', 'AAATAAAA',
      'AAAATAAA', 'AAAAATAA', 'AAAAAATA', 'AAAAAAÁT',
      // Layer 2
      'TTAAAAAA', 'TATAAAAA', 'TAATAAAA', 'TAAATAAA',
      'TAAAATAA', 'TAAAAATA', 'TAAAAAÁT',
      // Layer 3
      'TTTAAAAA', 'TTATAAAA', 'TTAATAAA', 'TTAAATAA',
      'TTAAAATA', 'TTAAAAAT',
      // Layer 4
      'TTTTAAAA', 'TTTATÁAA', 'TTTAATAA', 'TTTAAATA',
      'TTTAAAAT',
      // Layer 5
      'TTTTTAAA', 'TTTTATAA', 'TTTTAATA', 'TTTTAAAT',
      // Layer 6
      'TTTTTTAA', 'TTTTTATA', 'TTTTTAAT',
      // Layer 7
      'TTTTTTTA', 'TTTTTTÁT',
      // End
      'TTTTTTTT'
    ],
    expectedMutations: 8
  },
  {
    id: 'cyclic-options',
    name: 'Cyclic Options',
    description: 'Graph contains cycles - BFS handles correctly',
    difficulty: 'hard',
    startGene: 'ACGTACGT',
    endGene: 'TGCATGCA',
    bank: [
      'TCGTACGT', 'TGGTACGT', 'TGCTACGT', 'TGCAACGT',
      'TGCATCGT', 'TGCATGGT', 'TGCATGCT', 'TGCATGCA',
      // Additional nodes that create cycles
      'ACGAACGT', 'ACGTACGA', 'AGGTACGT',
      'TGCTACGA', 'TGCAACGA', 'TCGATGCA'
    ],
    expectedMutations: 8
  },
  {
    id: 'viral-evolution',
    name: 'Viral Evolution',
    description: 'Simulated viral mutation pathway',
    difficulty: 'hard',
    startGene: 'ATGCATGC',
    endGene: 'GCTAGCTA',
    bank: [
      'ATGCATGA', 'ATGCATGT', 'ATGCATAC',
      'ATGCAAGC', 'ATGCTTGC', 'ATGCGTGC',
      'GTGCATGC', 'CTGCATGC', 'TTGCATGC',
      'GCTAATGC', 'GCTAGTGC', 'GCTAATGA',
      'GCTAGCGA', 'GCTAGCTC', 'GCTAGCTT',
      'GCTAGCTA', 'GCTCGCTA', 'GCTTGCTA',
      'GATAATGC', 'GCTAATAC', 'ACTAGCTA'
    ],
    expectedMutations: 6
  },
  {
    id: 'no-path-complex',
    name: 'No Path (Complex)',
    description: 'Large bank but no valid path exists',
    difficulty: 'hard',
    startGene: 'AAAAAAAA',
    endGene: 'GGGGGGGG',
    bank: [
      // Cluster 1 (reachable from start)
      'TAAAAAAA', 'TTAAAAAA', 'TTTAAAAA', 'TTTTAAAA',
      'TTTTTAAA', 'TTTTTTAA', 'TTTTTTTA', 'TTTTTTTT',
      // Cluster 2 (reachable from end, but not connected to cluster 1)
      'CGGGGGGG', 'CCGGGGGG', 'CCCGGGGG', 'CCCCGGGG',
      'CCCCCGGG', 'CCCCCCGG', 'CCCCCCCG', 'CCCCCCCC',
      // End (no bridge between clusters)
      'GGGGGGGG'
    ],
    expectedMutations: -1
  }
];

/**
 * Get examples by difficulty
 */
export function getExamplesByDifficulty(difficulty: MutationExample['difficulty']): MutationExample[] {
  return mutationExamples.filter(ex => ex.difficulty === difficulty);
}

/**
 * Get example by ID
 */
export function getMutationExampleById(id: string): MutationExample | undefined {
  return mutationExamples.find(ex => ex.id === id);
}

/**
 * Get all difficulties with counts
 */
export function getDifficultyCounts(): Record<MutationExample['difficulty'], number> {
  const counts: Record<MutationExample['difficulty'], number> = {
    easy: 0,
    medium: 0,
    hard: 0
  };

  for (const example of mutationExamples) {
    counts[example.difficulty]++;
  }

  return counts;
}

/**
 * Get a random example by difficulty
 */
export function getRandomExample(difficulty?: MutationExample['difficulty']): MutationExample {
  const filtered = difficulty
    ? mutationExamples.filter(ex => ex.difficulty === difficulty)
    : mutationExamples;

  return filtered[Math.floor(Math.random() * filtered.length)];
}
