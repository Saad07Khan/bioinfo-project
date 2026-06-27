'use client';

interface GlassButtonProps {
  label: string;
  onClick?: () => void;
}

export default function GlassButton({ label, onClick }: GlassButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        h-7 px-[var(--button-horizontal-padding)] py-[var(--button-vertical-padding)]
        rounded-[var(--button-corner-radius)]
        border border-white/5
        backdrop-blur-[20px]
        shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]
        font-inter font-medium text-[13px] leading-5 text-[#000000]
        transition-all duration-200 hover:opacity-80 active:translate-y-px active:[--button-shadow:inset_0px_1px_2px_0px_rgba(0,0,0,0.16),0px_6px_8px_0px_rgba(0,0,0,0.08),0px_2px_2px_0px_rgba(0,0,0,0.04)]
      "
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.25) 100%)',
        boxShadow: 'var(--button-shadow, 0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.05))',
      }}
    >
      {label}
    </button>
  );
}
