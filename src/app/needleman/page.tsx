import Navbar from '@/components/Navbar';

export default function NeedlemanPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Needleman-Wunsch Algorithm</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">This page will implement the Needleman-Wunsch algorithm for global sequence alignment.</p>
        </div>
      </main>
    </div>
  );
}
