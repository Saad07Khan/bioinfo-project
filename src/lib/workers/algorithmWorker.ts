/// <reference lib="webworker" />

import { runAlignmentTask, runMutationTask } from '@/lib/algorithms/runAlgorithmTask';
import type { AlgorithmWorkerRequest, AlgorithmWorkerResponse } from '@/lib/workers/algorithmWorker.types';

const workerScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<AlgorithmWorkerRequest>) => {
  const request = event.data;

  try {
    if (request.kind === 'align') {
      const result = runAlignmentTask(request.algorithm, request.seq1, request.seq2, request.scoring);
      const response: AlgorithmWorkerResponse = {
        requestId: request.requestId,
        status: 'success',
        kind: 'align',
        alignmentResult: result.alignmentResult,
        steps: result.steps
      };
      workerScope.postMessage(response);
      return;
    }

    const result = runMutationTask(request.startGene, request.endGene, request.bank);
    const response: AlgorithmWorkerResponse = {
      requestId: request.requestId,
      status: 'success',
      kind: 'mutate',
      mutationResult: result.mutationResult,
      steps: result.steps
    };
    workerScope.postMessage(response);
  } catch (error) {
    const response: AlgorithmWorkerResponse = {
      requestId: request.requestId,
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown worker error'
    };
    workerScope.postMessage(response);
  }
};

export {};
