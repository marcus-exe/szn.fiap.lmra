import type { Metadata } from 'next';
// import { Arimo } from 'next/font/google';
import './globals.css';
import RollingSlider from '@/components/RollingSlider';
import Footer from '@/components/Footer';

// const arimo = Arimo({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LMRA - Legacy Modernization Reference Application',
  description: 'Modernize legacy codebases with modern technologies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <div className="mt-auto">
            <RollingSlider />
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
