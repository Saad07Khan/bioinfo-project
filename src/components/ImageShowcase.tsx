'use client';

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion/variants';

interface Feature {
  title: ReactNode;
  description: ReactNode;
}

const ImageShowcase: React.FC = () => {
  const features: Feature[] = [
    {
      title: (
        <>
          Graph-Based<br />Algorithms
        </>
      ),
      description: (
        <>
          BFS finds shortest mutation paths between<br />gene sequences through graph traversal.
        </>
      )
    },
    {
      title: (
        <>
          Global Sequence<br />Alignment
        </>
      ),
      description: (
        <>
          Needleman-Wunsch aligns complete sequences optimally for evolutionary comparison.
        </>
      )
    },
    {
      title: (
        <>
          Local Sequence<br />Alignment
        </>
      ),
      description: (
        <>
          Smith-Waterman identifies conserved functional regions within longer sequences.
        </>
      )
    },
    {
      title: (
        <>
          Real Genomic<br />Data
        </>
      ),
      description: (
        <>
          Access NCBI databases, upload files, or explore  30+ curated biological examples.
        </>
      )
    }
  ];

  return (
    <section 
      className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8 mt-[60px] md:mt-[120px] lg:mt-[160px] xl:mt-[200px]"
    >
      {/* Mobile Layout - Stacked */}
      <motion.div
        className="md:hidden flex flex-col gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {/* Grey Image - Increased height */}
        <motion.div className="relative w-full h-[180px] rounded-[11px] overflow-hidden" variants={fadeUp}>
          <Image
            src="/pic_grey.webp"
            alt="Sequence alignment visualization"
            width={400}
            height={180}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Card - Bottom Right */}
          <div 
            className="absolute bottom-2 right-2 rounded-[7px] p-2 flex flex-col gap-[5px]"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'inset 0.23px 0.23px 0.23px 0px rgba(255, 255, 255, 0.95), inset -0.47px -0.47px 0.47px 0px rgba(255, 255, 255, 0.65)'
            }}
          >
            {/* Text */}
            <p 
              className="text-black text-[10px] leading-[120%]"
              style={{ 
                fontFamily: 'Inter Display, sans-serif', 
                fontWeight: 500
              }}
            >
              Visual Learning<br />through Animation
            </p>
            
            {/* Button */}
            <Link
              href="/algorithms1"
              className="bg-white rounded-[33px] px-2 py-1 text-black text-[7px] leading-[120%] hover:opacity-90 transition-opacity no-underline inline-block"
              style={{
                fontFamily: 'Inter Display, sans-serif',
                fontWeight: 500
              }}
            >
              See it work
            </Link>
          </div>
        </motion.div>

        {/* Cyan Image */}
        <motion.div className="relative w-full h-[200px] rounded-[11px] overflow-hidden" variants={fadeUp}>
          <Image
            src="/pic_cyan.webp"
            alt="DNA sequence visualization"
            width={400}
            height={200}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Card - Bottom Right */}
          <div 
            className="absolute bottom-2 right-2 rounded-[7px] p-2 flex flex-col gap-[5px]"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'inset 0.23px 0.23px 0.23px 0px rgba(255, 255, 255, 0.95), inset -0.47px -0.47px 0.47px 0px rgba(255, 255, 255, 0.65)'
            }}
          >
            {/* Text */}
            <p 
              className="text-black text-[10px] leading-[120%]"
              style={{ 
                fontFamily: 'Inter Display, sans-serif', 
                fontWeight: 500
              }}
            >
              Start Analyzing<br />Sequences
            </p>
            
            {/* Button */}
            <Link
              href="/algorithms1"
              className="bg-white rounded-[33px] px-2 py-1 text-black text-[7px] leading-[120%] hover:opacity-90 transition-opacity no-underline inline-block"
              style={{
                fontFamily: 'Inter Display, sans-serif',
                fontWeight: 500
              }}
            >
              Launch tool
            </Link>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div className="bg-white rounded-[8px] p-4" variants={fadeUp}>
          <div className="flex flex-col gap-[14px]">
            {features.map((feature: Feature, index: number) => (
              <div 
                key={index}
                className="flex flex-col gap-2"
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-[6px]">
                  {/* Plus Icon Circle */}
                  <div 
                    className="flex items-center justify-center rounded-full border flex-shrink-0 w-[16px] h-[16px]"
                    style={{ 
                      borderWidth: '0.5px',
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      padding: '3px'
                    }}
                  >
                    <Image
                      src="/plus-sign.svg"
                      alt="Plus"
                      width={10}
                      height={10}
                      className="w-[8px] h-[8px]"
                    />
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-black text-[12px] leading-[120%]"
                    style={{ 
                      fontFamily: 'Inter Display, sans-serif', 
                      fontWeight: 500
                    }}
                  >
                    {feature.title}
                  </h3>
                </div>

                {/* Description - full width on mobile */}
                <p 
                  className="text-black text-[10px] leading-[140%] text-left pl-[22px]"
                  style={{ 
                    fontFamily: 'Inter Display, sans-serif', 
                    fontWeight: 400
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Desktop Layout - Absolute Positioned */}
      <motion.div
        className="hidden md:block relative w-full max-w-[673px] md:max-w-[900px] lg:max-w-[1200px] xl:max-w-[1400px] h-[350px] md:h-[500px] lg:h-[650px] xl:h-[750px] mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >

        {/* Grey Image - Top Left - Increased height */}
        <motion.div
          className="absolute rounded-[11px] md:rounded-[15px] lg:rounded-[20px] overflow-visible"
          style={{
            top: '14%',
            left: '2.5%',
            width: '60%',
            height: '40%'
          }}
          variants={fadeUp}
        >
          <div className="relative w-full h-full rounded-[11px] md:rounded-[15px] lg:rounded-[20px] overflow-hidden">
            <Image
              src="/pic_grey.webp"
              alt="Sequence alignment visualization"
              fill
              className="object-cover"
            />
            
            {/* Overlay Card - Bottom Right - Reduced bottom spacing */}
            <div 
              className="absolute rounded-[7px] md:rounded-[10px] lg:rounded-[12px] p-[7px] md:p-[10px] lg:p-[12px] flex flex-col gap-[5px] md:gap-[7px] lg:gap-[9px]"
              style={{
                bottom: '2%',
                right: '3%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'inset 0.23px 0.23px 0.23px 0px rgba(255, 255, 255, 0.95), inset -0.47px -0.47px 0.47px 0px rgba(255, 255, 255, 0.65)'
              }}
            >
              {/* Text */}
              <p 
                className="text-black text-[9px] md:text-[12px] lg:text-[15px] xl:text-[18px] leading-[120%]"
                style={{ 
                  fontFamily: 'Inter Display, sans-serif', 
                  fontWeight: 500
                }}
              >
                Visual Learning<br />through Animation
              </p>
              
              {/* Button */}
              <Link
                href="/algorithms1"
                className="bg-white rounded-[33px] px-[7px] md:px-[10px] lg:px-[12px] py-[4px] md:py-[5px] lg:py-[6px] text-black text-[7px] md:text-[9px] lg:text-[11px] xl:text-[13px] leading-[120%] hover:opacity-90 transition-opacity whitespace-nowrap no-underline inline-block"
                style={{
                  fontFamily: 'Inter Display, sans-serif',
                  fontWeight: 500
                }}
              >
                See it work
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Cyan Image - Right Side - Extended height to align with text block */}
        <motion.div
          className="absolute rounded-[11px] md:rounded-[15px] lg:rounded-[20px] overflow-visible"
          style={{
            top: '12%',
            right: '0%',
            width: '34%',
            height: '93%'
          }}
          variants={fadeUp}
        >
          <div className="relative w-full h-full rounded-[11px] md:rounded-[15px] lg:rounded-[20px] overflow-hidden">
            <Image
              src="/pic_cyan.webp"
              alt="DNA sequence visualization"
              fill
              className="object-cover"
            />
            
            {/* Overlay Card - Bottom Right - Reduced bottom spacing */}
            <div 
              className="absolute rounded-[7px] md:rounded-[10px] lg:rounded-[12px] p-[7px] md:p-[10px] lg:p-[12px] flex flex-col gap-[5px] md:gap-[7px] lg:gap-[9px]"
              style={{
                bottom: '1.5%',
                right: '3%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'inset 0.23px 0.23px 0.23px 0px rgba(255, 255, 255, 0.95), inset -0.47px -0.47px 0.47px 0px rgba(255, 255, 255, 0.65)'
              }}
            >
              {/* Text */}
              <p 
                className="text-black text-[9px] md:text-[12px] lg:text-[15px] xl:text-[18px] leading-[120%]"
                style={{ 
                  fontFamily: 'Inter Display, sans-serif', 
                  fontWeight: 500
                }}
              >
                Start Analyzing<br />Sequences
              </p>
              
              {/* Button */}
              <Link
                href="/algorithms1"
                className="bg-white rounded-[33px] px-[7px] md:px-[10px] lg:px-[12px] py-[4px] md:py-[5px] lg:py-[6px] text-black text-[7px] md:text-[9px] lg:text-[11px] xl:text-[13px] leading-[120%] hover:opacity-90 transition-opacity whitespace-nowrap no-underline inline-block"
                style={{
                  fontFamily: 'Inter Display, sans-serif',
                  fontWeight: 500
                }}
              >
                Launch tool
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Features List Container - No left padding, headings align with grey image */}
        <motion.div
          className="absolute bg-white rounded-[8px] md:rounded-[12px] lg:rounded-[16px] py-4 pr-6 md:py-6 md:pr-10 lg:py-8 lg:pr-12 xl:py-10 xl:pr-14"
          style={{
            top: '59%',
            left: '2.5%',
            width: '62%',
            paddingLeft: '0'
          }}
          variants={fadeUp}
        >
          <div className="flex flex-col gap-[16px] md:gap-[22px] lg:gap-[28px] xl:gap-[34px]">
            {features.map((feature: Feature, index: number) => (
              <div 
                key={index}
                className="flex items-center"
              >
                {/* Left side - Icon + Title */}
                <div className="flex items-center gap-[6px] md:gap-[8px] lg:gap-[10px] flex-shrink-0">
                  {/* Plus Icon Circle */}
                  <div 
                    className="flex items-center justify-center rounded-full border flex-shrink-0 w-[18px] h-[18px] md:w-[22px] md:h-[22px] lg:w-[28px] lg:h-[28px] xl:w-[32px] xl:h-[32px]"
                    style={{ 
                      borderWidth: '0.5px',
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      padding: '3px'
                    }}
                  >
                    <Image
                      src="/plus-sign.svg"
                      alt="Plus"
                      width={16}
                      height={16}
                      className="w-[8px] h-[8px] md:w-[11px] md:h-[11px] lg:w-[14px] lg:h-[14px] xl:w-[16px] xl:h-[16px]"
                    />
                  </div>

                  {/* Title */}
                  <h3 
                    className="text-black text-[10px] md:text-[13px] lg:text-[17px] xl:text-[20px] leading-[120%]"
                    style={{ 
                      fontFamily: 'Inter Display, sans-serif', 
                      fontWeight: 500
                    }}
                  >
                    {feature.title}
                  </h3>
                </div>

                {/* Right side - Description - pushed right with ml-auto */}
                <div 
                  className="text-black text-[7px] md:text-[9px] lg:text-[12px] xl:text-[14px] leading-[130%] text-left flex-shrink-0 ml-auto"
                  style={{ 
                    fontFamily: 'Inter Display, sans-serif', 
                    fontWeight: 400,
                    width: '280px',
                    marginRight: '20px'
                  }}
                >
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default ImageShowcase;