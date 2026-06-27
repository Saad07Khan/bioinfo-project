'use client';

import { useState } from 'react';

interface AlgorithmTabsCardProps {
  defaultTab?: number;
  onTabChange?: (tab: number) => void;
}

const tabs = ['NeedleMan Wunsch', 'Smith-Waterman', 'BFS Mutation'];

export default function AlgorithmTabsCard({
  defaultTab = 0,
  onTabChange,
}: AlgorithmTabsCardProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  return (
    <div
      className="
        w-[480px] min-w-[480px]
        p-2.5
        rounded-[var(--container-corner-radius)]
        border border-white/10
        backdrop-blur-[20px]
        shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]
      "
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
      }}
    >
      {/* Tab Block */}
      <div className="flex w-full">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`
              flex-1 h-11
              px-4 py-3
              font-inter font-semibold text-[13px] leading-5 text-[#000000] whitespace-nowrap
              border-b
              transition-all duration-200
              ${
                activeTab === index
                  ? 'border-b-[#2670E9]'
                  : 'border-b-[var(--container-divider)]'
              }
            `}
            style={
              activeTab === index
                ? {
                    background: 'linear-gradient(0deg, rgba(38, 112, 233, 0.3) 0%, rgba(38, 112, 233, 0) 100%)',
                  }
                : undefined
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content area below tabs */}
      <div className="mt-4 p-2">
        {/* Future content for each tab */}
      </div>
    </div>
  );
}
