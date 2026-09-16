import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'CareerVerse AI - Next-Gen Career Navigation',
  description: 'AI Career Counseling, College Predictor, Placement Advisor, and Future Job Analyzer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Outfit:wght@400;600;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen relative bg-cosmic-dark text-slate-100 overflow-x-hidden">
        {/* Animated Background Star Particles */}
        <div className="fixed inset-0 stars-overlay pointer-events-none z-0" />
        <div className="fixed inset-0 bg-cosmic-glow pointer-events-none z-0" />

        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
