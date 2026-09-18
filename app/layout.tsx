import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono', // mapped to match config
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Executive Productivity Agent | Arjun Malhotra (VP Sales)',
  description: 'AI-Powered Reconciled Commitment Engine, Grounded Action Briefs & Executive Q&A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="min-h-screen bg-canvas-white text-charcoal font-inter antialiased selection:bg-electric-blue selection:text-canvas-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
