'use client';

import { useMemo } from 'react';
import { useAnimationStore, MatrixStepData } from '@/lib/stores/animationStore';

interface MatrixVisualizationProps {
  seq1: string;
  seq2: string;
  showLabels?: boolean;
}

const MAX_SIZE = 15; // Maximum sequence length for visualization

export default function MatrixVisualization({ seq1, seq2, showLabels = true }: MatrixVisualizationProps) {
  const { steps, currentStepIndex } = useAnimationStore();

  // Check if sequences are too large
  if (seq1.length > MAX_SIZE || seq2.length > MAX_SIZE) {
    return (
      <div
        className="p-6 rounded-[15px] text-center border border-[var(--container-divider)]"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)'
        }}
      >
        <p
          className="text-[13px] text-gray-500"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Matrix visualization is available for sequences up to {MAX_SIZE} characters.
        </p>
        <p
          className="text-[12px] text-gray-400 mt-2"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Current lengths: {seq1.length} x {seq2.length}
        </p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  if (!currentStep || currentStep.type !== 'matrix') {
    return (
      <div
        className="p-6 rounded-[15px] text-center border border-[var(--container-divider)]"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)'
        }}
      >
        <p
          className="text-[13px] text-gray-500"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          No matrix data to display. Run an alignment to see the visualization.
        </p>
      </div>
    );
  }

  const matrixData = currentStep.data as MatrixStepData;
  const { matrix, row, col, phase, tracebackPath } = matrixData;

  const tracebackSet = useMemo(
    () => new Set(tracebackPath?.map(([i, j]) => `${i},${j}`) || []),
    [tracebackPath]
  );

  // Calculate which cells have been filled
  const getCellState = (i: number, j: number): 'empty' | 'filled' | 'current' | 'traceback' => {
    if (phase === 'traceback' && tracebackSet.has(`${i},${j}`)) {
      return 'traceback';
    }
    if (i === row && j === col && phase === 'fill') {
      return 'current';
    }
    if (phase === 'init') {
      // During init, show first row and column
      if (i === 0 || j === 0) {
        if (i <= row || j <= col) return 'filled';
      }
      return 'empty';
    }
    // During fill phase
    if (phase === 'fill') {
      if (i < row || (i === row && j < col)) return 'filled';
      if (i === 0 || j === 0) return 'filled'; // Init row/col always filled
    }
    if (phase === 'traceback') {
      return 'filled';
    }
    return 'empty';
  };

  const getCellClasses = (state: 'empty' | 'filled' | 'current' | 'traceback'): string => {
    const baseClasses = 'text-black';
    switch (state) {
      case 'current':
        return `${baseClasses} border-b-2 border-b-[#2670E9] border-x border-t border-[var(--container-divider)] font-bold scale-110 shadow-md`;
      case 'traceback':
        return `${baseClasses} border-b-2 border-b-[#2670E9] border-x border-t border-[var(--container-divider)] font-bold`;
      case 'filled':
        return `${baseClasses} border border-[var(--container-divider)]`;
      case 'empty':
      default:
        return `${baseClasses} border border-[var(--container-divider)] text-gray-400`;
    }
  };

  const getCellStyle = (state: 'empty' | 'filled' | 'current' | 'traceback') => {
    switch (state) {
      case 'current':
      case 'traceback':
        return { background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.3) 0%, rgba(38, 112, 233, 0) 100%)' };
      case 'filled':
        return { background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)' };
      case 'empty':
      default:
        return { background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)' };
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-fit">
        {/* Column Headers (Sequence 2) */}
        {showLabels && (
          <div className="flex mb-1">
            <div className="w-10 h-8" /> {/* Empty corner */}
            <div className="w-10 h-8 flex items-center justify-center text-[11px] text-gray-400 font-mono">
              -
            </div>
            {seq2.split('').map((char, idx) => (
              <div
                key={idx}
                className="w-10 h-8 flex items-center justify-center text-[11px] font-mono text-black font-medium"
              >
                {char}
              </div>
            ))}
          </div>
        )}

        {/* Matrix Rows */}
        {matrix.map((rowData, i) => (
          <div key={i} className="flex">
            {/* Row Header (Sequence 1) */}
            {showLabels && (
              <div className="w-10 h-10 flex items-center justify-center text-[11px] font-mono text-black font-medium">
                {i === 0 ? '-' : seq1[i - 1]}
              </div>
            )}

            {/* Matrix Cells */}
            {rowData.map((cell, j) => {
              const state = getCellState(i, j);
              return (
                <div
                  key={j}
                  className={`
                    w-10 h-10 flex items-center justify-center
                    text-[12px] font-mono
                    transition-all duration-200
                    ${getCellClasses(state)}
                  `}
                  style={getCellStyle(state)}
                >
                  {state !== 'empty' ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-[10px] text-black" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded border-b-2 border-b-[#2670E9] border-x border-t border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.3) 0%, rgba(38, 112, 233, 0) 100%)' }}
          /> Current/Traceback
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded border border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)' }}
          /> Filled
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded border border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)' }}
          /> Pending
        </span>
      </div>
    </div>
  );
}
