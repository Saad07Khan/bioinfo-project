'use client';

import { useState } from 'react';

interface SpeedControlCardProps {
  defaultSpeed?: number;
  onSpeedChange?: (speed: number) => void;
}

const speeds = [1, 2, 3, 4];

export default function SpeedControlCard({
  defaultSpeed = 1,
  onSpeedChange,
}: SpeedControlCardProps) {
  const [selectedSpeed, setSelectedSpeed] = useState(defaultSpeed);

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
    onSpeedChange?.(speed);
  };

  return (
    // Speed Control Card
    <div
      className="
        w-[320px] p-8
        rounded-[var(--container-corner-radius)]
        border border-white/10
        backdrop-blur-[20px]
        shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]
      "
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
      }}
    >
      {/* Speed Buttons Container - pill shaped */}
      <div
        className="
          flex items-center gap-0.5
          p-1.5 rounded-full
          border border-[var(--container-divider)]
        "
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.5) 100%)',
        }}
      >
        {speeds.map((speed) => (
          <button
            key={speed}
            onClick={() => handleSpeedChange(speed)}
            className={`
              h-7 px-[var(--button-horizontal-padding)] py-[var(--button-vertical-padding)]
              rounded-full
              font-inter font-medium text-[13px] leading-5 text-[#000000]
              transition-all duration-200
              ${
                selectedSpeed === speed
                  ? 'border border-white/10 backdrop-blur-[20px] shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]'
                  : 'border border-transparent'
              }
            `}
            style={
              selectedSpeed === speed
                ? {
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
                  }
                : undefined
            }
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
}
