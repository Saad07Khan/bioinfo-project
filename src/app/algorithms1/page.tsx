'use client';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { fadeUp, staggerContainer, staggerContainerWide, viewportOnce } from '@/lib/motion/variants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlassAlgorithmTabs from '@/components/algorithms/GlassAlgorithmTabs';
import GlassInfoCard from '@/components/algorithms/GlassInfoCard';
import GlassMutationInput from '@/components/algorithms/GlassMutationInput';
import GlassSequenceInput from '@/components/algorithms/GlassSequenceInput';

import type { AlgorithmWorkerRequest, AlgorithmWorkerResponse } from '@/lib/workers/algorithmWorker.types';
import { AlgorithmType, AlignmentResult, ScoringScheme, MutationResultSerializable } from '@/types/algorithms';
import { useAnimationStore } from '@/lib/stores/animationStore';
const LazyAlgorithmsResultsPanel = dynamic(
  () => import('@/components/algorithms/AlgorithmsResultsPanel'),
  { loading: () => null }
);

// Algorithm options
const algorithms: { id: AlgorithmType; name: string }[] = [
  { id: 'needleman-wunsch', name: 'NeedleMan Wunsch' },
  { id: 'smith-waterman', name: 'Smith-Waterman' },
  { id: 'bfs-mutation', name: 'BFS Mutation' }
];

const infoCardsData = [
  {
    title: 'Needleman-Wunsch Algorithm',
    description: 'Global alignment algorithm using dynamic programming to find optimal alignment between two complete sequences. Ideal for comparing sequences of similar length in evolutionary analysis. Widely used in bioinformatics for DNA, RNA, and protein sequence comparison.',
    image: '/prp.webp',
    glowType: 'purple' as const,
    link: 'https://en.wikipedia.org/wiki/Needleman%E2%80%93Wunsch_algorithm',
  },
  {
    title: 'Smith-Waterman Algorithm',
    description: 'Local alignment algorithm that identifies the best matching regions between sequences. Excels at finding conserved domains even within otherwise dissimilar sequences. Perfect for protein analysis, motif discovery, and identifying functional regions in genomic data.',
    image: '/card2_image.webp',
    glowType: 'blue' as const,
    link: 'https://en.wikipedia.org/wiki/Smith%E2%80%93Waterman_algorithm',
  },
  {
    title: 'BFS Mutation Algorithm',
    description: 'Graph-based algorithm using Breadth-First Search to discover the shortest mutation path between gene sequences through valid intermediate mutations. Essential for understanding drug resistance evolution and analyzing mutation pathways in genetic research.',
    image: '/prp.webp',
    glowType: 'purple' as const,
    link: 'https://en.wikipedia.org/wiki/Breadth-first_search',
  }
];

const VALID_ALGORITHMS: AlgorithmType[] = ['needleman-wunsch', 'smith-waterman', 'bfs-mutation'];

