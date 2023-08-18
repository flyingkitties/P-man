import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'P-Man',
  description: 'Helping you manage all your projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-400/70 via-[#FFF3DA] to-pink-300/70">
        {children}
      </body>
    </html>
  );
}
