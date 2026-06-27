import { generateBFSAnimationSteps, minGeneticMutation, toSerializableResult } from '@/lib/algorithms/bfs-mutation';
import { generateNWAnimationSteps, needlemanWunsch } from '@/lib/algorithms/needleman-wunsch';
import { generateSWAnimationSteps, smithWaterman } from '@/lib/algorithms/smith-waterman';
import type { AnimationStep } from '@/lib/stores/animationStore';
import type { AlignmentResult, MutationResultSerializable, ScoringScheme } from '@/types/algorithms';

export type AlignmentAlgorithmTask = 'needleman-wunsch' | 'smith-waterman';

export type AlignmentTaskResult = {
  alignmentResult: AlignmentResult;
  steps: AnimationStep[];
};

export type MutationTaskResult = {
  mutationResult: MutationResultSerializable;
  steps: AnimationStep[];
};

export function runAlignmentTask(
  algorithm: AlignmentAlgorithmTask,
  seq1: string,
  seq2: string,
  scoring: ScoringScheme
): AlignmentTaskResult {
  if (algorithm === 'needleman-wunsch') {
    return {
      alignmentResult: needlemanWunsch(seq1, seq2, scoring),
      steps: generateNWAnimationSteps(seq1, seq2, scoring)
    };
  }

  return {
    alignmentResult: smithWaterman(seq1, seq2, scoring),
    steps: generateSWAnimationSteps(seq1, seq2, scoring)
  };
}

export function runMutationTask(
  startGene: string,
  endGene: string,
  bank: string[]
): MutationTaskResult {
  const result = minGeneticMutation(startGene, endGene, bank);

  return {
    mutationResult: toSerializableResult(result),
    steps: generateBFSAnimationSteps(startGene, endGene, bank)
  };
}
