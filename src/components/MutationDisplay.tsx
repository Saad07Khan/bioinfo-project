'use client';

import { MutationResultSerializable } from '@/types/algorithms';
import { getGeneDifference } from '@/lib/algorithms/bfs-mutation';

interface MutationDisplayProps {
  result: MutationResultSerializable;
}

export default function MutationDisplay({ result }: MutationDisplayProps) {
  return (
    <div className="w-full">
      {/* Result Status Card */}
      <div
        className={`
          rounded-[15px] md:rounded-[20px] p-5 md:p-6 mb-6
          ${result.success
            ? 'bg-emerald-50 border border-emerald-200'
            : 'bg-red-50 border border-red-200'
          }
        `}
      >
        <div className="flex items-center gap-3 mb-4">
          {result.success ? (
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <div>
            <h3
              className={`text-[16px] md:text-[18px] ${result.success ? 'text-emerald-700' : 'text-red-700'}`}
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
            >
              {result.success ? 'Path Found!' : 'No Path Exists'}
            </h3>
            <p
              className={`text-[12px] md:text-[13px] ${result.success ? 'text-emerald-600' : 'text-red-600'}`}
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {result.success
                ? `Minimum ${result.minMutations} mutation${result.minMutations !== 1 ? 's' : ''} required`
                : 'The target gene cannot be reached from the start gene using the provided bank'
              }
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox
            label="Mutations"
            value={result.minMutations === -1 ? '∞' : result.minMutations.toString()}
            color={result.success ? 'emerald' : 'red'}
          />
          <StatBox
            label="Genes Explored"
            value={result.explored.length.toString()}
            color="violet"
          />
          <StatBox
            label="Path Length"
            value={result.path.length.toString()}
            color="indigo"
          />
          <StatBox
            label="Bank Size"
            value={Object.keys(result.adjacencyList).length.toString()}
            color="slate"
          />
        </div>
      </div>

      {/* Mutation Path */}
      {result.success && result.path.length > 0 && (
        <div className="rounded-[15px] md:rounded-[20px] p-5 md:p-6 bg-white border border-gray-200 mb-6">
          <h3
            className="text-[14px] md:text-[16px] text-black mb-4"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
          >
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
                  {/* Arrow between genes */}
                  {idx > 0 && (
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      {diff && (
                        <span
                          className="text-[9px] text-gray-500"
                          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          pos {diff.position + 1}: {diff.from}→{diff.to}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Gene box */}
                  <div
                    className={`
                      px-3 py-2 rounded-[10px] font-mono text-[12px] md:text-[13px] tracking-wider
                      ${isStart
                        ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700'
                        : isEnd
                          ? 'bg-violet-100 border-2 border-violet-400 text-violet-700'
                          : 'bg-gray-100 border border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    <GeneWithHighlight
                      gene={gene}
                      prevGene={prevGene}
                    />
                    <div
                      className={`text-[9px] text-center mt-1 ${
                        isStart ? 'text-emerald-600' : isEnd ? 'text-violet-600' : 'text-gray-500'
                      }`}
                      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                    >
                      {isStart ? 'START' : isEnd ? 'END' : `Step ${idx}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exploration Order */}
      <div className="rounded-[15px] md:rounded-[20px] p-5 md:p-6 bg-white border border-gray-200">
        <h3
          className="text-[14px] md:text-[16px] text-black mb-4"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
        >
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
                  px-2.5 py-1.5 rounded-[8px] font-mono text-[11px] tracking-wide
                  ${isStart
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : isEnd
                      ? 'bg-violet-100 text-violet-700 border border-violet-300'
                      : isInPath
                        ? 'bg-violet-50 text-violet-600 border border-violet-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }
                `}
              >
                <span className="text-[9px] text-gray-400 mr-1">{idx + 1}.</span>
                {gene}
              </div>
            );
          })}
        </div>

        <p
          className="text-[11px] text-gray-500 mt-4"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Genes are explored in BFS order (level by level).
          <span className="text-emerald-600 ml-1">Green</span> = start,
          <span className="text-violet-600 ml-1">Violet</span> = end,
          <span className="text-violet-500 ml-1">Highlighted</span> = in optimal path.
        </p>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color
}: {
  label: string;
  value: string;
  color: 'emerald' | 'red' | 'violet' | 'indigo' | 'slate';
}) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    violet: 'bg-violet-100 text-violet-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    slate: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className={`rounded-[10px] p-3 text-center ${colorClasses[color]}`}>
      <div
        className="text-[18px] md:text-[20px]"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
      >
        {value}
      </div>
      <div
        className="text-[10px] md:text-[11px] opacity-80"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label}
      </div>
    </div>
  );
}

function GeneWithHighlight({
  gene,
  prevGene
}: {
  gene: string;
  prevGene: string | null;
}) {
  if (!prevGene) {
    return <span>{gene}</span>;
  }

  return (
    <span>
      {gene.split('').map((char, idx) => {
        const changed = prevGene[idx] !== char;
        return (
          <span
            key={idx}
            className={changed ? 'bg-yellow-300 rounded px-0.5' : ''}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
