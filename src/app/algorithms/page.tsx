'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import SequenceInput from '@/components/SequenceInput';
import MutationInput from '@/components/MutationInput';
import AlignmentDisplay from '@/components/AlignmentDisplay';
import MutationDisplay from '@/components/MutationDisplay';
import AnimationControls from '@/components/AnimationControls';
import MatrixVisualization from '@/components/MatrixVisualization';
import GraphVisualization from '@/components/GraphVisualization';

import { AlgorithmType, AlignmentResult, ScoringScheme, MutationResultSerializable } from '@/types/algorithms';
import { needlemanWunsch, generateNWAnimationSteps } from '@/lib/algorithms/needleman-wunsch';
import { smithWaterman, generateSWAnimationSteps } from '@/lib/algorithms/smith-waterman';
import { minGeneticMutation, toSerializableResult, generateBFSAnimationSteps } from '@/lib/algorithms/bfs-mutation';
import { useAnimationStore } from '@/lib/stores/animationStore';

export default function AlgorithmsPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('needleman-wunsch');
  const [alignmentResult, setAlignmentResult] = useState<AlignmentResult | null>(null);
  const [mutationResult, setMutationResult] = useState<MutationResultSerializable | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentSeq1, setCurrentSeq1] = useState('');
  const [currentSeq2, setCurrentSeq2] = useState('');
  const [currentStartGene, setCurrentStartGene] = useState('');
  const [currentEndGene, setCurrentEndGene] = useState('');
  const [currentBank, setCurrentBank] = useState<string[]>([]);

  const { setSteps, clearAnimation, steps } = useAnimationStore();

  const handleAlgorithmChange = (algorithm: AlgorithmType) => {
    setSelectedAlgorithm(algorithm);
    // Clear results when switching algorithms
    setAlignmentResult(null);
    setMutationResult(null);
    setShowAnimation(false);
    clearAnimation();
  };

  const handleAlign = (seq1: string, seq2: string, scoring: ScoringScheme) => {
    setIsLoading(true);
    setAlignmentResult(null);
    setCurrentSeq1(seq1);
    setCurrentSeq2(seq2);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      try {
        let result: AlignmentResult;

        if (selectedAlgorithm === 'needleman-wunsch') {
          result = needlemanWunsch(seq1, seq2, scoring);
          // Generate animation steps for small sequences
          const animSteps = generateNWAnimationSteps(seq1, seq2, scoring);
          if (animSteps.length > 0) {
            setSteps(animSteps);
          }
        } else {
          result = smithWaterman(seq1, seq2, scoring);
          // Generate animation steps for small sequences
          const animSteps = generateSWAnimationSteps(seq1, seq2, scoring);
          if (animSteps.length > 0) {
            setSteps(animSteps);
          }
        }

        setAlignmentResult(result);
        console.log('Alignment result:', result);
      } catch (error) {
        console.error('Alignment error:', error);
        alert('An error occurred during alignment. Please check your sequences.');
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  const handleMutationSolve = (startGene: string, endGene: string, bank: string[]) => {
    setIsLoading(true);
    setMutationResult(null);
    setCurrentStartGene(startGene);
    setCurrentEndGene(endGene);
    setCurrentBank(bank);

    setTimeout(() => {
      try {
        const result = minGeneticMutation(startGene, endGene, bank);
        const serializableResult = toSerializableResult(result);
        setMutationResult(serializableResult);

        // Generate BFS animation steps
        const animSteps = generateBFSAnimationSteps(startGene, endGene, bank);
        if (animSteps.length > 0) {
          setSteps(animSteps);
        }

        console.log('Mutation result:', serializableResult);
      } catch (error) {
        console.error('BFS error:', error);
        alert('An error occurred during path finding. Please check your inputs.');
      } finally {
        setIsLoading(false);
      }
    }, 50);
  };

  const algorithmNames: Record<AlgorithmType, string> = {
    'needleman-wunsch': 'Needleman-Wunsch (Global Alignment)',
    'smith-waterman': 'Smith-Waterman (Local Alignment)',
    'bfs-mutation': 'BFS Minimum Genetic Mutation'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar with custom spacing */}
      <div className="pt-[40px] md:pt-[60px] px-[37px]">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-[900px] lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 md:px-8 mt-[60px] md:mt-[80px]">
        {/* Page Header */}
        <section className="mb-10 md:mb-14">
          <h1
            className="text-black text-[32px] md:text-[42px] lg:text-[52px] leading-[120%] mb-4"
            style={{
              fontFamily: 'Inter Display, var(--font-inter), sans-serif',
              fontWeight: 500
            }}
          >
            Algorithm Visualizer
          </h1>
          <p
            className="text-[14px] md:text-[18px] lg:text-[22px] leading-[140%] max-w-[700px]"
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 400
            }}
          >
            <span className="text-black">Explore </span>
            <span style={{ color: '#0000004D' }}>sequence alignment algorithms</span>
            <span className="text-black"> and </span>
            <span style={{ color: '#0000004D' }}>graph-based mutation pathfinding</span>
            <span className="text-black"> with interactive visualizations.</span>
          </p>
        </section>

        {/* Algorithm Selector */}
        <section className="mb-8 md:mb-10">
          <AlgorithmSelector
            selected={selectedAlgorithm}
            onSelect={handleAlgorithmChange}
          />
        </section>

        {/* Input Section */}
        <section
          className="rounded-[15px] md:rounded-[22px] lg:rounded-[28px] p-6 md:p-8 lg:p-10 mb-8 md:mb-10"
          style={{
            background: '#FAFAFA',
            border: '1px solid #E5E5E5'
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

          {selectedAlgorithm === 'bfs-mutation' ? (
            <MutationInput
              onSolve={handleMutationSolve}
              isLoading={isLoading}
            />
          ) : (
            <SequenceInput
              algorithm={selectedAlgorithm}
              onAlign={handleAlign}
              isLoading={isLoading}
            />
          )}
        </section>

        {/* Results Section */}
        {(alignmentResult || mutationResult) && (
          <section className="mb-16 md:mb-20">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-[16px] md:text-[18px] lg:text-[20px] text-black"
                style={{
                  fontFamily: 'Inter Display, var(--font-inter), sans-serif',
                  fontWeight: 500
                }}
              >
                Results
              </h2>
              <div className="flex items-center gap-4">
                {steps.length > 0 && (
                  <button
                    onClick={() => setShowAnimation(!showAnimation)}
                    className={`
                      text-[12px] md:text-[13px] px-3 py-1.5 rounded-full transition-colors
                      ${showAnimation
                        ? 'bg-violet-600 text-white'
                        : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                      }
                    `}
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                  >
                    {showAnimation ? 'Hide Animation' : 'Show Animation'}
                  </button>
                )}
                <button
                  onClick={() => {
                    setAlignmentResult(null);
                    setMutationResult(null);
                    setShowAnimation(false);
                    clearAnimation();
                  }}
                  className="text-[12px] md:text-[13px] text-gray-500 hover:text-gray-700 transition-colors"
                  style={{ fontFamily: 'var(--font-inter), sans-serif' }}
                >
                  Clear Results
                </button>
              </div>
            </div>

            {/* Animation Section */}
            {showAnimation && steps.length > 0 && (
              <div className="mb-8">
                <div
                  className="rounded-[15px] md:rounded-[22px] p-6 md:p-8 mb-6"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E5E5' }}
                >
                  <h3
                    className="text-[14px] md:text-[16px] text-black mb-4"
                    style={{
                      fontFamily: 'Inter Display, var(--font-inter), sans-serif',
                      fontWeight: 500
                    }}
                  >
                    Step-by-Step Visualization
                  </h3>

                  {/* Animation Controls */}
                  <div className="mb-6">
                    <AnimationControls />
                  </div>

                  {/* Matrix Visualization for alignment algorithms */}
                  {(selectedAlgorithm === 'needleman-wunsch' || selectedAlgorithm === 'smith-waterman') && currentSeq1 && currentSeq2 && (
                    <div className="mt-6 p-4 bg-white rounded-[12px] border border-gray-200">
                      <h4
                        className="text-[13px] text-gray-600 mb-4"
                        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                      >
                        Dynamic Programming Matrix
                      </h4>
                      <MatrixVisualization seq1={currentSeq1} seq2={currentSeq2} />
                    </div>
                  )}

                  {/* Graph Visualization for BFS */}
                  {selectedAlgorithm === 'bfs-mutation' && currentStartGene && currentEndGene && (
                    <div className="mt-6 p-4 bg-white rounded-[12px] border border-gray-200">
                      <h4
                        className="text-[13px] text-gray-600 mb-4"
                        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
                      >
                        BFS Graph Exploration
                      </h4>
                      <GraphVisualization
                        startGene={currentStartGene}
                        endGene={currentEndGene}
                        bank={currentBank}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {alignmentResult && (
              <AlignmentDisplay
                result={alignmentResult}
                algorithmName={algorithmNames[selectedAlgorithm]}
              />
            )}

            {mutationResult && (
              <MutationDisplay result={mutationResult} />
            )}
          </section>
        )}

        {/* Info Section */}
        <section className="mb-16 md:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              title="Needleman-Wunsch"
              description="Global alignment algorithm that finds the optimal alignment between two complete sequences using dynamic programming. Best for comparing sequences of similar length."
              use="Comparing orthologous genes, evolutionary analysis"
            />
            <InfoCard
              title="Smith-Waterman"
              description="Local alignment algorithm that identifies the best matching region between two sequences. Finds conserved domains even in otherwise dissimilar sequences."
              use="Finding functional domains, protein motif discovery"
            />
            <InfoCard
              title="BFS Mutation"
              description="Graph-based algorithm using Breadth-First Search to find the shortest mutation path between two gene sequences through a bank of valid intermediates."
              use="Understanding mutation pathways, drug resistance evolution"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function InfoCard({
  title,
  description,
  use
}: {
  title: string;
  description: string;
  use: string;
}) {
  return (
    <div
      className="rounded-[15px] md:rounded-[20px] p-5 md:p-6 bg-white border border-gray-200 hover:border-violet-300 hover:shadow-sm transition-all duration-300"
    >
      <h3
        className="text-[14px] md:text-[15px] text-black mb-3"
        style={{
          fontFamily: 'Inter Display, var(--font-inter), sans-serif',
          fontWeight: 600
        }}
      >
        {title}
      </h3>
      <p
        className="text-[12px] md:text-[13px] text-gray-600 leading-[150%] mb-4"
        style={{ fontFamily: 'var(--font-inter), sans-serif' }}
      >
        {description}
      </p>
      <div
        className="text-[11px] text-violet-600 pt-3 border-t border-gray-100"
        style={{ fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500 }}
      >
        Use case: {use}
      </div>
    </div>
  );
}
