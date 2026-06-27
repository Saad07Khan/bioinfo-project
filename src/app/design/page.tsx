'use client';

import { useState } from 'react';
import TabButton from '@/components/TabButton';
import DropdownCard, { Divider } from '@/components/DropdownCard';
import TooltipButton from '@/components/TooltipButton';
import ConfirmationCard from '@/components/ConfirmationCard';
import SpeedControlCard from '@/components/SpeedControlCard';
import AlgorithmTabsCard from '@/components/AlgorithmTabsCard';

export default function DesignPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedItem, setSelectedItem] = useState(0);

  const tabs = [
    { label: 'Explore Algorithms', showChevron: true },
    { label: 'MIT License', showChevron: false },
    { label: 'GitHub Library', showChevron: false },
  ];

  const menuItems = [
    { label: 'iPhone 15', leftIcon: '/file.svg', rightIcon: '/globe.svg' },
    { label: 'iPhone 14 Pro', leftIcon: '/file.svg', rightIcon: '/globe.svg' },
    { label: 'iPhone 14', leftIcon: '/file.svg', rightIcon: '/globe.svg' },
    { label: 'iPhone 13', leftIcon: '/file.svg', rightIcon: '/globe.svg' },
    { label: 'iPhone 12', leftIcon: '/file.svg', rightIcon: '/globe.svg' },
    { label: 'iPhone SE', leftIcon: '/file.svg', rightIcon: '/globe.svg' },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Main Container - mobile first, scales up */}
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs Block - centered */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              label={tab.label}
              isActive={activeTab === index}
              showChevron={tab.showChevron && activeTab === index}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="mt-10 flex gap-[30px]">
          {/* Left Column */}
          <div className="flex flex-col gap-[30px] w-[240px]">
            {/* Dropdown Card */}
            <DropdownCard>
              {menuItems.map((item, index) => (
                <div key={index}>
                  <TooltipButton
                    label={item.label}
                    leftIcon={item.leftIcon}
                    rightIcon={item.rightIcon}
                    isSelected={selectedItem === index}
                    onClick={() => setSelectedItem(index)}
                  />
                  {index < menuItems.length - 1 && <Divider />}
                </div>
              ))}
            </DropdownCard>

            {/* Confirmation Card */}
            <ConfirmationCard
              onConfirm={() => console.log('Confirmed')}
              onCancel={() => console.log('Cancelled')}
              onClose={() => console.log('Closed')}
            />

            {/* Speed Control Card */}
            <SpeedControlCard
              defaultSpeed={1}
              onSpeedChange={(speed) => console.log('Speed:', speed)}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-[30px]">
            {/* Algorithm Tabs Card */}
            <AlgorithmTabsCard
              defaultTab={0}
              onTabChange={(tab) => console.log('Tab:', tab)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