function Algorithms1Content() {
  const searchParams = useSearchParams();
  const initialAlgo = useMemo(() => {
    const param = searchParams.get('algo');
    return VALID_ALGORITHMS.includes(param as AlgorithmType)
      ? (param as AlgorithmType)
      : 'needleman-wunsch';
  }, [searchParams]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>(initialAlgo);
  const [alignmentResult, setAlignmentResult] = useState<AlignmentResult | null>(null);
  const [mutationResult, setMutationResult] = useState<MutationResultSerializable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentSeq1, setCurrentSeq1] = useState('');
  const [currentSeq2, setCurrentSeq2] = useState('');
  const [currentStartGene, setCurrentStartGene] = useState('');
  const [currentEndGene, setCurrentEndGene] = useState('');
  const [currentBank, setCurrentBank] = useState<string[]>([]);

  const setSteps = useAnimationStore((state) => state.setSteps);
  const clearAnimation = useAnimationStore((state) => state.clearAnimation);
  const workerRef = useRef<Worker | null>(null);
  const activeRequestIdRef = useRef(0);

  const algorithmNames: Record<AlgorithmType, string> = {
    'needleman-wunsch': 'Needleman-Wunsch (Global Alignment)',
    'smith-waterman': 'Smith-Waterman (Local Alignment)',
    'bfs-mutation': 'BFS Minimum Genetic Mutation'
  };

  useEffect(() => {
    try {
      const worker = new Worker(
        new URL('../../lib/workers/algorithmWorker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (event: MessageEvent<AlgorithmWorkerResponse>) => {
        const response = event.data;

        if (response.requestId !== activeRequestIdRef.current) {
          return;
        }

        if (response.status === 'error') {
          console.error('Worker computation error:', response.message);
          setIsLoading(false);
          alert('An error occurred while processing your request. Please try again.');
          return;
        }

        if (response.kind === 'align') {
          setAlignmentResult(response.alignmentResult);
          if (response.steps.length > 0) {
            setSteps(response.steps);
          }
        } else {
          setMutationResult(response.mutationResult);
          if (response.steps.length > 0) {
            setSteps(response.steps);
          }
        }

        setIsLoading(false);
      };

      worker.onerror = (event) => {
        console.error('Algorithm worker error:', event.message);
      };

      workerRef.current = worker;
    } catch (error) {
      console.warn('Falling back to main-thread algorithm execution:', error);
    }

    return () => {
      activeRequestIdRef.current += 1;
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [setSteps]);

  const getNextRequestId = () => {
    activeRequestIdRef.current += 1;
    return activeRequestIdRef.current;
  };

  const handleAlgorithmChange = useCallback((algorithm: AlgorithmType) => {
    getNextRequestId();
    setSelectedAlgorithm(algorithm);
    setAlignmentResult(null);
    setMutationResult(null);
    setShowAnimation(false);
    clearAnimation();
  }, [clearAnimation]);

  const handleAlign = useCallback((seq1: string, seq2: string, scoring: ScoringScheme) => {
    const requestId = getNextRequestId();
    setIsLoading(true);
    setAlignmentResult(null);
    setMutationResult(null);
    setShowAnimation(false);
    clearAnimation();
    setCurrentSeq1(seq1);
    setCurrentSeq2(seq2);

    if (workerRef.current) {
      const request: AlgorithmWorkerRequest = {
        requestId,
        kind: 'align',
        algorithm: selectedAlgorithm as 'needleman-wunsch' | 'smith-waterman',
        seq1,
        seq2,
        scoring
      };
      workerRef.current.postMessage(request);
      return;
    }

    void (async () => {
      try {
        const { runAlignmentTask } = await import('@/lib/algorithms/runAlgorithmTask');
        const result = runAlignmentTask(
          selectedAlgorithm as 'needleman-wunsch' | 'smith-waterman',
          seq1,
          seq2,
          scoring
        );

        if (requestId !== activeRequestIdRef.current) {
          return;
        }

        setAlignmentResult(result.alignmentResult);
        if (result.steps.length > 0) {
          setSteps(result.steps);
        }
      } catch (error) {
        if (requestId !== activeRequestIdRef.current) {
          return;
        }
        console.error('Alignment error:', error);
        alert('An error occurred during alignment. Please check your sequences.');
      } finally {
        if (requestId === activeRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    })();
  }, [selectedAlgorithm, clearAnimation, setSteps]);

  const handleMutationSolve = useCallback((startGene: string, endGene: string, bank: string[]) => {
    const requestId = getNextRequestId();
    setIsLoading(true);
    setAlignmentResult(null);
    setMutationResult(null);
    setShowAnimation(false);
    clearAnimation();
    setCurrentStartGene(startGene);
    setCurrentEndGene(endGene);
    setCurrentBank(bank);

    if (workerRef.current) {
      const request: AlgorithmWorkerRequest = {
        requestId,
        kind: 'mutate',
        startGene,
        endGene,
        bank
      };
      workerRef.current.postMessage(request);
      return;
    }

    void (async () => {
      try {
        const { runMutationTask } = await import('@/lib/algorithms/runAlgorithmTask');
        const result = runMutationTask(startGene, endGene, bank);

        if (requestId !== activeRequestIdRef.current) {
          return;
        }

        setMutationResult(result.mutationResult);
        if (result.steps.length > 0) {
          setSteps(result.steps);
        }
      } catch (error) {
        if (requestId !== activeRequestIdRef.current) {
          return;
        }
        console.error('BFS error:', error);
        alert('An error occurred during path finding. Please check your inputs.');
      } finally {
        if (requestId === activeRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    })();
  }, [clearAnimation, setSteps]);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F2F3FA 100%)' }}
    >
      {/* Navbar - unchanged from original */}
      <div className="pt-[40px] md:pt-[60px] px-4 sm:px-6 md:px-[37px]">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8 mt-[60px] md:mt-[80px]">

        {/* Page Header - UNCHANGED from original */}
        <motion.section
          className="mb-10 md:mb-14 md:pl-4 lg:pl-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-black text-[32px] md:text-[42px] lg:text-[48px] leading-[120%] mb-4"
            style={{
              fontFamily: 'Inter Display, var(--font-inter), sans-serif',
              fontWeight: 500
            }}
            variants={fadeUp}
          >
            Algorithm Visualizer
          </motion.h1>
          <motion.p
            className="text-[14px] md:text-[18px] lg:text-[20px] leading-[140%] max-w-[700px]"
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400
            }}
            variants={fadeUp}
          >
            <span className="text-black">Explore </span>
            <span style={{ color: '#0000004D' }}>sequence alignment algorithms</span>
            <span className="text-black"> and </span>
            <span style={{ color: '#0000004D' }}>graph-based mutation pathfinding</span>
            <span className="text-black"> with interactive visualizations.</span>
          </motion.p>
        </motion.section>

        {/* Algorithm Selector - Glassmorphism Tabs */}
        <motion.section
          className="mb-8 md:mb-10 relative overflow-visible md:ml-4 lg:ml-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Glow Layer - starts lower to not affect description text above */}
          <div
            className="absolute -left-10 -right-10 -bottom-10"
            style={{
              top: '50px',
              background: 'conic-gradient(from 90deg at 40.63% 50.41%, rgba(159, 115, 241, 0) -48.92deg, rgba(242, 98, 181, 0) 125.18deg, #5FC5FF 193.41deg, #FFAC89 216.02deg, #8155FF 236.07deg, #789DFF 259.95deg, rgba(159, 115, 241, 0) 311.08deg, rgba(242, 98, 181, 0) 485.18deg)',
              filter: 'blur(70px)',
              opacity: 0.5,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <GlassAlgorithmTabs
              algorithms={algorithms}
              selected={selectedAlgorithm}
              onSelect={handleAlgorithmChange}
            />
          </div>
        </motion.section>

        {/* Input & Results Section - Unified Glow Container */}
        <motion.section
          className="relative mb-8 md:mb-10 overflow-visible md:ml-4 lg:ml-8 md:max-w-[96%] lg:max-w-[94%]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Blue Glow Layer - Left Half (fixed height, starts lower) */}
          <div
            className="absolute"
            style={{
              top: '40px',
              left: '-40px',
              right: '50%',
              height: '400px',
              background: 'conic-gradient(from 90deg at 60% 50%, rgba(95, 197, 255, 0) -48.92deg, rgba(120, 157, 255, 0) 125.18deg, #5FC5FF 193.41deg, #89C4FF 216.02deg, #5596FF 236.07deg, #789DFF 259.95deg, rgba(95, 197, 255, 0) 311.08deg, rgba(120, 157, 255, 0) 485.18deg)',
              filter: 'blur(70px)',
              opacity: 0.4,
              zIndex: 0,
            }}
          />
          {/* Blue Glow Layer - Right Half (fixed height, lower opacity) */}
          <div
            className="absolute"
            style={{
              top: '40px',
              left: '50%',
              right: '-40px',
              height: '400px',
              background: 'conic-gradient(from 90deg at 50% 50%, rgba(95, 197, 255, 0) -48.92deg, rgba(120, 157, 255, 0) 125.18deg, #5FC5FF 193.41deg, #89C4FF 216.02deg, #5596FF 236.07deg, #789DFF 259.95deg, rgba(95, 197, 255, 0) 311.08deg, rgba(120, 157, 255, 0) 485.18deg)',
              filter: 'blur(70px)',
              opacity: 0.2,
              zIndex: 0,
            }}
          />

          {/* Input Container */}
          <div
            className="relative z-20 rounded-[var(--container-corner-radius)] p-6 md:p-7 lg:p-8 border border-[var(--container-divider)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.5) 100%)',
              boxShadow: 'inset 0px 1px 0px 0px rgba(255,255,255,0.8), 0px 10px 10px 0px rgba(0,0,0,0.1), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 1px 0px 0px rgba(0,0,0,0.05)',
            }}
          >
            <h2
              className="text-[16px] md:text-[18px] lg:text-[20px] text-black mb-6"
              style={{
                fontFamily: 'Inter Display, var(--font-inter), sans-serif',
                fontWeight: 500
              }}
            >
              {selectedAlgorithm === 'bfs-mutation' ? 'Configure Mutation Problem' : 'Input Sequences'}
            </h2>

            {/* Input Fields */}
            {selectedAlgorithm === 'bfs-mutation' ? (
              <GlassMutationInput onSolve={handleMutationSolve} isLoading={isLoading} />
            ) : (
              <GlassSequenceInput algorithm={selectedAlgorithm} onAlign={handleAlign} isLoading={isLoading} />
            )}
          </div>

          {/* Results Container with its own glow */}
          <AnimatePresence>
          {(alignmentResult || mutationResult) && (
            <LazyAlgorithmsResultsPanel
              selectedAlgorithm={selectedAlgorithm}
              algorithmName={algorithmNames[selectedAlgorithm]}
              alignmentResult={alignmentResult}
              mutationResult={mutationResult}
              currentSeq1={currentSeq1}
              currentSeq2={currentSeq2}
              currentStartGene={currentStartGene}
              currentEndGene={currentEndGene}
              currentBank={currentBank}
              showAnimation={showAnimation}
              onToggleAnimation={() => setShowAnimation(!showAnimation)}
              onClearResults={() => {
                setAlignmentResult(null);
                setMutationResult(null);
                setShowAnimation(false);
                clearAnimation();
              }}
            />
          )}
          </AnimatePresence>
        </motion.section>

        {/* Info Cards Section - Glassmorphism with Glow */}
        <section className="mt-32 md:mt-44 mb-16 md:mb-20 md:ml-4 lg:ml-8">
          <motion.div
            className="flex flex-wrap justify-center gap-6 md:gap-10"
            variants={staggerContainerWide}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {infoCardsData.map((card) => (
              <motion.div key={card.title} variants={fadeUp}>
                <GlassInfoCard
                  title={card.title}
                  description={card.description}
                  image={card.image}
                  glowType={card.glowType}
                  link={card.link}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer - unchanged from original */}
      <Footer />
    </div>
  );
}

export default function Algorithms1Page() {
  return (
    <Suspense>
      <Algorithms1Content />
    </Suspense>
  );
}
