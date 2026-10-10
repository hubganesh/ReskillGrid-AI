import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReskillGrid AI — Map your skills. Close the gaps. Prove your readiness.',
  description: 'An agentic AI platform that converts academic and practical experience into a dynamic skill grid and evidence-based reskilling plan aligned with real industry requirements.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
