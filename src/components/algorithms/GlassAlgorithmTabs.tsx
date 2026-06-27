'use client';

import { memo } from 'react';
import { AlgorithmType } from '@/types/algorithms';

interface GlassAlgorithmTabsProps {
  algorithms: { id: AlgorithmType; name: string }[];
  selected: AlgorithmType;
  onSelect: (algorithm: AlgorithmType) => void;
}

export default memo(function GlassAlgorithmTabs({
  algorithms,
  selected,
  onSelect
}: GlassAlgorithmTabsProps) {
  return (
    <div
      className="flex w-full flex-wrap gap-1 p-1.5 rounded-[var(--container-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg sm:inline-flex sm:w-auto"
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
        boxShadow: 'var(--button-shadow, inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.05))',
      }}
    >
      {algorithms.map((algo) => (
        <button
          key={algo.id}
          onClick={() => onSelect(algo.id)}
          className={`
            flex-1 min-w-[140px] sm:min-w-0 sm:flex-none px-4 md:px-6 py-3 md:py-3.5
            rounded-[var(--button-corner-radius)]
            text-center font-inter font-semibold text-[12px] md:text-[14px] leading-[1.35] sm:leading-5
            whitespace-normal sm:whitespace-nowrap
            transition-all duration-200 active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.12)]
            ${selected === algo.id
              ? 'text-[#000000] border-b-2 border-b-[#2670E9]'
              : 'text-[var(--foreground-secondary)] border-b-2 border-b-transparent hover:text-[#000000]'
            }
          `}
          style={
            selected === algo.id
              ? {
                  background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.3) 0%, rgba(38, 112, 233, 0) 100%)',
                }
              : undefined
          }
        >
          {algo.name}
        </button>
      ))}
    </div>
  );
})
