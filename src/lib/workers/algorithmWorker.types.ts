import type { AnimationStep } from '@/lib/stores/animationStore';
import type { AlignmentResult, MutationResultSerializable, ScoringScheme } from '@/types/algorithms';

export type AlignmentWorkerRequest = {
  requestId: number;
  kind: 'align';
  algorithm: 'needleman-wunsch' | 'smith-waterman';
  seq1: string;
  seq2: string;
  scoring: ScoringScheme;
};

export type MutationWorkerRequest = {
  requestId: number;
  kind: 'mutate';
  startGene: string;
  endGene: string;
  bank: string[];
};

export type AlgorithmWorkerRequest = AlignmentWorkerRequest | MutationWorkerRequest;

export type AlignmentWorkerSuccessResponse = {
  requestId: number;
  status: 'success';
  kind: 'align';
  alignmentResult: AlignmentResult;
  steps: AnimationStep[];
};

export type MutationWorkerSuccessResponse = {
  requestId: number;
  status: 'success';
  kind: 'mutate';
  mutationResult: MutationResultSerializable;
  steps: AnimationStep[];
};

export type AlgorithmWorkerErrorResponse = {
  requestId: number;
  status: 'error';
  message: string;
};

export type AlgorithmWorkerResponse =
  | AlignmentWorkerSuccessResponse
  | MutationWorkerSuccessResponse
  | AlgorithmWorkerErrorResponse;
