'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import GlassActionButton from '@/components/algorithms/GlassActionButton';
import GlassAlignmentDisplay from '@/components/algorithms/GlassAlignmentDisplay';
import GlassMutationDisplay from '@/components/algorithms/GlassMutationDisplay';
import { useAnimationStore } from '@/lib/stores/animationStore';
import type { AlgorithmType, AlignmentResult, MutationResultSerializable } from '@/types/algorithms';

const LazyGlassAnimationControls = dynamic(
  () => import('@/components/algorithms/GlassAnimationControls'),
  { loading: () => null }
);
const LazyMatrixVisualization = dynamic(
  () => import('@/components/MatrixVisualization'),
  { loading: () => null }
);
const LazyGraphVisualization = dynamic(
  () => import('@/components/GraphVisualization'),
  { loading: () => null }
);

type AlgorithmsResultsPanelProps = {
  selectedAlgorithm: AlgorithmType;
  algorithmName: string;
  alignmentResult: AlignmentResult | null;
  mutationResult: MutationResultSerializable | null;
  currentSeq1: string;
  currentSeq2: string;
  currentStartGene: string;
  currentEndGene: string;
  currentBank: string[];
  showAnimation: boolean;
  onToggleAnimation: () => void;
  onClearResults: () => void;
};

export default memo(function AlgorithmsResultsPanel({
  selectedAlgorithm,
  algorithmName,
  alignmentResult,
  mutationResult,
  currentSeq1,
  currentSeq2,
  currentStartGene,
  currentEndGene,
  currentBank,
  showAnimation,
  onToggleAnimation,
  onClearResults
}: AlgorithmsResultsPanelProps) {
  const stepsLength = useAnimationStore((state) => state.steps.length);

  return (
    <motion.div
      className="relative mt-6 overflow-visible"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute -top-10 -bottom-10 -left-10 -right-10"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(135, 206, 250, 0.5) 0%, rgba(135, 206, 250, 0.3) 40%, rgba(135, 206, 250, 0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <div
        className="relative z-10 rounded-[var(--container-corner-radius)] p-6 md:p-8 lg:p-10 border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
          boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.05)',
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2
            className="text-[16px] md:text-[18px] lg:text-[20px] text-black"
            style={{
              fontFamily: 'Inter Display, var(--font-inter), sans-serif',
              fontWeight: 500
            }}
          >
            Results
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            {stepsLength > 0 && (
              <GlassActionButton
                label={showAnimation ? 'Hide Animation' : 'Show Animation'}
                primary={showAnimation}
                onClick={onToggleAnimation}
              />
            )}
            <GlassActionButton
              label="Clear Results"
              onClick={onClearResults}
            />
          </div>
        </div>

        {stepsLength > 0 && showAnimation && (
          <div className="mb-8">
            <div
              className="rounded-[var(--container-corner-radius)] p-6 md:p-8 border border-[var(--container-divider)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 100%)',
              }}
            >
              <h3
                className="text-[14px] md:text-[16px] text-black mb-4"
                style={{
                  fontFamily: 'Inter Display, var(--font-inter), sans-serif',
                  fontWeight: 500
                }}
              >
                Step-by-Step Visualization
              </h3>

              <div className="mb-6">
                <LazyGlassAnimationControls />
              </div>

              {(selectedAlgorithm === 'needleman-wunsch' || selectedAlgorithm === 'smith-waterman') && currentSeq1 && currentSeq2 && (
                <div
                  className="mt-6 p-4 rounded-[var(--container-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
                    boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02)'
                  }}
                >
                  <h4
                    className="text-[13px] text-black mb-4"
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                  >
                    Dynamic Programming Matrix
                  </h4>
                  <LazyMatrixVisualization seq1={currentSeq1} seq2={currentSeq2} />
                </div>
              )}

              {selectedAlgorithm === 'bfs-mutation' && currentStartGene && currentEndGene && (
                <div
                  className="mt-6 p-4 rounded-[var(--container-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
                    boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02)'
                  }}
                >
                  <h4
                    className="text-[13px] text-black mb-4"
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                  >
                    BFS Graph Exploration
                  </h4>
                  <LazyGraphVisualization
                    startGene={currentStartGene}
                    endGene={currentEndGene}
                    bank={currentBank}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {alignmentResult && (
          <GlassAlignmentDisplay
            result={alignmentResult}
            algorithmName={algorithmName}
          />
        )}

        {mutationResult && (
          <GlassMutationDisplay result={mutationResult} />
        )}
      </div>
    </motion.div>
  );
})
