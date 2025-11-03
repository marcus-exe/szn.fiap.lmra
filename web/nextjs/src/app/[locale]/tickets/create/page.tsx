'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CreateTicketPage() {
  const t = useTranslations('ticketsCreate');
  const tCommon = useTranslations('common');
  const tTickets = useTranslations('tickets');
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    createdByUserId: 1
  });
  
  const priorityMap: Record<string, number> = {
    [tTickets('priorities.low')]: 0,
    [tTickets('priorities.medium')]: 1,
    [tTickets('priorities.high')]: 2,
    [tTickets('priorities.critical')]: 3
  };
  
  const priorityValueMap: Record<string, number> = {
    'Low': 0,
    'Medium': 1,
    'High': 2,
    'Critical': 3
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_TICKETS || 'http://localhost:8081';
      const response = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: priorityValueMap[formData.priority as keyof typeof priorityValueMap],
          createdByUserId: formData.createdByUserId
        }),
      });

      if (response.ok) {
        const ticket = await response.json();
        router.push(`/tickets/${ticket.id}`);
      } else {
        alert(t('error'));
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/tickets" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors">
          {t('backToTickets')}
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-100 mb-8">{t('title')}</h1>
        
        <form onSubmit={handleSubmit} className="bg-black border border-white/10 rounded-lg shadow p-8">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              {t('titleLabel')} *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('titlePlaceholder')}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              {t('description')}
            </label>
            <textarea
              id="description"
              rows={8}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('descriptionPlaceholder')}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
              {t('priority')}
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="Low">{tTickets('priorities.low')}</option>
              <option value="Medium">{tTickets('priorities.medium')}</option>
              <option value="High">{tTickets('priorities.high')}</option>
              <option value="Critical">{tTickets('priorities.critical')}</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('creating') : t('createButton')}
            </button>
            <Link
              href="/tickets"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              {tCommon('cancel')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

