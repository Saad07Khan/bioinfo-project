'use client';

import { generateMatchString } from '@/lib/algorithms/needleman-wunsch';
import type { AlignmentResult } from '@/types/algorithms';

type GlassAlignmentDisplayProps = {
  result: AlignmentResult;
  algorithmName: string;
};

export default function GlassAlignmentDisplay({
  result,
  algorithmName
}: GlassAlignmentDisplayProps) {
  const matchString = generateMatchString(result.alignedSeq1, result.alignedSeq2);
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
        <h3 className="text-[14px] md:text-[16px] text-black mb-4 font-semibold">
          {algorithmName} Results
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <GlassStatBox label="Score" value={result.score.toString()} highlight />
          <GlassStatBox label="Identity" value={`${result.identity.toFixed(1)}%`} />
          <GlassStatBox label="Matches" value={result.matches.toString()} />
          <GlassStatBox label="Mismatches" value={result.mismatches.toString()} />
          <GlassStatBox label="Gaps" value={result.gaps.toString()} />
          <GlassStatBox label="Length" value={result.alignedSeq1.length.toString()} />
        </div>

        {result.startPos && result.endPos && (
          <div className="mt-4 pt-4 border-t border-[var(--container-divider)]">
            <p className="text-[12px] text-gray-600">
              <span className="font-medium">Local alignment region:</span>{' '}
              Seq1 [{result.startPos.seq1 + 1}-{result.endPos.seq1 + 1}]{' '}
              Seq2 [{result.startPos.seq2 + 1}-{result.endPos.seq2 + 1}]
            </p>
          </div>
        )}
      </div>

      <div
        className="rounded-[var(--container-corner-radius)] p-5 md:p-6 border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
        style={glassContainerStyle}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-[14px] md:text-[16px] text-black font-semibold">
            Sequence Alignment
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: 'rgba(38, 112, 233, 0.3)' }} /> Match
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: 'rgba(0, 0, 0, 0.15)' }} /> Mismatch
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded" style={{ background: 'rgba(0, 0, 0, 0.05)' }} /> Gap
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-fit">
            {chunks.map((chunk, idx) => (
              <div key={idx} className="mb-4 last:mb-0">
                <div className="text-[10px] text-gray-400 mb-1 font-mono" style={{ paddingLeft: '60px' }}>
                  {chunk.startPos}
                </div>

                <div className="flex items-center">
                  <span className="w-[55px] text-[11px] md:text-[12px] text-gray-500 flex-shrink-0 font-medium">
                    Seq 1:
                  </span>
                  <div className="font-mono text-[12px] md:text-[13px] tracking-wide flex">
                    {chunk.seq1.split('').map((char, i) => (
                      <GlassColoredChar key={i} char={char} otherChar={chunk.seq2[i]} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-[55px] flex-shrink-0" />
                  <div className="font-mono text-[12px] md:text-[13px] tracking-wide flex text-gray-400">
                    {chunk.match.split('').map((char, i) => (
                      <span key={i} className="w-[14px] text-center">{char}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-[55px] text-[11px] md:text-[12px] text-gray-500 flex-shrink-0 font-medium">
                    Seq 2:
                  </span>
                  <div className="font-mono text-[12px] md:text-[13px] tracking-wide flex">
                    {chunk.seq2.split('').map((char, i) => (
                      <GlassColoredChar key={i} char={char} otherChar={chunk.seq1[i]} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

function GlassColoredChar({ char, otherChar }: { char: string; otherChar: string }) {
  let bgColor = '';
  let textColor = 'text-black';

  if (char === '-' || otherChar === '-') {
    bgColor = 'rgba(0, 0, 0, 0.05)';
    textColor = 'text-gray-500';
  } else if (char === otherChar) {
    bgColor = 'rgba(38, 112, 233, 0.2)';
    textColor = 'text-black';
  } else {
    bgColor = 'rgba(0, 0, 0, 0.1)';
    textColor = 'text-gray-600';
  }

  return (
    <span className={`w-[14px] text-center rounded-sm ${textColor}`} style={{ background: bgColor }}>
      {char}
    </span>
  );
}
