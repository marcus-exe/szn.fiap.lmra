'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import DNAAnimation from '@/components/DNAAnimation';

export default function Home() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          {t('subtitle')}
        </p>

        <DNAAnimation />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/tickets"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">{t('tickets')}</h2>
            <p className="text-gray-300">
              {t('ticketsDesc')}
            </p>
          </Link>

          <Link 
            href="/users"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">{t('users')}</h2>
            <p className="text-gray-300">
              {t('usersDesc')}
            </p>
          </Link>

          <Link 
            href="/ai"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">{t('ai')}</h2>
            <p className="text-gray-300">
              {t('aiDesc')}
            </p>
          </Link>

          <Link 
            href="/modernize"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">{t('modernize')}</h2>
            <p className="text-gray-300">
              {t('modernizeDesc')}
            </p>
          </Link>

          <Link 
            href="/docs"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">{t('docs')}</h2>
            <p className="text-gray-300">
              {t('docsDesc')}
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-black border border-white/10 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Backend:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Java (Spring Boot 3)</li>
                <li>C# (.NET 8)</li>
                <li>Node.js</li>
              </ul>
            </div>
            <div>
              <strong>Frontend:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Next.js 14</li>
                <li>React 18</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <strong>Database:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>PostgreSQL 16</li>
              </ul>
            </div>
            <div>
              <strong>Infrastructure:</strong>
              <ul className="list-disc list-inside mt-1">
                <li>Docker</li>
                <li>AWS</li>
                <li>Terraform</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

