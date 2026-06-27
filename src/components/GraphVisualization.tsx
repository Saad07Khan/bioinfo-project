'use client';

import { useMemo } from 'react';
import { useAnimationStore, BFSStepData } from '@/lib/stores/animationStore';

interface GraphVisualizationProps {
  startGene: string;
  endGene: string;
  bank: string[];
}

export default function GraphVisualization({ startGene, endGene, bank }: GraphVisualizationProps) {
  const { steps, currentStepIndex } = useAnimationStore();

  const currentStep = steps[currentStepIndex];
  if (!currentStep || currentStep.type !== 'bfs') {
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
          No BFS data to display. Run a mutation search to see the visualization.
        </p>
      </div>
    );
  }

  const bfsData = currentStep.data as BFSStepData;
  const { currentGene, queue, visited, path, phase, neighbors, currentNeighbor } = bfsData;

  const visitedArray = useMemo(
    () => visited instanceof Set ? Array.from(visited) : Array.from(visited || []),
    [visited]
  );

  const getGeneState = (gene: string): 'start' | 'end' | 'current' | 'visited' | 'queue' | 'neighbor' | 'path' | 'default' => {
    if (gene === startGene && phase === 'init') return 'start';
    if (gene === endGene && (phase === 'found' || path.includes(gene))) return 'end';
    if (gene === currentGene && phase === 'explore') return 'current';
    if (gene === currentNeighbor) return 'neighbor';
    if (path.includes(gene)) return 'path';
    if (visitedArray.includes(gene)) return 'visited';
    if (queue.includes(gene)) return 'queue';
    if (gene === startGene) return 'start';
    if (gene === endGene) return 'end';
    return 'default';
  };

  const getGeneClasses = (state: ReturnType<typeof getGeneState>): string => {
    const baseClasses = 'text-black';
    switch (state) {
      case 'start':
        return `${baseClasses} border-b-2 border-b-[#1B5E20] border-x border-t border-[var(--container-divider)]`;
      case 'end':
        return `${baseClasses} border-b-2 border-b-[#880E4F] border-x border-t border-[var(--container-divider)]`;
      case 'current':
        return `${baseClasses} border-b-2 border-b-[#E65100] border-x border-t border-[var(--container-divider)] scale-110 shadow-lg`;
      case 'path':
        return `${baseClasses} border-b-2 border-b-[#4A148C] border-x border-t border-[var(--container-divider)]`;
      case 'neighbor':
        return `${baseClasses} border-b border-b-[#FF8F00] border-x border-t border-[var(--container-divider)]`;
      case 'queue':
        return `${baseClasses} border-b border-b-[#004D40] border-x border-t border-[var(--container-divider)]`;
      case 'visited':
        return `${baseClasses} border border-[var(--container-divider)] text-gray-500`;
      default:
        return `${baseClasses} border border-[var(--container-divider)] text-gray-500`;
    }
  };

  const getGeneStyle = (state: ReturnType<typeof getGeneState>) => {
    switch (state) {
      case 'start':
        return { background: 'linear-gradient(0deg, rgba(27, 94, 32, 0.3) 0%, rgba(27, 94, 32, 0) 100%)' };
      case 'end':
        return { background: 'linear-gradient(0deg, rgba(136, 14, 79, 0.3) 0%, rgba(136, 14, 79, 0) 100%)' };
      case 'current':
        return { background: 'linear-gradient(0deg, rgba(230, 81, 0, 0.35) 0%, rgba(230, 81, 0, 0) 100%)' };
      case 'path':
        return { background: 'linear-gradient(0deg, rgba(74, 20, 140, 0.25) 0%, rgba(74, 20, 140, 0) 100%)' };
      case 'neighbor':
        return { background: 'linear-gradient(0deg, rgba(255, 143, 0, 0.25) 0%, rgba(255, 143, 0, 0) 100%)' };
      case 'queue':
        return { background: 'linear-gradient(0deg, rgba(0, 77, 64, 0.2) 0%, rgba(0, 77, 64, 0) 100%)' };
      case 'visited':
        return { background: 'linear-gradient(180deg, rgba(66, 66, 66, 0.15) 0%, rgba(66, 66, 66, 0.05) 100%)' };
      default:
        return { background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)' };
    }
  };

  // All genes to display (start + bank)
  const allGenes = [startGene, ...bank.filter(g => g !== startGene)];

  return (
    <div className="w-full">
      {/* Status Info */}
      <div
        className="mb-4 p-3 rounded-[10px] border border-[var(--container-divider)] backdrop-blur-[10px]"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)'
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <span className="text-[10px] text-gray-500 block" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Phase
            </span>
            <span
              className="text-[12px] font-medium text-black"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {phase.charAt(0).toUpperCase() + phase.slice(1).replace('_', ' ')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Queue Size
            </span>
            <span
              className="text-[12px] font-medium text-black"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {queue.length}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Visited
            </span>
            <span
              className="text-[12px] font-medium text-gray-600"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {visitedArray.length}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Current Path
            </span>
            <span
              className="text-[12px] font-medium text-black"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {path.length > 0 ? path.length : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Gene Nodes Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {allGenes.map((gene, idx) => {
          const state = getGeneState(gene);
          return (
            <div
              key={`gene-${idx}-${gene}`}
              className={`
                p-3 rounded-[10px] text-center
                transition-all duration-300
                ${getGeneClasses(state)}
              `}
              style={getGeneStyle(state)}
            >
              <span
                className="text-[11px] md:text-[12px] font-mono tracking-wider block"
              >
                {gene}
              </span>
              {/* State Label */}
              <span
                className="text-[8px] uppercase tracking-wide mt-1 block text-gray-500"
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {state === 'start' ? 'START' :
                 state === 'end' ? 'END' :
                 state === 'current' ? 'CURRENT' :
                 state === 'neighbor' ? 'CHECKING' :
                 state === 'path' ? 'PATH' :
                 state === 'visited' ? 'VISITED' :
                 state === 'queue' ? 'QUEUED' : ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Queue Display */}
      {queue.length > 0 && (
        <div
          className="mt-4 p-3 rounded-[10px] border-b border-b-[#2670E9]/30 border-x border-t border-[var(--container-divider)] backdrop-blur-[10px]"
          style={{
            background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.1) 0%, rgba(38, 112, 233, 0) 100%)'
          }}
        >
          <span
            className="text-[10px] text-black block mb-2"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
          >
            Queue (FIFO):
          </span>
          <div className="flex flex-wrap gap-2">
            {queue.map((gene, idx) => (
              <span
                key={`${gene}-${idx}`}
                className="px-2 py-1 rounded text-[10px] font-mono text-black border border-[var(--container-divider)]"
                style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)' }}
              >
                {gene}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Current Path Display */}
      {path.length > 0 && (
        <div
          className="mt-4 p-3 rounded-[10px] border-b border-b-[#2670E9]/50 border-x border-t border-[var(--container-divider)] backdrop-blur-[10px]"
          style={{
            background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.15) 0%, rgba(38, 112, 233, 0) 100%)'
          }}
        >
          <span
            className="text-[10px] text-black block mb-2"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
          >
            Current Path:
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {path.map((gene, idx) => (
              <span key={`path-${gene}-${idx}`} className="flex items-center">
                <span
                  className="px-2 py-1 rounded text-[10px] font-mono text-black border-b border-b-[#2670E9]/50 border-x border-t border-[var(--container-divider)]"
                  style={{ background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.2) 0%, rgba(38, 112, 233, 0) 100%)' }}
                >
                  {gene}
                </span>
                {idx < path.length - 1 && (
                  <svg className="w-4 h-4 text-gray-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Neighbors Being Checked */}
      {neighbors && neighbors.length > 0 && (
        <div
          className="mt-4 p-3 rounded-[10px] border border-[var(--container-divider)] backdrop-blur-[10px]"
          style={{
            background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.08) 0%, rgba(38, 112, 233, 0) 100%)'
          }}
        >
          <span
            className="text-[10px] text-black block mb-2"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
          >
            Checking Neighbors:
          </span>
          <div className="flex flex-wrap gap-2">
            {neighbors.map((gene, idx) => (
              <span
                key={`neighbor-${gene}-${idx}`}
                className={`
                  px-2 py-1 rounded text-[10px] font-mono text-black
                  ${gene === currentNeighbor
                    ? 'border-b border-b-[#2670E9]/30 border-x border-t border-[var(--container-divider)]'
                    : 'border border-[var(--container-divider)]'
                  }
                `}
                style={{
                  background: gene === currentNeighbor
                    ? 'linear-gradient(0deg, rgba(38, 112, 233, 0.15) 0%, rgba(38, 112, 233, 0) 100%)'
                    : 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)'
                }}
              >
                {gene}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] text-black" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border-b-2 border-b-[#1B5E20] border-x border-t border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(0deg, rgba(27, 94, 32, 0.3) 0%, rgba(27, 94, 32, 0) 100%)' }}
          /> Start
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border-b-2 border-b-[#880E4F] border-x border-t border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(0deg, rgba(136, 14, 79, 0.3) 0%, rgba(136, 14, 79, 0) 100%)' }}
          /> End
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border-b-2 border-b-[#E65100] border-x border-t border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(0deg, rgba(230, 81, 0, 0.35) 0%, rgba(230, 81, 0, 0) 100%)' }}
          /> Current
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border-b-2 border-b-[#4A148C] border-x border-t border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(0deg, rgba(74, 20, 140, 0.25) 0%, rgba(74, 20, 140, 0) 100%)' }}
          /> Path
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border-b border-b-[#004D40] border-x border-t border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(0deg, rgba(0, 77, 64, 0.2) 0%, rgba(0, 77, 64, 0) 100%)' }}
          /> Queued
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded border border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(180deg, rgba(66, 66, 66, 0.15) 0%, rgba(66, 66, 66, 0.05) 100%)' }}
          /> Visited
        </span>
      </div>
    </div>
  );
}
