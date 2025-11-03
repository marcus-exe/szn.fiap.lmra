'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: number;
  priority: number;
  createdByUserId: number;
  assignedToUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function TicketDetailPage() {
  const t = useTranslations('ticketsDetail');
  const tTickets = useTranslations('tickets');
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_TICKETS || 'http://localhost:8081';
      const response = await fetch(`${API_URL}/api/tickets/${ticketId}`);
      
      if (response.ok) {
        const data = await response.json();
        setTicket(data);
      } else {
        console.error('Failed to fetch ticket');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: number) => {
    const statuses = [tTickets('statuses.open'), tTickets('statuses.inProgress'), tTickets('statuses.resolved'), tTickets('statuses.closed'), tTickets('statuses.cancelled')];
    const colors = [
      'bg-green-600 text-white',
      'bg-blue-600 text-white',
      'bg-gray-600 text-white',
      'bg-purple-600 text-white',
      'bg-red-600 text-white'
    ];
    return {
      name: statuses[status] || 'Unknown',
      color: colors[status] || 'bg-gray-600 text-white'
    };
  };

  const getPriorityInfo = (priority: number) => {
    const priorities = [tTickets('priorities.low'), tTickets('priorities.medium'), tTickets('priorities.high'), tTickets('priorities.critical')];
    const colors = [
      'bg-green-500 text-white',
      'bg-yellow-500 text-white',
      'bg-orange-500 text-white',
      'bg-red-500 text-white'
    ];
    return {
      name: priorities[priority] || 'Unknown',
      color: colors[priority] || 'bg-gray-900 text-white'
    };
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">{tTickets('loading')}</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-100 mb-4">{t('notFound')}</h1>
          <Link href="/tickets" className="text-blue-400 hover:text-blue-300 transition-colors">
            {t('backToTickets')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/tickets" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors">
          {t('backToTickets')}
        </Link>
        
        <div className="bg-black border border-white/10 rounded-lg shadow">
          <div className="p-8 border-b border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-100 mb-2">{ticket.title}</h1>
                <p className="text-gray-300 text-sm">
                  {tTickets('ticket')}{ticket.id} • {tTickets('created')} {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityInfo(ticket.priority).color}`}>
                  {getPriorityInfo(ticket.priority).name}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusInfo(ticket.status).color}`}>
                  {getStatusInfo(ticket.status).name}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">{t('description')}</h2>
            <p className="text-gray-300 mb-8 whitespace-pre-wrap">{ticket.description || t('noDescription')}</p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">{t('createdBy')}</h3>
                <p className="text-gray-100">User {ticket.createdByUserId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">{t('assignedTo')}</h3>
                <p className="text-gray-100">{ticket.assignedToUserId ? `User ${ticket.assignedToUserId}` : t('unassigned')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">{t('createdAt')}</h3>
                <p className="text-gray-100">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">{t('lastUpdated')}</h3>
                <p className="text-gray-100">{new Date(ticket.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

