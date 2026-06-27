'use client';

import { useEffect, useRef, useState } from 'react';

import GlassActionButton from '@/components/algorithms/GlassActionButton';
import { alignmentExamples, type AlignmentExample } from '@/data/alignment-examples';
import { LARGE_SEQUENCE_WARNING, type ScoringScheme } from '@/types/algorithms';
import { cleanSequence, getSequenceStats, validateDNASequence } from '@/lib/utils/sequence-validation';

type AlignmentAlgorithm = 'needleman-wunsch' | 'smith-waterman';

type GlassSequenceInputProps = {
  algorithm: AlignmentAlgorithm;
  onAlign: (seq1: string, seq2: string, scoring: ScoringScheme) => void;
  isLoading?: boolean;
};

function getDefaultScoring(algorithm: AlignmentAlgorithm): ScoringScheme {
  return {
    match: algorithm === 'needleman-wunsch' ? 1 : 2,
    mismatch: -1,
    gap: algorithm === 'needleman-wunsch' ? -2 : -1
  };
}

export default function GlassSequenceInput({
  algorithm,
  onAlign,
  isLoading = false
}: GlassSequenceInputProps) {
  const [seq1, setSeq1] = useState('');
  const [seq2, setSeq2] = useState('');
  const [scoringByAlgorithm, setScoringByAlgorithm] = useState<Record<AlignmentAlgorithm, ScoringScheme>>(() => ({
    'needleman-wunsch': getDefaultScoring('needleman-wunsch'),
    'smith-waterman': getDefaultScoring('smith-waterman')
  }));
  const [seq1Error, setSeq1Error] = useState<string | null>(null);
  const [seq2Error, setSeq2Error] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const seq1DebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const seq2DebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scoring = scoringByAlgorithm[algorithm];

  useEffect(() => {
    return () => {
      clearTimeout(seq1DebounceRef.current);
      clearTimeout(seq2DebounceRef.current);
    };
  }, []);

  const updateScoring = (field: keyof ScoringScheme, value: string) => {
    const parsedValue = parseInt(value) || 0;
    setScoringByAlgorithm(current => ({
      ...current,
      [algorithm]: {
        ...current[algorithm],
        [field]: parsedValue
      }
    }));
  };

  const validateSeq1 = (value: string) => {
    if (value) {
      const result = validateDNASequence(value);
      setSeq1Error(result.isValid ? null : result.error || 'Invalid sequence');
      return;
    }

    setSeq1Error(null);
  };

  const validateSeq2 = (value: string) => {
    if (value) {
      const result = validateDNASequence(value);
      setSeq2Error(result.isValid ? null : result.error || 'Invalid sequence');
      return;
    }

    setSeq2Error(null);
  };

  const handleSubmit = () => {
    const cleaned1 = cleanSequence(seq1);
    const cleaned2 = cleanSequence(seq2);
    const validation1 = validateDNASequence(cleaned1);
    const validation2 = validateDNASequence(cleaned2);

    if (!validation1.isValid) {
      setSeq1Error(validation1.error || 'Invalid sequence');
      return;
    }

    if (!validation2.isValid) {
      setSeq2Error(validation2.error || 'Invalid sequence');
      return;
    }

    onAlign(cleaned1, cleaned2, scoring);
  };

  const handleClear = () => {
    setSeq1('');
    setSeq2('');
    setSeq1Error(null);
    setSeq2Error(null);
  };

  const handleLoadExample = (example: AlignmentExample) => {
    setSeq1(example.seq1);
    setSeq2(example.seq2);
    setSeq1Error(null);
    setSeq2Error(null);
    setShowExamples(false);
  };

  const seq1Stats = seq1 ? getSequenceStats(seq1) : null;
  const seq2Stats = seq2 ? getSequenceStats(seq2) : null;
  const isLargeSeq1 = seq1Stats && seq1Stats.length > LARGE_SEQUENCE_WARNING;
  const isLargeSeq2 = seq2Stats && seq2Stats.length > LARGE_SEQUENCE_WARNING;
  const canSubmit = seq1 && seq2 && !seq1Error && !seq2Error && !isLoading;

  const glassInputStyle = {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
    boxShadow: 'var(--button-shadow, inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02))',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-[13px] md:text-[14px] font-medium text-[var(--foreground-secondary)]">
              Sequence 1
            </label>
            {seq1Stats && (
              <span className={`text-[11px] md:text-[12px] ${isLargeSeq1 ? 'text-orange-500' : 'text-gray-500'}`}>
                {seq1Stats.length} bp
                {seq1Stats.gcContent !== undefined && ` | ${seq1Stats.gcContent.toFixed(1)}% GC`}
              </span>
            )}
          </div>
          <textarea
            value={seq1}
            onChange={(e) => {
              const val = e.target.value;
              setSeq1(val);
              clearTimeout(seq1DebounceRef.current);
              seq1DebounceRef.current = setTimeout(() => validateSeq1(val), 250);
            }}
            placeholder="Enter DNA sequence (e.g., ATCGATCG)"
            className={`w-full h-[90px] md:h-[110px] px-4 py-3 rounded-[var(--button-corner-radius)] border backdrop-blur-[10px] text-[13px] md:text-[14px] font-mono text-[#000000] resize-none focus:outline-none focus:ring-2 focus:ring-blue-300/50 ${seq1Error ? 'border-red-400' : 'border-[var(--container-divider)]'}`}
            style={glassInputStyle}
          />
          {seq1Error && <p className="text-[11px] text-red-500 mt-1">{seq1Error}</p>}
          {isLargeSeq1 && !seq1Error && <p className="text-[11px] text-orange-500 mt-1">Large sequence may take longer</p>}
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-[13px] md:text-[14px] font-medium text-[var(--foreground-secondary)]">
              Sequence 2
            </label>
            {seq2Stats && (
              <span className={`text-[11px] md:text-[12px] ${isLargeSeq2 ? 'text-orange-500' : 'text-gray-500'}`}>
                {seq2Stats.length} bp
                {seq2Stats.gcContent !== undefined && ` | ${seq2Stats.gcContent.toFixed(1)}% GC`}
              </span>
            )}
          </div>
          <textarea
            value={seq2}
            onChange={(e) => {
              const val = e.target.value;
              setSeq2(val);
              clearTimeout(seq2DebounceRef.current);
              seq2DebounceRef.current = setTimeout(() => validateSeq2(val), 250);
            }}
            placeholder="Enter DNA sequence (e.g., ATCGATCG)"
            className={`w-full h-[90px] md:h-[110px] px-4 py-3 rounded-[var(--button-corner-radius)] border backdrop-blur-[10px] text-[13px] md:text-[14px] font-mono text-[#000000] resize-none focus:outline-none focus:ring-2 focus:ring-blue-300/50 ${seq2Error ? 'border-red-400' : 'border-[var(--container-divider)]'}`}
            style={glassInputStyle}
          />
          {seq2Error && <p className="text-[11px] text-red-500 mt-1">{seq2Error}</p>}
          {isLargeSeq2 && !seq2Error && <p className="text-[11px] text-orange-500 mt-1">Large sequence may take longer</p>}
        </div>
      </div>

      <div>
        <label className="text-[13px] md:text-[14px] font-medium text-[var(--foreground-secondary)] block mb-3">
          Scoring Parameters
        </label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-gray-600">Match:</label>
            <input
              type="number"
              value={scoring.match}
              onChange={(e) => updateScoring('match', e.target.value)}
              className="w-[60px] px-2 py-1.5 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-300/50"
              style={glassInputStyle}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-gray-600">Mismatch:</label>
            <input
              type="number"
              value={scoring.mismatch}
              onChange={(e) => updateScoring('mismatch', e.target.value)}
              className="w-[60px] px-2 py-1.5 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-300/50"
              style={glassInputStyle}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12px] text-gray-600">Gap:</label>
            <input
              type="number"
              value={scoring.gap}
              onChange={(e) => updateScoring('gap', e.target.value)}
              className="w-[60px] px-2 py-1.5 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-blue-300/50"
              style={glassInputStyle}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <GlassActionButton label={isLoading ? 'Aligning...' : 'Run Alignment'} primary onClick={handleSubmit} disabled={!canSubmit} />
        <div className="relative w-full sm:w-auto">
          <GlassActionButton label="Load Example" onClick={() => setShowExamples(!showExamples)} />
          {showExamples && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowExamples(false)} />
              <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:w-[320px] rounded-[var(--container-corner-radius)] border border-[var(--container-divider)] shadow-lg z-50 max-h-[300px] overflow-y-auto backdrop-blur-[20px]" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FC 100%)', boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 20px 0px rgba(0,0,0,0.15), 0px 4px 8px 0px rgba(0,0,0,0.1)' }}>
                {['educational', 'evolutionary', 'medical'].map((category) => (
                  <div key={category}>
                    <div className="px-4 py-2 bg-gray-50/80 text-[11px] text-gray-500 uppercase tracking-wide sticky top-0 font-semibold">
                      {category}
                    </div>
                    {alignmentExamples.filter(ex => ex.category === category).map((example) => (
                      <button
                        key={example.id}
                        onClick={() => handleLoadExample(example)}
                        className="w-full px-4 py-2.5 text-left transition-all duration-200 hover:opacity-80 active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.08)] border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-[13px] text-black font-medium">{example.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{example.description}</div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <GlassActionButton label="Clear" onClick={handleClear} />
      </div>
    </div>
  );
}
