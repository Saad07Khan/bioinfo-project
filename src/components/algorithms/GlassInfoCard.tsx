'use client';

import { memo } from 'react';
import Image from 'next/image';

interface GlassInfoCardProps {
  title: string;
  description: string;
  image: string;
  glowType: 'purple' | 'blue';
  link: string;
}

export default memo(function GlassInfoCard({
  title,
  description,
  image,
  glowType,
  link,
}: GlassInfoCardProps) {
  const purpleGlow = 'conic-gradient(from 90deg at 40.63% 50.41%, rgba(159, 115, 241, 0) -48.92deg, rgba(242, 98, 181, 0) 125.18deg, #5FC5FF 193.41deg, #FFAC89 216.02deg, #8155FF 236.07deg, #789DFF 259.95deg, rgba(159, 115, 241, 0) 311.08deg, rgba(242, 98, 181, 0) 485.18deg)';
  const blueGlow = 'conic-gradient(from 90deg at 40.63% 50.41%, rgba(95, 197, 255, 0) -48.92deg, rgba(120, 157, 255, 0) 125.18deg, #5FC5FF 193.41deg, #89C4FF 216.02deg, #5596FF 236.07deg, #789DFF 259.95deg, rgba(95, 197, 255, 0) 311.08deg, rgba(120, 157, 255, 0) 485.18deg)';

  return (
    <div className="relative w-full max-w-[340px] min-w-0 overflow-visible">
      <div
        className="absolute -inset-10 rounded-[var(--container-corner-radius)]"
        style={{
          background: glowType === 'purple' ? purpleGlow : blueGlow,
          filter: 'blur(70px)',
          opacity: 0.7,
          zIndex: 0,
        }}
      />

      <div
        className="relative min-h-[520px] rounded-[var(--container-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
          boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.05)',
          zIndex: 1,
        }}
      >
        <div
          className="relative w-full h-[240px] overflow-hidden"
          style={{
            boxShadow: '0px 30px 60px 0px rgba(0,0,0,0.15), 0px 15px 30px 0px rgba(0,0,0,0.1)',
          }}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        <div className="px-5 py-6 flex flex-col gap-[10px]">
          <div className="flex items-center justify-center">
            <h3
              className="text-[14px] leading-5 text-[#000000] text-center"
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 500,
              }}
            >
              {title}
            </h3>
          </div>

          <div
            className="h-px w-full rounded-[10px]"
            style={{
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)',
            }}
          />

          <p
            className="text-[12px] md:text-[13px] text-[var(--foreground-secondary)] leading-[150%] text-center"
            style={{ fontFamily: 'var(--font-inter), sans-serif' }}
          >
            {description}
          </p>

          <div
            className="h-px w-full rounded-[10px]"
            style={{
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)',
            }}
          />

          <div className="flex justify-center mt-auto">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-4 flex items-center gap-2 rounded-[var(--button-corner-radius)] border border-[var(--container-divider)] backdrop-blur-[20px] font-inter font-medium text-[13px] text-[#000000] transition-all duration-200 hover:opacity-80 active:translate-y-px active:[--button-shadow:inset_0px_1px_2px_0px_rgba(0,0,0,0.12),0px_2px_4px_0px_rgba(0,0,0,0.03)]"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.25) 100%)',
                boxShadow: 'var(--button-shadow, inset 0px 1px 0px 0px rgba(255,255,255,0.6), 0px 4px 8px 0px rgba(0,0,0,0.04), 0px 2px 4px 0px rgba(0,0,0,0.02))',
              }}
            >
              <span>Learn More</span>
              <Image
                src="/Menu Circles Gear.svg"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
})
