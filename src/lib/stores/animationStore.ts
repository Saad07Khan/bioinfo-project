import { create } from 'zustand';

export interface AnimationStep {
  type: 'matrix' | 'bfs';
  description: string;
  data: MatrixStepData | BFSStepData;
}

export interface MatrixStepData {
  row: number;
  col: number;
  value: number;
  matrix: number[][];
  phase: 'init' | 'fill' | 'traceback';
  tracebackPath?: [number, number][];
}

export interface BFSStepData {
  currentGene: string;
  queue: string[];
  visited: Set<string>;
  path: string[];
  phase: 'init' | 'explore' | 'found' | 'not_found';
  neighbors?: string[];
  currentNeighbor?: string;
}

interface AnimationState {
  // Animation data
  steps: AnimationStep[];
  currentStepIndex: number;

  // Playback controls
  isPlaying: boolean;
  speed: number; // ms between steps

  // Actions
  setSteps: (steps: AnimationStep[]) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
  clearAnimation: () => void;
}

export const useAnimationStore = create<AnimationState>((set, get) => ({
  // Initial state
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: 500, // 500ms default

  // Actions
  setSteps: (steps) => set({ steps, currentStepIndex: 0, isPlaying: false }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  reset: () => set({ currentStepIndex: 0, isPlaying: false }),

  nextStep: () => {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  goToStep: (index) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({ currentStepIndex: index, isPlaying: false });
    }
  },

  setSpeed: (speed) => set({ speed }),

  clearAnimation: () => set({ steps: [], currentStepIndex: 0, isPlaying: false }),
}));

// Speed presets
export const SPEED_PRESETS = {
  slow: 1000,
  normal: 500,
  fast: 200,
  veryFast: 50
} as const;

export type SpeedPreset = keyof typeof SPEED_PRESETS;
