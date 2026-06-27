'use client';

import Image from 'next/image';
import GlassButton from './GlassButton';
import { Divider } from './DropdownCard';

interface ConfirmationCardProps {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export default function ConfirmationCard({
  title = 'Confirmation',
  message = 'Are you sure you want to change your profile information? This cannot be undone.',
  onConfirm,
  onCancel,
  onClose,
}: ConfirmationCardProps) {
  return (
    <div
      className="
        relative w-[260px] min-w-[240px]
        p-5
        rounded-[var(--container-corner-radius)]
        border border-white/10
        backdrop-blur-[20px]
        shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]
      "
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="
          absolute top-2 right-2
          w-7 h-7 p-1.5
          rounded-full
          border border-white/10
          backdrop-blur-[20px]
          shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]
          flex items-center justify-center
          transition-all duration-200 hover:opacity-80
        "
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
        }}
      >
        <Image
          src="/X Mark.svg"
          alt="Close"
          width={16}
          height={16}
          className="w-4 h-4"
        />
      </button>

      {/* Content - single padding layer, gap for spacing */}
      <div className="flex flex-col gap-2.5">
        {/* Title */}
        <h3 className="font-inter font-semibold text-2xl leading-none tracking-[-0.04em] text-center text-[#000000]">
          {title}
        </h3>

        <Divider />

        {/* Message */}
        <p className="font-inter font-normal text-sm leading-5 text-center text-[var(--foreground-secondary)]">
          {message}
        </p>

        <Divider />

        {/* Buttons */}
        <div className="flex items-center justify-center gap-2.5">
          <GlassButton label="Cancel" onClick={onCancel} />
          <GlassButton label="Confirm" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
