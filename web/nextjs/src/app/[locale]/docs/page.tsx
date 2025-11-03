'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DocsPage() {
  const t = useTranslations('docs');
  const tCommon = useTranslations('common');
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors">
          {tCommon('backToHome')}
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-100 mb-8">{t('title')}</h1>
        <p className="text-xl text-gray-300 mb-8">
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black rounded-lg shadow p-6 border border-white/10 hover:bg-black/80 transition-all">
            <h2 className="text-2xl font-semibold mb-3 text-gray-100">{t('migrationPlaybook.title')}</h2>
            <p className="text-gray-300 mb-4">
              {t('migrationPlaybook.description')}
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>✓ {t('migrationPlaybook.items.java')}</li>
              <li>✓ {t('migrationPlaybook.items.net')}</li>
              <li>✓ {t('migrationPlaybook.items.frontend')}</li>
              <li>✓ {t('migrationPlaybook.items.android')}</li>
            </ul>
          </div>

          <div className="bg-black rounded-lg shadow p-6 border border-white/10 hover:bg-black/80 transition-all">
            <h2 className="text-2xl font-semibold mb-3 text-gray-100">{t('architectureDecisions.title')}</h2>
            <p className="text-gray-300 mb-4">
              {t('architectureDecisions.description')}
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>{t('architectureDecisions.items.adr1')}</li>
              <li>{t('architectureDecisions.items.adr2')}</li>
              <li>{t('architectureDecisions.items.adr3')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-black rounded-lg shadow p-8 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">{t('quickStart.title')}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">{t('quickStart.prerequisites.title')}</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>{t('quickStart.prerequisites.docker')}</li>
                <li>{t('quickStart.prerequisites.git')}</li>
                <li>{t('quickStart.prerequisites.postgres')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">{t('quickStart.running.title')}</h3>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-white/10">
                docker-compose up -d
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">{t('quickStart.accessPoints.title')}</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>{t('quickStart.accessPoints.web')}</li>
                <li>{t('quickStart.accessPoints.users')}</li>
                <li>{t('quickStart.accessPoints.tickets')}</li>
                <li>{t('quickStart.accessPoints.ai')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-100">{t('quickStart.architecture.title')}</h3>
              <p className="text-gray-300">
                {t('quickStart.architecture.description')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                <li><strong>{t('quickStart.architecture.usersService')}</strong></li>
                <li><strong>{t('quickStart.architecture.ticketsService')}</strong></li>
                <li><strong>{t('quickStart.architecture.aiGateway')}</strong></li>
                <li><strong>{t('quickStart.architecture.webFrontend')}</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-black border border-white/10 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">{t('learnMore.title')}</h3>
          <p className="text-gray-300">
            {t('learnMore.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
