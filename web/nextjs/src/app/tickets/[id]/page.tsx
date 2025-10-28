'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
    const statuses = ['Open', 'InProgress', 'Resolved', 'Closed', 'Cancelled'];
    const colors = [
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800',
      'bg-gray-100 text-gray-800',
      'bg-purple-100 text-purple-800',
      'bg-red-100 text-red-800'
    ];
    return {
      name: statuses[status] || 'Unknown',
      color: colors[status] || 'bg-gray-100 text-gray-800'
    };
  };

  const getPriorityInfo = (priority: number) => {
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const colors = [
      'bg-green-500 text-white',
      'bg-yellow-500 text-white',
      'bg-orange-500 text-white',
      'bg-red-500 text-white'
    ];
    return {
      name: priorities[priority] || 'Unknown',
      color: colors[priority] || 'bg-gray-500 text-white'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket not found</h1>
          <Link href="/tickets" className="text-blue-600 hover:text-blue-800">
            ← Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link href="/tickets" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Tickets
        </Link>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
                <p className="text-gray-600 text-sm">
                  Ticket #{ticket.id} • Created {new Date(ticket.createdAt).toLocaleDateString()}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 mb-8 whitespace-pre-wrap">{ticket.description || 'No description provided'}</p>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Created By</h3>
                <p className="text-gray-900">User {ticket.createdByUserId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h3>
                <p className="text-gray-900">{ticket.assignedToUserId ? `User ${ticket.assignedToUserId}` : 'Unassigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
                <p className="text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                <p className="text-gray-900">{new Date(ticket.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

