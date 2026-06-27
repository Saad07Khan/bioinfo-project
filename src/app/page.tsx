'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
import Navbar from '@/components/Navbar';
import ImageShowcase from '@/components/ImageShowcase';
import CTASection from '@/components/CTAsection';
import Footer from '@/components/Footer';
import {
  fadeUp,
  scaleIn,
  staggerContainer,
  viewportOnce,
} from '@/lib/motion/variants';

const timelineItems = [
  {
    id: 1,
    description: "Global alignment to find optimal matches across sequences"
  },
  {
    id: 2,
    description: "Local alignment identifying conserved regions"
  },
  {
    id: 3,
    description: "Direct NCBI database integration"
  },
  {
    id: 4,
    description: "Step-by-step matrix animation"
  },
  {
    id: 5,
    description: "Handles sequences up to 5,000 base pairs"
  }
];

const heroLogos = [
  {
    src: '/ddbj_logo.webp',
    alt: 'DDBJ',
    width: 100,
    height: 26,
    className: 'w-[50px] md:w-[75px] lg:w-[100px]'
  },
  {
    src: '/swissprot_logo.webp',
    alt: 'SwissProt',
    width: 104,
    height: 60,
    className: 'w-[52px] md:w-[78px] lg:w-[104px]'
  },
  {
    src: '/ncbi_logo.webp',
    alt: 'NCBI',
    width: 104,
    height: 24,
    className: 'w-[52px] md:w-[78px] lg:w-[104px]'
  },
  {
    src: '/uniprot_logo.webp',
    alt: 'UniProt',
    width: 108,
    height: 60,
    className: 'w-[54px] md:w-[81px] lg:w-[108px]'
  }
] as const;

const AlgorithmsSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section 
      className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8 mt-[120px] md:mt-[160px] lg:mt-[200px]"
    >
      {/* Top Section - Button and Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
        {/* Launch visualizer button */}
        <Link
          href="/algorithms1"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-black transition-all duration-200 hover:opacity-80 active:scale-95 no-underline"
          style={{ borderWidth: '0.5px' }}
        >
          <span
            className="text-black text-[10px] md:text-[12px] lg:text-[14px] leading-[120%]"
            style={{
              fontFamily: 'Inter Display, sans-serif',
              fontWeight: 500
            }}
          >
            Launch visualizer
          </span>
        </Link>

        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <h2
            className="text-black text-[28px] md:text-[42px] lg:text-[56px] xl:text-[64px] leading-[120%] text-right"
            style={{
              fontFamily: 'Inter Display, sans-serif',
              fontWeight: 500
            }}
          >
            The Algorithms Behind<br />Our Visualizations
          </h2>
        </motion.div>
      </div>

      {/* Description Paragraph with mixed colors - Increased size */}
      <motion.div
        className="max-w-[310px] md:max-w-[450px] lg:max-w-[600px] xl:max-w-[700px] mb-12 md:mb-16 lg:mb-20"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <p
          className="text-[13px] md:text-[18px] lg:text-[24px] xl:text-[28px] leading-[120%]"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500
          }}
        >
          <span className="text-black">Pioneering </span>
          <span style={{ color: '#0000004D' }}>bioinformatics education</span>
          <span className="text-black">, we leverage proven algorithms, from </span>
          <span style={{ color: '#0000004D' }}>dynamic programming</span>
          <span className="text-black"> to </span>
          <span style={{ color: '#0000004D' }}>real-time visualization</span>
          <span className="text-black">.</span>
        </p>
      </motion.div>

      {/* Timeline Component - Full width to match heading */}
      <div className="relative w-full">
        {/* Timeline Line - extends full width with dots centered */}
        <div className="relative w-full h-[1px] bg-gray-300 rounded-full mb-8 md:mb-10">
          {/* Dots container - positioned at 93% width so line extends beyond, centered on line */}
          <div className="absolute top-1/2 left-0 flex items-center justify-between" style={{ width: '93%', transform: 'translateY(-50%)' }}>
            {timelineItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveStep(index)}
                className="relative flex items-center justify-center cursor-pointer group z-10"
                style={{ 
                  width: activeStep === index ? '20px' : '12px',
                  height: activeStep === index ? '20px' : '12px'
                }}
                aria-label={`Timeline step ${index + 1}`}
              >
                {/* Active state - blue glow */}
                {activeStep === index ? (
                  <>
                    <div 
                      className="absolute w-[20px] h-[20px] md:w-[28px] md:h-[28px] lg:w-[36px] lg:h-[36px] rounded-full transition-all duration-300"
                      style={{ 
                        background: 'rgba(96, 153, 221, 0.2)',
                        backdropFilter: 'blur(2px)'
                      }}
                    />
                    <motion.div
                      layoutId="activeDot"
                      className="absolute w-[12px] h-[12px] md:w-[16px] md:h-[16px] rounded-full transition-all duration-300"
                      style={{ background: '#6099DD' }}
                    />
                  </>
                ) : (
                  // Inactive state - grey dot
                  <div 
                    className="w-[8px] h-[8px] md:w-[10px] md:h-[10px] rounded-full bg-gray-400 transition-all duration-300 group-hover:bg-gray-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Descriptions - matches dots width */}
        <div className="flex items-start justify-between gap-4 md:gap-6 lg:gap-8" style={{ width: '93%' }}>
          {timelineItems.map((item, index) => (
            <div 
              key={item.id}
              className="flex-1"
              style={{ maxWidth: '220px' }}
            >
              <motion.p
                className={`text-[9px] md:text-[12px] lg:text-[14px] xl:text-[15px] leading-[120%] transition-colors duration-300`}
                style={{
                  fontFamily: 'Inter Display, sans-serif',
                  fontWeight: 400
                }}
                animate={{ color: activeStep === index ? '#000000' : '#0000004D' }}
                transition={{ duration: 0.3 }}
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>

        {/* Mobile indicator */}
        <div className="md:hidden text-center mt-6">
          <span className="text-gray-500 text-sm">
            {activeStep + 1} / {timelineItems.length}
          </span>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with custom spacing for home page */}
      <div className="pt-[40px] md:pt-[60px] px-[37px]">
        <Navbar />
      </div>

      {/* Hero Section */}
      <main className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8 mt-[80px] md:mt-[120px]">
        <div className="mx-auto">
          {/* Two column layout */}
          <div className="flex flex-col md:flex-row gap-[30px] lg:gap-[50px] xl:gap-[60px]">
            
            {/* Left Side Frame */}
            <div className="w-full md:w-[56%] lg:w-[55%] flex flex-col md:pl-6 lg:pl-10">
              <h1 className="sr-only">Gene Analysis</h1>
              <p className="sr-only">For researchers and students exploring DNA alignment.</p>

              {/* Content container */}
              <motion.div
                className="w-full flex flex-col gap-[5px]"
                aria-hidden="true"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >

                {/* Top section with image and Gene Analysis */}
                <motion.div className="flex items-center gap-[15px] md:gap-[20px] flex-wrap md:flex-nowrap" variants={fadeUp}>
                  {/* Image with rounded border */}
                  <motion.div
                    className="w-[120px] md:w-[150px] lg:w-[180px] h-[50px] md:h-[62px] lg:h-[74px] rounded-[65px] overflow-hidden flex-shrink-0"
                    variants={scaleIn}
                  >
                    <Image
                      src="/rectangle.webp"
                      alt="Gene"
                      width={180}
                      height={74}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Gene Analysis Text */}
                  <div
                    className="text-[38px] md:text-[48px] lg:text-[58px] leading-[120%] text-black m-0 whitespace-nowrap"
                    style={{ fontFamily: 'Balthazar, serif', fontWeight: 400 }}
                  >
                    Gene Analysis
                  </div>
                </motion.div>

                {/* For researchers and */}
                <motion.div variants={fadeUp}>
                  <p
                    className="text-[38px] md:text-[48px] lg:text-[58px] leading-[120%] text-black m-0"
                    style={{ fontFamily: 'Balthazar, serif', fontWeight: 400 }}
                  >
                    For researchers and
                  </p>
                </motion.div>

                {/* Frame with students and Who are we button */}
                <motion.div className="flex items-center gap-[12px] md:gap-[16px] h-auto flex-wrap md:flex-nowrap" variants={fadeUp}>
                  {/* students text */}
                  <span
                    className="text-[38px] md:text-[48px] lg:text-[58px] leading-[120%] text-black"
                    style={{ fontFamily: 'Balthazar, serif', fontWeight: 400 }}
                  >
                    students
                  </span>

                  {/* Who are we button */}
                  <button
                    className="flex items-center gap-[6px] md:gap-[8px] px-[14px] md:px-[18px] py-[10px] md:py-[12px] rounded-[84px] border border-black transition-all duration-200 hover:opacity-80 active:scale-95 flex-shrink-0"
                    style={{ borderWidth: '0.47px' }}
                  >
                    <Image
                      src="/play.svg"
                      alt="Play"
                      width={16}
                      height={16}
                      className="w-4 h-4 md:w-5 md:h-5"
                    />
                    <span
                      className="text-black leading-[120%] whitespace-nowrap text-[11px] md:text-[13px]"
                      style={{
                        fontFamily: 'Istok Web, sans-serif',
                        fontWeight: 400
                      }}
                    >
                      Who are we?
                    </span>
                  </button>
                </motion.div>

                {/* exploring DNA */}
                <motion.div variants={fadeUp}>
                  <p
                    className="text-[38px] md:text-[48px] lg:text-[58px] leading-[120%] text-black m-0"
                    style={{ fontFamily: 'Balthazar, serif', fontWeight: 400 }}
                  >
                    exploring DNA
                  </p>
                </motion.div>

                {/* alignment */}
                <motion.div variants={fadeUp}>
                  <p
                    className="text-[38px] md:text-[48px] lg:text-[58px] leading-[120%] text-black m-0"
                    style={{ fontFamily: 'Balthazar, serif', fontWeight: 400 }}
                  >
                    alignment
                  </p>
                </motion.div>

              </motion.div>

              {/* Contact Us Button with Arrow */}
              <motion.div
                className="flex items-center gap-[6px] md:gap-[8px] mt-10 md:mt-14 lg:mt-16"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Contact us button */}
                <button 
                  className="flex items-center gap-[6px] rounded-[56px] pl-[12px] md:pl-[16px] pr-[6px] md:pr-[8px] py-[8px] md:py-[10px] transition-all duration-200 hover:opacity-80 active:scale-95"
                  style={{ backgroundColor: '#6099DD' }}
                >
                  <span 
                    className="text-white leading-[150%] text-[12px] md:text-[14px] lg:text-[16px]"
                    style={{ 
                      fontFamily: 'var(--font-poppins)', 
                      fontWeight: 500
                    }}
                  >
                    Contact us
                  </span>
                  
                  {/* White circle with arrow */}
                  <div className="w-[32px] h-[32px] md:w-[38px] md:h-[38px] rounded-full bg-white flex items-center justify-center p-[5px] md:p-[6px]">
                    <Image
                      src="/arrow-up-right-01.svg"
                      alt="Arrow"
                      width={24}
                      height={24}
                      className="w-full h-full"
                    />
                  </div>
                </button>
              </motion.div>

              {/* Description and Logos Section */}
              <div className="mt-8 md:mt-10 lg:mt-12 w-full max-w-[305px] md:max-w-[450px] lg:max-w-[650px]">
                {/* Description text */}
                <p 
                  className="text-black leading-[140%] mb-[15px] md:mb-[20px] lg:mb-[25px] text-[12px] md:text-[15px] lg:text-[18px]"
                  style={{ 
                    fontFamily: 'Istok Web, sans-serif', 
                    fontWeight: 400
                  }}
                >
                  Visualize genetic similarities with Needleman-Wunsch and Smith-Waterman algorithms
                </p>

                {/* Logos container */}
                <div className="logo-marquee-wrapper overflow-hidden relative">
                  <div className="logo-marquee-track">
                    {[0, 1].map((copyIndex) => (
                      <div
                        key={copyIndex}
                        className="logo-marquee-group"
                        aria-hidden={copyIndex === 1}
                      >
                        {heroLogos.map((logo) => (
                          <div
                            key={`${copyIndex}-${logo.alt}`}
                            className={`${logo.className} h-auto relative flex-shrink-0`}
                          >
                            <Image
                              src={logo.src}
                              alt={logo.alt}
                              width={logo.width}
                              height={logo.height}
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side Frame */}
            <div className="w-full md:w-[44%] lg:w-[45%] flex flex-col gap-[11px] md:gap-[18px] lg:gap-[24px]">
              
              {/* Blue Picture Card with overlays */}
              <Link href="/algorithms1" className="block">
                <motion.div
                  className="relative w-full h-[200px] md:h-[280px] lg:h-[360px] rounded-[15px] md:rounded-[22px] lg:rounded-[28px] overflow-hidden"
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Background Image */}
                  <Image
                    src="/blue_pic.webp"
                    alt="DNA Sequence"
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 p-[11px] md:p-[20px] lg:p-[28px] flex flex-col justify-between">

                    {/* Top Heading Box */}
                    <div className="w-full">
                      <h2
                        className="text-white leading-[120%] text-[18px] md:text-[28px] lg:text-[38px] m-0"
                        style={{
                          fontFamily: 'Istok Web, sans-serif',
                          fontWeight: 400,
                          letterSpacing: '-3%'
                        }}
                      >
                        If you&apos;re ready to explore sequence alignment, let&apos;s get started
                      </h2>
                    </div>

                    {/* Bottom Section - Description + Button */}
                    <div className="w-full flex items-end justify-between gap-[12px] md:gap-[16px]">
                      {/* Description Text */}
                      <p
                        className="text-white leading-[130%] text-[9px] md:text-[13px] lg:text-[17px] m-0 max-w-[65%]"
                        style={{
                          fontFamily: 'Istok Web, sans-serif',
                          fontWeight: 400
                        }}
                      >
                        Compare DNA sequences from NCBI, upload your own FASTA files, or try curated examples from real research. Watch the algorithm work step-by-step.
                      </p>

                      {/* White Circular Arrow Icon */}
                      <motion.span
                        className="flex-shrink-0 w-[34px] h-[34px] md:w-[52px] md:h-[52px] lg:w-[68px] lg:h-[68px] rounded-full bg-white flex items-center justify-center p-[4px] md:p-[6px] lg:p-[8px] transition-all duration-200 hover:opacity-80"
                        aria-hidden="true"
                        whileHover={{ scale: 1.08, rotate: 6 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        <Image
                          src="/arrow-up-right-01.svg"
                          alt=""
                          width={32}
                          height={32}
                          className="w-full h-full"
                        />
                      </motion.span>
                    </div>

                  </div>
                </motion.div>
              </Link>

              {/* Two Card Container - Purple and Pink */}
              <motion.div
                className="w-full flex gap-[11px] md:gap-[18px] lg:gap-[24px]"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                
                {/* Purple Card - Needleman-Wunsch */}
                <Link href="/algorithms1?algo=needleman-wunsch" className="block w-1/2">
                  <motion.div
                    className="relative w-full h-[200px] md:h-[280px] lg:h-[360px] rounded-[15px] md:rounded-[22px] lg:rounded-[28px] overflow-hidden"
                    variants={scaleIn}
                  >
                    {/* Background Image */}
                    <Image
                      src="/purple_pic.webp"
                      alt="Needleman-Wunsch Algorithm"
                      fill
                      className="object-cover"
                    />

                    {/* Top-right small arrow */}
                    <div className="absolute top-[7px] md:top-[12px] lg:top-[16px] right-[7px] md:right-[12px] lg:right-[16px]">
                      <motion.span
                        className="w-[20px] h-[20px] md:w-[32px] md:h-[32px] lg:w-[44px] lg:h-[44px] rounded-full bg-white flex items-center justify-center p-[4px] md:p-[5px] lg:p-[6px] transition-all duration-200 hover:opacity-80"
                        aria-hidden="true"
                        whileHover={{ scale: 1.08, rotate: 6 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        <Image
                          src="/arrow-up-right-01.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="w-full h-full"
                        />
                      </motion.span>
                    </div>

                    {/* Bottom overlay with text */}
                    <div className="absolute bottom-0 left-0 right-0 p-[7px] md:p-[14px] lg:p-[20px] flex flex-col gap-[4px] md:gap-[6px]">
                      <h3
                        className="text-white leading-[120%] text-[11px] md:text-[17px] lg:text-[23px] m-0"
                        style={{
                          fontFamily: 'Istok Web, sans-serif',
                          fontWeight: 400,
                          letterSpacing: '-3%'
                        }}
                      >
                        Needleman-Wunsch Visualization
                      </h3>
                      <p
                        className="text-white leading-[130%] text-[7px] md:text-[11px] lg:text-[14px] m-0"
                        style={{
                          fontFamily: 'Istok Web, sans-serif',
                          fontWeight: 400
                        }}
                      >
                        Find the optimal alignment between two complete sequences. Perfect for comparing related genes across species
                      </p>
                    </div>
                  </motion.div>
                </Link>

                {/* Pink Card - Smith-Waterman */}
                <Link href="/algorithms1?algo=smith-waterman" className="block w-1/2">
                  <motion.div
                    className="relative w-full h-[200px] md:h-[280px] lg:h-[360px] rounded-[15px] md:rounded-[22px] lg:rounded-[28px] overflow-hidden"
                    variants={scaleIn}
                  >
                    {/* Background Image */}
                    <Image
                      src="/pink_pic.webp"
                      alt="Smith-Waterman Algorithm"
                      fill
                      className="object-cover"
                    />

                    {/* Top-right small arrow */}
                    <div className="absolute top-[7px] md:top-[12px] lg:top-[16px] right-[7px] md:right-[12px] lg:right-[16px]">
                      <motion.span
                        className="w-[20px] h-[20px] md:w-[32px] md:h-[32px] lg:w-[44px] lg:h-[44px] rounded-full bg-white flex items-center justify-center p-[4px] md:p-[5px] lg:p-[6px] transition-all duration-200 hover:opacity-80"
                        aria-hidden="true"
                        whileHover={{ scale: 1.08, rotate: 6 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        <Image
                          src="/arrow-up-right-01.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="w-full h-full"
                        />
                      </motion.span>
                    </div>

                    {/* Bottom overlay with text */}
                    <div className="absolute bottom-0 left-0 right-0 p-[7px] md:p-[14px] lg:p-[20px] flex flex-col gap-[4px] md:gap-[6px]">
                      <h3
                        className="text-white leading-[120%] text-[11px] md:text-[17px] lg:text-[23px] m-0"
                        style={{
                          fontFamily: 'Istok Web, sans-serif',
                          fontWeight: 400,
                          letterSpacing: '-3%'
                        }}
                      >
                        Smith-Waterman Visualization
                      </h3>
                      <p
                        className="text-white leading-[130%] text-[7px] md:text-[11px] lg:text-[14px] m-0"
                        style={{
                          fontFamily: 'Istok Web, sans-serif',
                          fontWeight: 400
                        }}
                      >
                        Discover conserved regions and functional domains within longer sequences. Ideal for protein motif analysis.
                      </p>
                    </div>
                  </motion.div>
                </Link>

              </motion.div>

            </div>

          </div>

        </div>
      </main>

      {/* Algorithms Section */}
      <AlgorithmsSection />
      
      {/* Image Showcase */}
      <ImageShowcase />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
