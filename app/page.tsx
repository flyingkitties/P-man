import Board from '@/components/Board';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className=" h-screen">
      {/* Header */}
      <Header />
      {/* Board */}
      <Board />
    </main>
  );
}
