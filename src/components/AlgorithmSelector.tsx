'use client';

import { AlgorithmType } from '@/types/algorithms';

interface AlgorithmSelectorProps {
  selected: AlgorithmType;
  onSelect: (algorithm: AlgorithmType) => void;
}

interface AlgorithmOption {
  id: AlgorithmType;
  name: string;
  shortName: string;
  description: string;
}

const algorithms: AlgorithmOption[] = [
  {
    id: 'needleman-wunsch',
    name: 'Needleman-Wunsch',
    shortName: 'N-W',
    description: 'Global alignment for complete sequences'
  },
  {
    id: 'smith-waterman',
    name: 'Smith-Waterman',
    shortName: 'S-W',
    description: 'Local alignment for conserved regions'
  },
  {
    id: 'bfs-mutation',
    name: 'BFS Mutation',
    shortName: 'BFS',
    description: 'Find shortest mutation paths'
  }
];

export default function AlgorithmSelector({ selected, onSelect }: AlgorithmSelectorProps) {
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {algorithms.map((algo) => {
          const isSelected = selected === algo.id;

          return (
            <button
              key={algo.id}
              onClick={() => onSelect(algo.id)}
              className={`
                flex-1 flex flex-col items-start gap-2
                px-5 py-4 md:px-6 md:py-5
                rounded-[15px] md:rounded-[20px]
                border transition-all duration-300
                ${isSelected
                  ? 'border-violet-400 bg-violet-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }
              `}
              style={{ borderWidth: '1px' }}
            >
              {/* Algorithm Name */}
              <div className="flex items-center gap-2 w-full">
                {/* Indicator Dot */}
                <div
                  className={`
                    w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300
                    ${isSelected ? 'bg-violet-500' : 'bg-gray-300'}
                  `}
                />
                <h3
                  className={`
                    text-[14px] md:text-[16px] lg:text-[18px] leading-[120%] transition-colors duration-300
                    ${isSelected ? 'text-violet-700' : 'text-black'}
                  `}
                  style={{
                    fontFamily: 'Inter Display, var(--font-inter), sans-serif',
                    fontWeight: 500
                  }}
                >
                  <span className="hidden sm:inline">{algo.name}</span>
                  <span className="sm:hidden">{algo.shortName}</span>
                </h3>
              </div>

              {/* Description */}
              <p
                className={`
                  text-[11px] md:text-[12px] lg:text-[13px] leading-[140%] text-left transition-colors duration-300
                  ${isSelected ? 'text-violet-600' : 'text-gray-500'}
                `}
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontWeight: 400
                }}
              >
                {algo.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Mobile selected indicator */}
      <div className="sm:hidden mt-4 text-center">
        <span
          className="text-[10px] text-gray-400"
          style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
        >
          Selected: {algorithms.find(a => a.id === selected)?.name}
        </span>
      </div>
    </div>
  );
}
