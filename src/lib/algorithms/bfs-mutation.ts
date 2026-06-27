/**
 * BFS Minimum Genetic Mutation Algorithm
 *
 * Finds shortest mutation path between two gene sequences.
 * Treats valid mutations as a graph and uses BFS to find shortest path.
 *
 * Rules:
 * - Sequences must be exactly 8 characters long
 * - Only characters A, C, G, T allowed
 * - Two sequences are adjacent if they differ by exactly 1 character
 * - All intermediate sequences must be in the bank
 */

import { MutationResult, MutationResultSerializable } from '@/types/algorithms';
import { AnimationStep, BFSStepData } from '@/lib/stores/animationStore';

/**
 * Check if two genes differ by exactly one character
 */
function isOneCharDifferent(gene1: string, gene2: string): boolean {
  if (gene1.length !== gene2.length) {
    return false;
  }

  let diffCount = 0;
  for (let i = 0; i < gene1.length; i++) {
    if (gene1[i] !== gene2[i]) {
      diffCount++;
      if (diffCount > 1) {
        return false;
      }
    }
  }

  return diffCount === 1;
}

/**
 * Build adjacency list for the gene mutation graph
 */
function buildAdjacencyList(genes: string[]): Map<string, string[]> {
  const adjacencyList = new Map<string, string[]>();

  // Initialize adjacency list for all genes
  for (const gene of genes) {
    adjacencyList.set(gene, []);
  }

  // Find all pairs of genes that differ by exactly 1 character
  for (let i = 0; i < genes.length; i++) {
    for (let j = i + 1; j < genes.length; j++) {
      if (isOneCharDifferent(genes[i], genes[j])) {
        adjacencyList.get(genes[i])!.push(genes[j]);
        adjacencyList.get(genes[j])!.push(genes[i]);
      }
    }
  }

  return adjacencyList;
}

/**
 * BFS Minimum Genetic Mutation algorithm
 *
 * @param startGene - Starting gene sequence (8 characters, ACGT)
 * @param endGene - Target gene sequence (8 characters, ACGT)
 * @param bank - Array of valid intermediate gene sequences
 * @returns MutationResult with path, exploration history, and graph structure
 */
export function minGeneticMutation(
  startGene: string,
  endGene: string,
  bank: string[]
): MutationResult {
  // Edge case: start equals end
  if (startGene === endGene) {
    return {
      minMutations: 0,
      path: [startGene],
      explored: [startGene],
      queueSnapshots: [[startGene]],
      adjacencyList: new Map([[startGene, []]]),
      success: true
    };
  }

  // Create a set of the bank for O(1) lookup
  const bankSet = new Set(bank);

  // If end gene is not in bank, no path exists
  if (!bankSet.has(endGene)) {
    return {
      minMutations: -1,
      path: [],
      explored: [startGene],
      queueSnapshots: [[startGene]],
      adjacencyList: buildAdjacencyList([startGene, ...bank]),
      success: false
    };
  }

  // Build the graph including start gene
  const allGenes = bankSet.has(startGene)
    ? [...bank]
    : [startGene, ...bank];
  const adjacencyList = buildAdjacencyList(allGenes);

  // If start gene is not in adjacency list, add it
  if (!adjacencyList.has(startGene)) {
    adjacencyList.set(startGene, []);
    // Find neighbors for start gene from bank
    for (const gene of bank) {
      if (isOneCharDifferent(startGene, gene)) {
        adjacencyList.get(startGene)!.push(gene);
      }
    }
  }

  // BFS
  interface QueueItem {
    gene: string;
    mutations: number;
    path: string[];
  }

  const queue: QueueItem[] = [{ gene: startGene, mutations: 0, path: [startGene] }];
  const visited = new Set<string>([startGene]);
  const explored: string[] = [startGene];
  const queueSnapshots: string[][] = [[startGene]];

  while (queue.length > 0) {
    const { gene: currentGene, mutations, path } = queue.shift()!;

    // Get neighbors (genes that differ by 1 character and are in bank)
    const neighbors: string[] = [];
    for (const bankGene of bank) {
      if (!visited.has(bankGene) && isOneCharDifferent(currentGene, bankGene)) {
        neighbors.push(bankGene);
      }
    }

    for (const neighbor of neighbors) {
      const newPath = [...path, neighbor];

      // Found the target
      if (neighbor === endGene) {
        explored.push(neighbor);
        queueSnapshots.push([...queue.map(q => q.gene), neighbor]);

        return {
          minMutations: mutations + 1,
          path: newPath,
          explored,
          queueSnapshots,
          adjacencyList,
          success: true
        };
      }

      // Add to queue
      visited.add(neighbor);
      explored.push(neighbor);
      queue.push({ gene: neighbor, mutations: mutations + 1, path: newPath });
    }

    // Record queue state after processing this gene
    if (queue.length > 0) {
      queueSnapshots.push(queue.map(q => q.gene));
    }
  }

  // No path found
  return {
    minMutations: -1,
    path: [],
    explored,
    queueSnapshots,
    adjacencyList,
    success: false
  };
}

