'use client';

import { useState } from 'react';
import { AlignmentResult } from '@/types/algorithms';
import { generateMatchString } from '@/lib/algorithms/needleman-wunsch';

interface AlignmentDisplayProps {
  result: AlignmentResult;
  algorithmName: string;
}

export default function AlignmentDisplay({ result, algorithmName }: AlignmentDisplayProps) {
  const matchString = generateMatchString(result.alignedSeq1, result.alignedSeq2);

  // Split alignment into chunks for display (60 chars per line is standard)
  const chunkSize = 60;
  const chunks: { seq1: string; match: string; seq2: string; startPos: number }[] = [];

  for (let i = 0; i < result.alignedSeq1.length; i += chunkSize) {
    chunks.push({
      seq1: result.alignedSeq1.slice(i, i + chunkSize),
      match: matchString.slice(i, i + chunkSize),
      seq2: result.alignedSeq2.slice(i, i + chunkSize),
      startPos: i + 1
    });
  }

  return (
    <div className="w-full">
      {/* Statistics Card */}
      <div
        className="rounded-[15px] md:rounded-[20px] p-5 md:p-6 mb-6 bg-violet-50 border border-violet-200"
      >
        <h3
          className="text-[14px] md:text-[16px] text-violet-700 mb-4"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
        >
          {algorithmName} Results
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatBox label="Score" value={result.score.toString()} highlight />
          <StatBox label="Identity" value={`${result.identity.toFixed(1)}%`} />
          <StatBox label="Matches" value={result.matches.toString()} color="emerald" />
          <StatBox label="Mismatches" value={result.mismatches.toString()} color="red" />
          <StatBox label="Gaps" value={result.gaps.toString()} color="gray" />
          <StatBox label="Length" value={result.alignedSeq1.length.toString()} />
        </div>

        {/* Position info for local alignment */}
        {result.startPos && result.endPos && (
          <div className="mt-4 pt-4 border-t border-violet-200">
            <p
              className="text-[12px] text-gray-600"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              <span className="font-medium">Local alignment region:</span>{' '}
              Seq1 [{result.startPos.seq1 + 1}-{result.endPos.seq1 + 1}]{' '}
              Seq2 [{result.startPos.seq2 + 1}-{result.endPos.seq2 + 1}]
            </p>
          </div>
        )}
      </div>

      {/* Alignment Visualization */}
      <div
        className="rounded-[15px] md:rounded-[20px] p-5 md:p-6 bg-white border border-gray-200"
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-[14px] md:text-[16px] text-black"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
          >
            Sequence Alignment
          </h3>
          <div className="flex items-center gap-4 text-[10px] md:text-[11px]" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500" /> Match
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500" /> Mismatch
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-400" /> Gap
            </span>
          </div>
        </div>

        {/* Alignment blocks */}
        <div className="overflow-x-auto">
          <div className="min-w-fit">
            {chunks.map((chunk, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                {/* Position indicator */}
                <div
                  className="text-[10px] text-gray-400 mb-1 font-mono"
                  style={{ paddingLeft: '60px' }}
                >
                  {chunk.startPos}
                </div>

                {/* Sequence 1 */}
                <div className="flex items-center">
                  <span
                    className="w-[55px] text-[11px] md:text-[12px] text-gray-500 flex-shrink-0"
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                  >
                    Seq 1:
                  </span>
                  <div className="font-mono text-[12px] md:text-[13px] tracking-wide flex">
                    {chunk.seq1.split('').map((char, i) => (
                      <ColoredChar
                        key={i}
                        char={char}
                        otherChar={chunk.seq2[i]}
                        type="seq"
                      />
                    ))}
                  </div>
                </div>

                {/* Match string */}
                <div className="flex items-center">
                  <span className="w-[55px] flex-shrink-0" />
                  <div className="font-mono text-[12px] md:text-[13px] tracking-wide flex text-gray-400">
                    {chunk.match.split('').map((char, i) => (
                      <span key={i} className="w-[14px] text-center">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sequence 2 */}
                <div className="flex items-center">
                  <span
                    className="w-[55px] text-[11px] md:text-[12px] text-gray-500 flex-shrink-0"
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                  >
                    Seq 2:
                  </span>
                  <div className="font-mono text-[12px] md:text-[13px] tracking-wide flex">
                    {chunk.seq2.split('').map((char, i) => (
                      <ColoredChar
                        key={i}
                        char={char}
                        otherChar={chunk.seq1[i]}
                        type="seq"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matrix Preview (collapsed by default) */}
      <MatrixPreview matrix={result.matrix} traceback={result.traceback} />
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight = false,
  color
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: 'emerald' | 'red' | 'gray';
}) {
  let valueColor = 'text-black';
  if (color === 'emerald') valueColor = 'text-emerald-600';
  if (color === 'red') valueColor = 'text-red-600';
  if (color === 'gray') valueColor = 'text-gray-500';

  return (
    <div
      className={`
        rounded-[10px] p-3 text-center
        ${highlight ? 'bg-violet-600 text-white' : 'bg-white'}
      `}
    >
      <div
        className={`text-[18px] md:text-[22px] ${highlight ? 'text-white' : valueColor}`}
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
      >
        {value}
      </div>
      <div
        className={`text-[10px] md:text-[11px] ${highlight ? 'text-white/80' : 'text-gray-500'}`}
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {label}
      </div>
    </div>
  );
}

function ColoredChar({
  char,
  otherChar,
  type
}: {
  char: string;
  otherChar: string;
  type: 'seq' | 'match';
}) {
  let bgColor = '';
  let textColor = 'text-black';

  if (char === '-' || otherChar === '-') {
    bgColor = 'bg-gray-200';
    textColor = 'text-gray-600';
  } else if (char === otherChar) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
  } else {
    bgColor = 'bg-red-100';
    textColor = 'text-red-700';
  }

  return (
    <span
      className={`w-[14px] text-center rounded-sm ${bgColor} ${textColor}`}
    >
      {char}
    </span>
  );
}

function MatrixPreview({
  matrix,
  traceback
}: {
  matrix: number[][];
  traceback: [number, number][];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show matrix for small sequences
  const isSmall = matrix.length <= 20 && matrix[0]?.length <= 20;
  if (!isSmall) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-[12px] text-center">
        <p
          className="text-[12px] text-gray-500"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          Matrix visualization available for sequences up to 20 characters.
          Current matrix size: {matrix.length - 1} x {matrix[0]?.length - 1 || 0}
        </p>
      </div>
    );
  }

  // Create a set of traceback cells for highlighting
  const tracebackSet = new Set(traceback.map(([i, j]) => `${i},${j}`));

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-[13px] text-gray-600 hover:text-black transition-colors"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
      >
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {isExpanded ? 'Hide' : 'Show'} Scoring Matrix
      </button>

      {isExpanded && (
        <div className="mt-4 overflow-x-auto">
          <table className="text-[11px] font-mono border-collapse">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => {
                    const isTraceback = tracebackSet.has(`${i},${j}`);
                    return (
                      <td
                        key={j}
                        className={`
                          w-8 h-8 text-center border border-gray-200
                          ${isTraceback ? 'bg-violet-500 text-white font-bold' : 'bg-white'}
                        `}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

