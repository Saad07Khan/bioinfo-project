'use client';

import Image from 'next/image';

interface TabButtonProps {
  label: string;
  isActive?: boolean;
  showChevron?: boolean;
  onClick?: () => void;
}

export default function TabButton({
  label,
  isActive = false,
  showChevron = false,
  onClick,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 h-10
        px-[var(--button-horizontal-padding)] py-2.5
        rounded-[var(--button-corner-radius)]
        font-inter font-medium text-[13px] leading-5 text-[#000000]
        transition-all duration-200 active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.12)]
        ${
          isActive
            ? `
              bg-[var(--container-background)]
              border border-[var(--container-border)]
              backdrop-blur-[20px]
              shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]
            `
            : 'bg-transparent border-transparent'
        }
      `}
    >
      <span>{label}</span>
      {showChevron && (
        <Image
          src="/Chevron Right.svg"
          alt=""
          width={16}
          height={16}
          className="w-4 h-4"
        />
      )}
    </button>
  );
}