/**
 * Convert MutationResult to a serializable format (for React components)
 */
export function toSerializableResult(result: MutationResult): MutationResultSerializable {
  const adjacencyObj: Record<string, string[]> = {};
  result.adjacencyList.forEach((neighbors, gene) => {
    adjacencyObj[gene] = neighbors;
  });

  return {
    minMutations: result.minMutations,
    path: result.path,
    explored: result.explored,
    queueSnapshots: result.queueSnapshots,
    adjacencyList: adjacencyObj,
    success: result.success
  };
}

/**
 * Convert serializable result back to MutationResult
 */
export function fromSerializableResult(result: MutationResultSerializable): MutationResult {
  const adjacencyList = new Map<string, string[]>();
  for (const [gene, neighbors] of Object.entries(result.adjacencyList)) {
    adjacencyList.set(gene, neighbors);
  }

  return {
    minMutations: result.minMutations,
    path: result.path,
    explored: result.explored,
    queueSnapshots: result.queueSnapshots,
    adjacencyList,
    success: result.success
  };
}

/**
 * Get the character difference between two genes
 * Returns the position and the old/new characters
 */
export function getGeneDifference(
  gene1: string,
  gene2: string
): { position: number; from: string; to: string } | null {
  if (gene1.length !== gene2.length) {
    return null;
  }

  for (let i = 0; i < gene1.length; i++) {
    if (gene1[i] !== gene2[i]) {
      return {
        position: i,
        from: gene1[i],
        to: gene2[i]
      };
    }
  }

  return null;
}

/**
 * Generate all possible single mutations for a gene
 * Useful for understanding the mutation space
 */
export function generateAllMutations(gene: string): string[] {
  const nucleotides = ['A', 'C', 'G', 'T'];
  const mutations: string[] = [];

  for (let i = 0; i < gene.length; i++) {
    for (const nucleotide of nucleotides) {
      if (nucleotide !== gene[i]) {
        const mutated = gene.slice(0, i) + nucleotide + gene.slice(i + 1);
        mutations.push(mutated);
      }
    }
  }

  return mutations;
}

/**
 * Check if a valid path exists between two genes
 * Faster than full BFS when you only need to know existence
 */
export function hasPathExists(
  startGene: string,
  endGene: string,
  bank: string[]
): boolean {
  if (startGene === endGene) {
    return true;
  }

  const bankSet = new Set(bank);
  if (!bankSet.has(endGene)) {
    return false;
  }

  const visited = new Set<string>([startGene]);
  const queue = [startGene];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const bankGene of bank) {
      if (!visited.has(bankGene) && isOneCharDifferent(current, bankGene)) {
        if (bankGene === endGene) {
          return true;
        }
        visited.add(bankGene);
        queue.push(bankGene);
      }
    }
  }

  return false;
}

/**
 * Generate animation steps for BFS mutation algorithm
 */
