'use client';

import { useEffect, useRef } from 'react';
import { useAnimationStore, SPEED_PRESETS, SpeedPreset } from '@/lib/stores/animationStore';

interface AnimationControlsProps {
  onStepChange?: (stepIndex: number) => void;
}

export default function AnimationControls({ onStepChange }: AnimationControlsProps) {
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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle auto-play
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

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStepIndex);
  }, [currentStepIndex, onStepChange]);

  const currentStep = steps[currentStepIndex];
  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  // Get current speed preset name
  const getCurrentSpeedName = (): string => {
    const entries = Object.entries(SPEED_PRESETS) as [SpeedPreset, number][];
    const match = entries.find(([, value]) => value === speed);
    return match ? match[0].charAt(0).toUpperCase() + match[0].slice(1) : 'Custom';
  };

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-[15px] p-4">
      {/* Step Description */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[12px] text-gray-500"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span
            className="text-[11px] px-2 py-0.5 rounded bg-violet-100 text-violet-600"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
          >
            {currentStep?.data && 'phase' in currentStep.data
              ? currentStep.data.phase.toUpperCase()
              : ''}
          </span>
        </div>
        <p
          className="text-[13px] text-black"
          style={{ fontFamily: 'var(--font-inter), sans-serif' }}
        >
          {currentStep?.description || 'No description'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={reset}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Reset"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Previous Step */}
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={isPlaying ? pause : play}
            className="p-3 rounded-full bg-violet-600 hover:bg-violet-700 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={nextStep}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Next Step"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] text-gray-500"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            Speed:
          </span>
          <div className="flex gap-1">
            {(Object.entries(SPEED_PRESETS) as [SpeedPreset, number][]).map(([name, value]) => (
              <button
                key={name}
                onClick={() => setSpeed(value)}
                className={`
                  px-2 py-1 rounded text-[10px] transition-colors
                  ${speed === value
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
              >
                {name === 'veryFast' ? '2x' : name.charAt(0).toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Slider */}
      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={currentStepIndex}
          onChange={(e) => goToStep(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
        />
      </div>
    </div>
  );
}
