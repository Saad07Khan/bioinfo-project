'use client';

import { useEffect, useRef } from 'react';
import { useAnimationStore, SPEED_PRESETS, SpeedPreset } from '@/lib/stores/animationStore';

export default function GlassAnimationControls() {
  const {
    steps,
    currentStepIndex,
    isPlaying,
    speed,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    goToStep,
    setSpeed
  } = useAnimationStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        nextStep();
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, nextStep, steps.length]);

  const currentStep = steps[currentStepIndex];
  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  if (steps.length === 0) {
    return null;
  }

  const glassContainerStyle = {
    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
    boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02)',
  };

  return (
    <div className="w-full rounded-[var(--container-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[20px] p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg" style={glassContainerStyle}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--container-divider)]"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)',
              color: '#000'
            }}
          >
            {currentStep?.data && 'phase' in currentStep.data
              ? currentStep.data.phase.toUpperCase()
              : ''}
          </span>
        </div>
        <p className="text-[13px] text-black">
          {currentStep?.description || 'No description'}
        </p>
      </div>

      <div className="mb-4">
        <div className="h-2 rounded-full overflow-hidden border border-[var(--container-divider)]" style={{ background: 'rgba(255,255,255,0.3)' }}>
          <div
            className="h-full transition-all duration-200"
            style={{ width: `${progress}%`, background: 'rgba(0,0,0,0.6)' }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="p-2 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[10px] hover:opacity-80 active:translate-y-px active:[--button-shadow:inset_0px_1px_2px_0px_rgba(0,0,0,0.12),0px_2px_4px_0px_rgba(0,0,0,0.03)] transition-all duration-200"
            style={glassContainerStyle}
            title="Reset"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[10px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 active:translate-y-px active:[--button-shadow:inset_0px_1px_2px_0px_rgba(0,0,0,0.12),0px_2px_4px_0px_rgba(0,0,0,0.03)]"
            style={glassContainerStyle}
            title="Previous Step"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={isPlaying ? pause : play}
            className="p-3 rounded-full transition-all duration-200 hover:opacity-80 active:translate-y-px active:[--button-shadow:inset_0px_1px_2px_0px_rgba(0,0,0,0.12),0px_2px_4px_0px_rgba(0,0,0,0.03)] border border-black/30 backdrop-blur-[10px]"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)',
              boxShadow: 'var(--button-shadow, inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02))',
            }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[10px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 active:translate-y-px active:[--button-shadow:inset_0px_1px_2px_0px_rgba(0,0,0,0.12),0px_2px_4px_0px_rgba(0,0,0,0.03)]"
            style={glassContainerStyle}
            title="Next Step"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">Speed:</span>
          <div
            className="flex items-center gap-0.5 p-1 rounded-full border border-[var(--container-divider)]"
            style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.5) 100%)' }}
          >
            {(Object.entries(SPEED_PRESETS) as [SpeedPreset, number][]).map(([name, value]) => (
              <button
                key={name}
                onClick={() => setSpeed(value)}
                className={`
                  h-6 px-2 rounded-full text-[10px] font-medium transition-all duration-200 hover:opacity-80 active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.12)]
                  ${speed === value
                    ? 'border border-white/10 backdrop-blur-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)]'
                    : 'border border-transparent'
                  }
                `}
                style={
                  speed === value
                    ? { background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)', color: '#000' }
                    : { color: '#666' }
                }
              >
                {name === 'veryFast' ? '2x' : name.charAt(0).toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={currentStepIndex}
          onChange={(e) => goToStep(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.1)', accentColor: '#000' }}
        />
      </div>
    </div>
  );
}
