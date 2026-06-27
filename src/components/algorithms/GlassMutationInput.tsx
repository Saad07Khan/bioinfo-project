'use client';

import { useEffect, useRef, useState } from 'react';

import GlassActionButton from '@/components/algorithms/GlassActionButton';
import { mutationExamples, type MutationExample } from '@/data/mutation-examples';
import { cleanSequence, parseGeneBank, validateGene, validateGeneBank } from '@/lib/utils/sequence-validation';

type GlassMutationInputProps = {
  onSolve: (startGene: string, endGene: string, bank: string[]) => void;
  isLoading?: boolean;
};

export default function GlassMutationInput({
  onSolve,
  isLoading = false
}: GlassMutationInputProps) {
  const [startGene, setStartGene] = useState('');
  const [endGene, setEndGene] = useState('');
  const [bankText, setBankText] = useState('');
  const [startError, setStartError] = useState<string | null>(null);
  const [endError, setEndError] = useState<string | null>(null);
  const [bankError, setBankError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const startDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const endDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const bankDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(startDebounceRef.current);
      clearTimeout(endDebounceRef.current);
      clearTimeout(bankDebounceRef.current);
    };
  }, []);

  const validateStart = (value: string) => {
    if (value) {
      const result = validateGene(value);
      setStartError(result.isValid ? null : result.error || 'Invalid gene');
      return;
    }

    setStartError(null);
  };

  const validateEnd = (value: string) => {
    if (value) {
      const result = validateGene(value);
      setEndError(result.isValid ? null : result.error || 'Invalid gene');
      return;
    }

    setEndError(null);
  };

  const validateBank = (text: string, end: string) => {
    if (text) {
      const bank = parseGeneBank(text);
      if (bank.length === 0) {
        setBankError('Gene bank cannot be empty');
        return;
      }

      const result = validateGeneBank(bank, end || undefined);
      setBankError(result.isValid ? null : result.error || 'Invalid gene bank');
      return;
    }

    setBankError(null);
  };

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

  const glassInputStyle = {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
    boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02)',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-[13px] md:text-[14px] font-medium text-[var(--foreground-secondary)]">
              Start Gene
            </label>
            <span className={`text-[11px] md:text-[12px] ${startGene && cleanSequence(startGene).length === 8 ? 'text-green-500' : 'text-gray-500'}`}>
              {cleanSequence(startGene).length}/8 characters
            </span>
          </div>
          <input
            type="text"
            value={startGene}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setStartGene(val);
              clearTimeout(startDebounceRef.current);
              startDebounceRef.current = setTimeout(() => validateStart(val), 250);
            }}
            placeholder="e.g., AACCGGTT"
            maxLength={10}
            className={`w-full px-4 py-3 rounded-[var(--button-corner-radius)] border backdrop-blur-[10px] text-[13px] md:text-[14px] font-mono text-[#000000] uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-300/50 ${startError ? 'border-red-400' : 'border-[var(--container-divider)]'}`}
            style={glassInputStyle}
          />
          {startError && <p className="text-[11px] text-red-500 mt-1">{startError}</p>}
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-[13px] md:text-[14px] font-medium text-[var(--foreground-secondary)]">
              End Gene
            </label>
            <span className={`text-[11px] md:text-[12px] ${endGene && cleanSequence(endGene).length === 8 ? 'text-green-500' : 'text-gray-500'}`}>
              {cleanSequence(endGene).length}/8 characters
            </span>
          </div>
          <input
            type="text"
            value={endGene}
            onChange={(e) => {
              const val = e.target.value.toUpperCase();
              setEndGene(val);
              clearTimeout(endDebounceRef.current);
              endDebounceRef.current = setTimeout(() => {
                validateEnd(val);
                validateBank(bankText, val);
              }, 250);
            }}
            placeholder="e.g., AAACGGTA"
            maxLength={10}
            className={`w-full px-4 py-3 rounded-[var(--button-corner-radius)] border backdrop-blur-[10px] text-[13px] md:text-[14px] font-mono text-[#000000] uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-300/50 ${endError ? 'border-red-400' : 'border-[var(--container-divider)]'}`}
            style={glassInputStyle}
          />
          {endError && <p className="text-[11px] text-red-500 mt-1">{endError}</p>}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <label className="text-[13px] md:text-[14px] font-medium text-[var(--foreground-secondary)]">
            Gene Bank (one per line)
          </label>
          <span className="text-[11px] md:text-[12px] text-gray-500">
            {bank.length} gene{bank.length !== 1 ? 's' : ''}
          </span>
        </div>
        <textarea
          value={bankText}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setBankText(val);
            clearTimeout(bankDebounceRef.current);
            bankDebounceRef.current = setTimeout(() => validateBank(val, endGene), 250);
          }}
          placeholder="Enter valid genes (one per line)"
          className={`w-full h-[90px] md:h-[110px] px-4 py-3 rounded-[var(--button-corner-radius)] border backdrop-blur-[10px] text-[13px] md:text-[14px] font-mono text-[#000000] uppercase resize-none focus:outline-none focus:ring-2 focus:ring-blue-300/50 ${bankError ? 'border-red-400' : 'border-[var(--container-divider)]'}`}
          style={glassInputStyle}
        />
        {bankError && <p className="text-[11px] text-red-500 mt-1">{bankError}</p>}
        <p className="text-[10px] text-gray-400 mt-2">Each gene must be exactly 8 characters (A, C, G, T). The end gene must be in the bank.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <GlassActionButton label={isLoading ? 'Finding...' : 'Find Path'} primary onClick={handleSubmit} disabled={!canSubmit} />
        <div className="relative w-full sm:w-auto">
          <GlassActionButton label="Load Example" onClick={() => setShowExamples(!showExamples)} />
          {showExamples && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowExamples(false)} />
              <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:w-[320px] rounded-[var(--container-corner-radius)] border border-[var(--container-divider)] shadow-lg z-50 max-h-[300px] overflow-y-auto backdrop-blur-[20px]" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FC 100%)', boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 20px 0px rgba(0,0,0,0.15), 0px 4px 8px 0px rgba(0,0,0,0.1)' }}>
                {['easy', 'medium', 'hard'].map((difficulty) => (
                  <div key={difficulty}>
                    <div className="px-4 py-2 text-[11px] uppercase tracking-wide sticky top-0 font-semibold bg-gray-50/80 text-gray-500">
                      {difficulty}
                    </div>
                    {mutationExamples.filter(ex => ex.difficulty === difficulty).map((example) => (
                      <button
                        key={example.id}
                        onClick={() => handleLoadExample(example)}
                        className="w-full px-4 py-2.5 text-left transition-all duration-200 hover:opacity-80 active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.08)] border-b border-[var(--container-divider)] last:border-b-0"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[13px] text-black font-medium">{example.name}</span>
                          {example.expectedMutations !== undefined && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[10px]"
                              style={{
                                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
                                color: '#000'
                              }}
                            >
                              {example.expectedMutations === -1 ? 'No path' : `${example.expectedMutations} steps`}
                            </span>
                          )}
                        </div>
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
