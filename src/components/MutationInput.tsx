'use client';

import { useState, useEffect } from 'react';
import { validateGene, parseGeneBank, validateGeneBank, cleanSequence } from '@/lib/utils/sequence-validation';
import { mutationExamples, MutationExample } from '@/data/mutation-examples';

interface MutationInputProps {
  onSolve: (startGene: string, endGene: string, bank: string[]) => void;
  isLoading?: boolean;
}

export default function MutationInput({ onSolve, isLoading = false }: MutationInputProps) {
  const [startGene, setStartGene] = useState('');
  const [endGene, setEndGene] = useState('');
  const [bankText, setBankText] = useState('');

  const [startError, setStartError] = useState<string | null>(null);
  const [endError, setEndError] = useState<string | null>(null);
  const [bankError, setBankError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  // Validate start gene
  useEffect(() => {
    if (startGene) {
      const result = validateGene(startGene);
      setStartError(result.isValid ? null : result.error || 'Invalid gene');
    } else {
      setStartError(null);
    }
  }, [startGene]);

  // Validate end gene
  useEffect(() => {
    if (endGene) {
      const result = validateGene(endGene);
      setEndError(result.isValid ? null : result.error || 'Invalid gene');
    } else {
      setEndError(null);
    }
  }, [endGene]);

  // Validate bank
  useEffect(() => {
    if (bankText) {
      const bank = parseGeneBank(bankText);
      if (bank.length === 0) {
        setBankError('Gene bank cannot be empty');
      } else {
        const result = validateGeneBank(bank, endGene || undefined);
        setBankError(result.isValid ? null : result.error || 'Invalid gene bank');
      }
    } else {
      setBankError(null);
    }
  }, [bankText, endGene]);

  const handleSubmit = () => {
    const cleanedStart = cleanSequence(startGene);
    const cleanedEnd = cleanSequence(endGene);
    const bank = parseGeneBank(bankText);

    const startValidation = validateGene(cleanedStart);
    const endValidation = validateGene(cleanedEnd);
    const bankValidation = validateGeneBank(bank, cleanedEnd);

    if (!startValidation.isValid) {
      setStartError(startValidation.error || 'Invalid start gene');
      return;
    }
    if (!endValidation.isValid) {
      setEndError(endValidation.error || 'Invalid end gene');
      return;
    }
    if (!bankValidation.isValid) {
      setBankError(bankValidation.error || 'Invalid gene bank');
      return;
    }

    onSolve(cleanedStart, cleanedEnd, bank);
  };

  const handleClear = () => {
    setStartGene('');
    setEndGene('');
    setBankText('');
    setStartError(null);
    setEndError(null);
    setBankError(null);
  };

  const handleLoadExample = (example: MutationExample) => {
    setStartGene(example.startGene);
    setEndGene(example.endGene);
    setBankText(example.bank.join('\n'));
    setStartError(null);
    setEndError(null);
    setBankError(null);
    setShowExamples(false);
  };

  const bank = parseGeneBank(bankText);
  const canSubmit = startGene && endGene && bankText && !startError && !endError && !bankError && !isLoading;

  return (
    <div className="w-full">
      {/* Gene Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Start Gene */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              className="text-[13px] md:text-[14px] text-black"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
            >
              Start Gene
            </label>
            <span
              className={`text-[11px] md:text-[12px] ${
                startGene && cleanSequence(startGene).length === 8 ? 'text-green-500' : 'text-gray-500'
              }`}
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {cleanSequence(startGene).length}/8 characters
            </span>
          </div>
          <input
            type="text"
            value={startGene}
            onChange={(e) => setStartGene(e.target.value.toUpperCase())}
            placeholder="e.g., AACCGGTT"
            maxLength={10}
            className={`
              w-full px-4 py-3
              rounded-[12px] md:rounded-[15px]
              border transition-colors duration-200
              text-[14px] md:text-[15px] font-mono uppercase tracking-wider
              focus:outline-none focus:ring-2 focus:ring-violet-300
              ${startError
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            style={{ fontFamily: 'monospace' }}
          />
          {startError && (
            <p className="text-[11px] text-red-500" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              {startError}
            </p>
          )}
        </div>

        {/* End Gene */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              className="text-[13px] md:text-[14px] text-black"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
            >
              End Gene
            </label>
            <span
              className={`text-[11px] md:text-[12px] ${
                endGene && cleanSequence(endGene).length === 8 ? 'text-green-500' : 'text-gray-500'
              }`}
              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
            >
              {cleanSequence(endGene).length}/8 characters
            </span>
          </div>
          <input
            type="text"
            value={endGene}
            onChange={(e) => setEndGene(e.target.value.toUpperCase())}
            placeholder="e.g., AAACGGTA"
            maxLength={10}
            className={`
              w-full px-4 py-3
              rounded-[12px] md:rounded-[15px]
              border transition-colors duration-200
              text-[14px] md:text-[15px] font-mono uppercase tracking-wider
              focus:outline-none focus:ring-2 focus:ring-violet-300
              ${endError
                ? 'border-red-400 bg-red-50/50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
            style={{ fontFamily: 'monospace' }}
          />
          {endError && (
            <p className="text-[11px] text-red-500" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
              {endError}
            </p>
          )}
        </div>
      </div>

      {/* Gene Bank */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label
            className="text-[13px] md:text-[14px] text-black"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
          >
            Gene Bank
          </label>
          <span
            className="text-[11px] md:text-[12px] text-gray-500"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {bank.length} gene{bank.length !== 1 ? 's' : ''}
          </span>
        </div>
        <textarea
          value={bankText}
          onChange={(e) => setBankText(e.target.value.toUpperCase())}
          placeholder="Enter valid genes (one per line or comma-separated)&#10;e.g., AACCGGTA&#10;AACCGCTA&#10;AAACGGTA"
          className={`
            w-full h-[120px] md:h-[140px] px-4 py-3
            rounded-[12px] md:rounded-[15px]
            border transition-colors duration-200
            text-[13px] md:text-[14px] font-mono uppercase
            resize-none
            focus:outline-none focus:ring-2 focus:ring-violet-300
            ${bankError
              ? 'border-red-400 bg-red-50/50'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
          style={{ fontFamily: 'monospace' }}
        />
        {bankError && (
          <p className="text-[11px] text-red-500 mt-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
            {bankError}
          </p>
        )}
        <p className="text-[10px] text-gray-400 mt-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          Each gene must be exactly 8 characters (A, C, G, T). The end gene must be in the bank.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Find Path Button */}
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
              Finding Path...
            </>
          ) : (
            'Find Mutation Path'
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
              {['easy', 'medium', 'hard'].map((difficulty) => (
                <div key={difficulty}>
                  <div
                    className={`px-4 py-2 text-[11px] uppercase tracking-wide sticky top-0 ${
                      difficulty === 'easy' ? 'bg-violet-50 text-violet-600' :
                      difficulty === 'medium' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 600 }}
                  >
                    {difficulty}
                  </div>
                  {mutationExamples
                    .filter(ex => ex.difficulty === difficulty)
                    .map((example) => (
                      <button
                        key={example.id}
                        onClick={() => handleLoadExample(example)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[13px] text-black"
                            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                          >
                            {example.name}
                          </span>
                          {example.expectedMutations !== undefined && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded ${
                                example.expectedMutations === -1
                                  ? 'bg-rose-100 text-rose-600'
                                  : 'bg-indigo-100 text-indigo-600'
                              }`}
                              style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                            >
                              {example.expectedMutations === -1 ? 'No path' : `${example.expectedMutations} steps`}
                            </span>
                          )}
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