export function generateBFSAnimationSteps(
  startGene: string,
  endGene: string,
  bank: string[]
): AnimationStep[] {
  const steps: AnimationStep[] = [];

  // Edge case: start equals end
  if (startGene === endGene) {
    steps.push({
      type: 'bfs',
      description: 'Start gene equals end gene - no mutations needed!',
      data: {
        currentGene: startGene,
        queue: [],
        visited: new Set([startGene]),
        path: [startGene],
        phase: 'found'
      } as BFSStepData
    });
    return steps;
  }

  const bankSet = new Set(bank);

  // Check if end gene is in bank
  if (!bankSet.has(endGene)) {
    steps.push({
      type: 'bfs',
      description: `End gene ${endGene} is not in the gene bank - no path can exist!`,
      data: {
        currentGene: startGene,
        queue: [],
        visited: new Set([startGene]),
        path: [],
        phase: 'not_found'
      } as BFSStepData
    });
    return steps;
  }

  // Initial state
  steps.push({
    type: 'bfs',
    description: `Initialize BFS: Start from ${startGene}, target is ${endGene}`,
    data: {
      currentGene: startGene,
      queue: [startGene],
      visited: new Set([startGene]),
      path: [],
      phase: 'init'
    } as BFSStepData
  });

  // BFS with step tracking
  interface QueueItem {
    gene: string;
    mutations: number;
    path: string[];
  }

  const queue: QueueItem[] = [{ gene: startGene, mutations: 0, path: [startGene] }];
  const visited = new Set<string>([startGene]);

  while (queue.length > 0) {
    const { gene: currentGene, mutations, path } = queue.shift()!;

    // Find neighbors
    const neighbors: string[] = [];
    for (const bankGene of bank) {
      if (!visited.has(bankGene) && isOneCharDifferent(currentGene, bankGene)) {
        neighbors.push(bankGene);
      }
    }

    // Step: exploring current gene
    steps.push({
      type: 'bfs',
      description: `Dequeue ${currentGene}. Found ${neighbors.length} unvisited neighbor(s).`,
      data: {
        currentGene,
        queue: queue.map(q => q.gene),
        visited: new Set(visited),
        path: path,
        phase: 'explore',
        neighbors
      } as BFSStepData
    });

    // Check each neighbor
    for (const neighbor of neighbors) {
      const newPath = [...path, neighbor];

      // Step: checking neighbor
      steps.push({
        type: 'bfs',
        description: `Checking neighbor ${neighbor} (differs by 1 character from ${currentGene})`,
        data: {
          currentGene,
          queue: queue.map(q => q.gene),
          visited: new Set(visited),
          path: path,
          phase: 'explore',
          neighbors,
          currentNeighbor: neighbor
        } as BFSStepData
      });

      // Found target
      if (neighbor === endGene) {
        visited.add(neighbor);
        steps.push({
          type: 'bfs',
          description: `Found target ${endGene}! Path length: ${newPath.length - 1} mutations`,
          data: {
            currentGene: neighbor,
            queue: [],
            visited: new Set(visited),
            path: newPath,
            phase: 'found'
          } as BFSStepData
        });
        return steps;
      }

      // Add to queue
      visited.add(neighbor);
      queue.push({ gene: neighbor, mutations: mutations + 1, path: newPath });

      steps.push({
        type: 'bfs',
        description: `Add ${neighbor} to queue. Queue size: ${queue.length}`,
        data: {
          currentGene,
          queue: queue.map(q => q.gene),
          visited: new Set(visited),
          path: path,
          phase: 'explore',
          neighbors
        } as BFSStepData
      });
    }
  }

  // No path found
  steps.push({
    type: 'bfs',
    description: `Queue empty - no path exists from ${startGene} to ${endGene}`,
    data: {
      currentGene: startGene,
      queue: [],
      visited: new Set(visited),
      path: [],
      phase: 'not_found'
    } as BFSStepData
  });

  return steps;
}
