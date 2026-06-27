'use client';

import { useState, useEffect } from 'react';
import { ScoringScheme, AlgorithmType, LARGE_SEQUENCE_WARNING } from '@/types/algorithms';
import { validateDNASequence, cleanSequence, getSequenceStats } from '@/lib/utils/sequence-validation';
import { alignmentExamples, AlignmentExample } from '@/data/alignment-examples';

interface SequenceInputProps {
  algorithm: 'needleman-wunsch' | 'smith-waterman';
  onAlign: (seq1: string, seq2: string, scoring: ScoringScheme) => void;
  isLoading?: boolean;
}

export default function SequenceInput({ algorithm, onAlign, isLoading = false }: SequenceInputProps) {
  const [seq1, setSeq1] = useState('');
  const [seq2, setSeq2] = useState('');
  const [scoring, setScoring] = useState<ScoringScheme>({
    match: algorithm === 'needleman-wunsch' ? 1 : 2,
    mismatch: -1,
    gap: algorithm === 'needleman-wunsch' ? -2 : -1
  });

  const [seq1Error, setSeq1Error] = useState<string | null>(null);
  const [seq2Error, setSeq2Error] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  // Update default scoring when algorithm changes
  useEffect(() => {
    setScoring({
      match: algorithm === 'needleman-wunsch' ? 1 : 2,
      mismatch: -1,
      gap: algorithm === 'needleman-wunsch' ? -2 : -1
    });
  }, [algorithm]);

  // Validate sequences on change
  useEffect(() => {
    if (seq1) {
      const result = validateDNASequence(seq1);
      setSeq1Error(result.isValid ? null : result.error || 'Invalid sequence');
    } else {
      setSeq1Error(null);
    }
  }, [seq1]);

  useEffect(() => {
    if (seq2) {
      const result = validateDNASequence(seq2);
      setSeq2Error(result.isValid ? null : result.error || 'Invalid sequence');
    } else {
      setSeq2Error(null);
    }
  }, [seq2]);

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

  return (
    <div className="w-full">
      {/* Sequence Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sequence 1 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              className="text-[13px] md:text-[14px] text-black"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
            >
              Sequence 1
            </label>
            {seq1Stats && (
              <span
                className={`text-[11px] md:text-[12px] ${isLargeSeq1 ? 'text-orange-500' : 'text-gray-500'}`}
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {seq1Stats.length} bp
                {seq1Stats.gcContent !== undefined && ` | ${seq1Stats.gcContent.toFixed(1)}% GC`}
              </span>
            )}
          </div>
          <textarea
            value={seq1}
            onChange={(e) => setSeq1(e.target.value)}
            placeholder="Enter DNA sequence (e.g., ATCGATCG)"
            className={`
              w-full h-[120px] md:h-[140px] px-4 py-3
              rounded-[12px] md:rounded-[15px]
              border transition-colors duration-200
              text-[13px] md:text-[14px] font-mono
              resize-none
              focus:outline-none focus:ring-2 focus:ring-violet-300
              ${seq1Error
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            style={{ fontFamily: 'monospace' }}
          />
          {seq1Error && (
            <p className="text-[11px] text-red-500" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              {seq1Error}
            </p>
          )}
          {isLargeSeq1 && !seq1Error && (
            <p className="text-[11px] text-orange-500" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Large sequence may take longer to process
            </p>
          )}
        </div>

        {/* Sequence 2 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              className="text-[13px] md:text-[14px] text-black"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
            >
              Sequence 2
            </label>
            {seq2Stats && (
              <span
                className={`text-[11px] md:text-[12px] ${isLargeSeq2 ? 'text-orange-500' : 'text-gray-500'}`}
                style={{ fontFamily: 'var(--font-inter), sans-serif' }}
              >
                {seq2Stats.length} bp
                {seq2Stats.gcContent !== undefined && ` | ${seq2Stats.gcContent.toFixed(1)}% GC`}
              </span>
            )}
          </div>
          <textarea
            value={seq2}
            onChange={(e) => setSeq2(e.target.value)}
            placeholder="Enter DNA sequence (e.g., ATCGATCG)"
            className={`
              w-full h-[120px] md:h-[140px] px-4 py-3
              rounded-[12px] md:rounded-[15px]
              border transition-colors duration-200
              text-[13px] md:text-[14px] font-mono
              resize-none
              focus:outline-none focus:ring-2 focus:ring-violet-300
              ${seq2Error
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            style={{ fontFamily: 'monospace' }}
          />
          {seq2Error && (
            <p className="text-[11px] text-red-500" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              {seq2Error}
            </p>
          )}
          {isLargeSeq2 && !seq2Error && (
            <p className="text-[11px] text-orange-500" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              Large sequence may take longer to process
            </p>
          )}
        </div>
      </div>

      {/* Scoring Scheme */}
      <div className="mb-6">
        <label
          className="text-[13px] md:text-[14px] text-black block mb-3"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
        >
          Scoring Parameters
        </label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label
              className="text-[12px] text-gray-600"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Match:
            </label>
            <input
              type="number"
              value={scoring.match}
              onChange={(e) => setScoring(s => ({ ...s, match: parseInt(e.target.value) || 0 }))}
              className="w-[60px] px-2 py-1.5 rounded-[8px] border border-gray-200 text-[13px] text-center focus:outline-none focus:border-[#6099DD]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              className="text-[12px] text-gray-600"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Mismatch:
            </label>
            <input
              type="number"
              value={scoring.mismatch}
              onChange={(e) => setScoring(s => ({ ...s, mismatch: parseInt(e.target.value) || 0 }))}
              className="w-[60px] px-2 py-1.5 rounded-[8px] border border-gray-200 text-[13px] text-center focus:outline-none focus:border-[#6099DD]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              className="text-[12px] text-gray-600"
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              Gap:
            </label>
            <input
              type="number"
              value={scoring.gap}
              onChange={(e) => setScoring(s => ({ ...s, gap: parseInt(e.target.value) || 0 }))}
              className="w-[60px] px-2 py-1.5 rounded-[8px] border border-gray-200 text-[13px] text-center focus:outline-none focus:border-[#6099DD]"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Align Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-full
            text-[13px] md:text-[14px] transition-all duration-200
            ${canSubmit
              ? 'bg-violet-600 text-white hover:bg-violet-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
          style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500 }}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Aligning...
            </>
          ) : (
            'Align Sequences'
          )}
        </button>

        {/* Load Example Button */}
        <div className="relative">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-[13px] md:text-[14px] text-black hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500 }}
          >
            Load Example
            <svg
              className={`w-4 h-4 transition-transform ${showExamples ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Examples Dropdown */}
          {showExamples && (
            <div className="absolute top-full left-0 mt-2 w-[280px] md:w-[320px] bg-white rounded-[12px] border border-gray-200 shadow-lg z-50 max-h-[300px] overflow-y-auto">
              {['educational', 'evolutionary', 'medical'].map((category) => (
                <div key={category}>
                  <div
                    className="px-4 py-2 bg-gray-50 text-[11px] text-gray-500 uppercase tracking-wide sticky top-0"
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
                  >
                    {category}
                  </div>
                  {alignmentExamples
                    .filter(ex => ex.category === category)
                    .map((example) => (
                      <button
                        key={example.id}
                        onClick={() => handleLoadExample(example)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div
                          className="text-[13px] text-black"
                          style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                        >
                          {example.name}
                        </div>
                        <div
                          className="text-[11px] text-gray-500 mt-0.5"
                          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                        >
                          {example.description}
                        </div>
                      </button>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          className="px-4 py-2.5 rounded-full border border-gray-200 text-[13px] md:text-[14px] text-gray-600 hover:bg-gray-50 transition-colors"
          style={{ fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500 }}
        >
          Clear
        </button>
      </div>

      {/* Click outside to close dropdown */}
      {showExamples && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExamples(false)}
        />
      )}
    </div>
  );
}
