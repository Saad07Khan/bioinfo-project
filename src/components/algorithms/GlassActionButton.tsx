'use client';

type GlassActionButtonProps = {
  label: string;
  primary?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export default function GlassActionButton({
  label,
  primary = false,
  onClick,
  disabled = false
}: GlassActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full sm:w-auto min-h-10 h-auto px-5 py-2
        inline-flex items-center justify-center text-center shrink-0 whitespace-nowrap
        rounded-[var(--button-corner-radius)]
        border border-[var(--container-divider)] backdrop-blur-[20px]
        font-inter font-medium text-[13px] md:text-[14px] leading-5
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : 'hover:opacity-80 active:translate-y-px active:[--button-shadow:inset_0px_1px_2px_0px_rgba(0,0,0,0.16),0px_6px_8px_0px_rgba(0,0,0,0.08),0px_2px_2px_0px_rgba(0,0,0,0.04)] hover:-translate-y-[3px] hover:shadow-lg'}
        ${primary ? 'text-[#000000]' : 'text-[var(--foreground-secondary)]'}
      `}
      style={{
        background: primary
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.25) 100%)',
        boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.05)',
      }}
    >
      {label}
    </button>
  );
}
