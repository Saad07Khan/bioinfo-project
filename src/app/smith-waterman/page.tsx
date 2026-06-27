import Navbar from '@/components/Navbar';

export default function SmithWatermanPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Smith-Waterman Algorithm</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="font-prompt">Test Prompt Font</div>
<div className="font-poppins">Test Poppins Font</div>
<div style={{ fontFamily: 'var(--font-prompt)' }}>Direct CSS Variable Prompt</div>
<div style={{ fontFamily: 'var(--font-poppins)' }}>Direct CSS Variable Poppins</div>
          <p className="text-gray-600">This page will implement the Smith-Waterman algorithm for local sequence alignment.</p>
          
        </div>
      </main>
    </div>
  );
}
