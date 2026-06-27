'use client';

import { getGeneDifference } from '@/lib/algorithms/bfs-mutation';
import type { MutationResultSerializable } from '@/types/algorithms';

type GlassMutationDisplayProps = {
  result: MutationResultSerializable;
};

export default function GlassMutationDisplay({ result }: GlassMutationDisplayProps) {
  const glassContainerStyle = {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
    boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02)',
  };

  return (
    <div className="w-full space-y-6">
      <div
        className="rounded-[var(--container-corner-radius)] p-5 md:p-6 border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
        style={glassContainerStyle}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border border-black/30 backdrop-blur-[10px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
              boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02)',
            }}
          >
            {result.success ? (
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-[16px] md:text-[18px] font-semibold text-black">
              {result.success ? 'Path Found!' : 'No Path Exists'}
            </h3>
            <p className="text-[12px] md:text-[13px] text-gray-500">
              {result.success
                ? `Minimum ${result.minMutations} mutation${result.minMutations !== 1 ? 's' : ''} required`
                : 'The target gene cannot be reached from the start gene using the provided bank'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <GlassStatBox
            label="Mutations"
            value={result.minMutations === -1 ? '\u221E' : result.minMutations.toString()}
          />
          <GlassStatBox label="Genes Explored" value={result.explored.length.toString()} />
          <GlassStatBox label="Path Length" value={result.path.length.toString()} />
          <GlassStatBox label="Bank Size" value={Object.keys(result.adjacencyList).length.toString()} />
        </div>
      </div>

      {result.success && result.path.length > 0 && (
        <div
          className="rounded-[var(--container-corner-radius)] p-5 md:p-6 border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
          style={glassContainerStyle}
        >
          <h3 className="text-[14px] md:text-[16px] text-black mb-4 font-semibold">
            Mutation Path
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {result.path.map((gene, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === result.path.length - 1;
              const prevGene = idx > 0 ? result.path[idx - 1] : null;
              const diff = prevGene ? getGeneDifference(prevGene, gene) : null;

              return (
                <div key={`path-${idx}-${gene}`} className="flex items-center gap-2">
                  {idx > 0 && (
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      {diff && (
                        <span className="text-[9px] text-gray-500">
                          pos {diff.position + 1}: {diff.from}{'\u2192'}{diff.to}
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    className={`
                      px-3 py-2 rounded-[var(--button-corner-radius)] font-mono text-[12px] md:text-[13px] tracking-wider
                      border backdrop-blur-[10px]
                      ${isStart || isEnd ? 'border-b-2 border-b-[#2670E9] border-x border-t border-[var(--container-divider)]' : 'border-[var(--container-divider)]'}
                    `}
                    style={{
                      background: isStart || isEnd
                        ? 'linear-gradient(0deg, rgba(38, 112, 233, 0.3) 0%, rgba(38, 112, 233, 0) 100%)'
                        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
                      boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.05)',
                      color: '#000'
                    }}
                  >
                    <GlassGeneWithHighlight gene={gene} prevGene={prevGene} />
                    <div className="text-[9px] text-center mt-1 text-gray-500">
                      {isStart ? 'START' : isEnd ? 'END' : `Step ${idx}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        className="rounded-[var(--container-corner-radius)] p-5 md:p-6 border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
        style={glassContainerStyle}
      >
        <h3 className="text-[14px] md:text-[16px] text-black mb-4 font-semibold">
          BFS Exploration Order
        </h3>

        <div className="flex flex-wrap gap-2">
          {result.explored.map((gene, idx) => {
            const isInPath = result.path.includes(gene);
            const isStart = gene === result.path[0];
            const isEnd = gene === result.path[result.path.length - 1];

            return (
              <div
                key={`explored-${idx}-${gene}`}
                className={`
                  px-2.5 py-1.5 rounded-[var(--button-corner-radius)] font-mono text-[11px] tracking-wide
                  border backdrop-blur-[10px]
                  ${isStart || isEnd ? 'border-b-2 border-b-[#2670E9] border-x border-t border-[var(--container-divider)]' : isInPath ? 'border-b border-b-[#2670E9]/50 border-x border-t border-[var(--container-divider)]' : 'border-[var(--container-divider)]'}
                `}
                style={{
                  background: isStart || isEnd
                    ? 'linear-gradient(0deg, rgba(38, 112, 233, 0.3) 0%, rgba(38, 112, 233, 0) 100%)'
                    : isInPath
                      ? 'linear-gradient(0deg, rgba(38, 112, 233, 0.15) 0%, rgba(38, 112, 233, 0) 100%)'
                      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
                  color: '#000'
                }}
              >
                <span className="text-[9px] text-gray-400 mr-1">{idx + 1}.</span>
                {gene}
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-gray-500 mt-4">
          Genes are explored in BFS order (level by level).
          <span className="text-black font-medium ml-1">Highlighted</span> = start/end,
          <span className="text-black ml-1">Gradient</span> = in optimal path.
        </p>
      </div>
    </div>
  );
}

function GlassStatBox({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`
        rounded-[var(--button-corner-radius)] p-3 text-center backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg
        ${highlight ? 'border-b-2 border-b-[#2670E9] border-x border-t border-[var(--container-divider)]' : 'border border-[var(--container-divider)]'}
      `}
      style={{
        background: highlight
          ? 'linear-gradient(0deg, rgba(38, 112, 233, 0.3) 0%, rgba(38, 112, 233, 0) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
      }}
    >
      <div className="text-[18px] md:text-[22px] font-semibold text-black">
        {value}
      </div>
      <div className="text-[10px] md:text-[11px] text-gray-500">
        {label}
      </div>
    </div>
  );
}

function GlassGeneWithHighlight({ gene, prevGene }: { gene: string; prevGene: string | null }) {
  if (!prevGene) {
    return <span className="text-black">{gene}</span>;
  }

  return (
    <span className="text-black">
      {gene.split('').map((char, idx) => {
        const changed = prevGene[idx] !== char;
        return (
          <span
            key={idx}
            className={changed ? 'rounded px-0.5' : ''}
            style={changed ? { background: 'rgba(38, 112, 233, 0.3)' } : undefined}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
