import Modal from '@/components/Modal';
import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/auth/Providers';

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
      <body
        className="min-h-[1500px] md:min-h-0 bg-gradient-to-br from-purple-400/70 via-[#FFF3DA]
       to-pink-300/70 "
      >
        <Providers>
          {children}
          <Modal />
        </Providers>
      </body>
    </html>
  );
}
