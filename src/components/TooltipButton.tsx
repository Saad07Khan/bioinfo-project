'use client';

import Image from 'next/image';

interface TooltipButtonProps {
  label: string;
  isSelected?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onClick?: () => void;
}

export default function TooltipButton({
  label,
  isSelected = false,
  leftIcon,
  rightIcon,
  onClick,
}: TooltipButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-[220px] h-8 flex items-center gap-2
        py-[var(--button-vertical-padding)]
        pl-[var(--button-horizontal-padding)]
        pr-2
        rounded-[var(--button-corner-radius)]
        font-inter font-medium text-[13px] leading-5 text-[#000000]
        transition-all duration-200 active:translate-y-px active:shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.1)]
        ${
          isSelected
            ? 'border border-[var(--container-divider)]'
            : 'border border-transparent hover:bg-white/10'
        }
      `}
      style={
        isSelected
          ? {
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.5) 100%)',
            }
          : undefined
      }
    >
      {leftIcon && (
        <Image
          src={leftIcon}
          alt=""
          width={16}
          height={16}
          className="w-4 h-4 flex-shrink-0"
        />
      )}
      <span className="flex-1 text-left truncate">{label}</span>
      {rightIcon && (
        <Image
          src={rightIcon}
          alt=""
          width={16}
          height={16}
          className="w-4 h-4 flex-shrink-0"
        />
      )}
    </button>
  );
}
