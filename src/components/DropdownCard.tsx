'use client';

import { ReactNode } from 'react';

interface DropdownCardProps {
  children: ReactNode;
}

export default function DropdownCard({ children }: DropdownCardProps) {
  return (
    <div
      className="
        w-[240px] max-w-[560px] p-2.5
        rounded-[var(--container-corner-radius)]
        border border-white/10
        backdrop-blur-[20px]
        shadow-[0px_10px_10px_0px_rgba(0,0,0,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_1px_0px_0px_rgba(0,0,0,0.05)]
      "
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
      }}
    >
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
}

export function Divider() {
  return (
    <div
      className="w-[220px] h-px rounded-[10px] mx-auto"
      style={{
        background:
          'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)',
      }}
    />
  );
}
