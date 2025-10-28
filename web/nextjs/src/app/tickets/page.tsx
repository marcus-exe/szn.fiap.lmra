'use client';

import { useEffect, useState } from 'react';
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

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const fetchTickets = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_TICKETS || 'http://localhost:8081';
      let url = `${API_URL}/api/tickets`;
      const params = new URLSearchParams();
      
      if (filterStatus) {
        params.append('status', filterStatus);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Apply client-side search
      let filteredData = data;
      if (searchTerm) {
        filteredData = data.filter((ticket: Ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setTickets(filteredData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: number) => {
    const statuses = ['Open', 'InProgress', 'Resolved', 'Closed', 'Cancelled'];
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
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
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
          <p className="mt-4 text-gray-300">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-100">Tickets</h1>
          <p className="text-gray-300 mt-2">Manage and track issues, tasks, and requests</p>
        </div>

        <div className="bg-black border border-white/10 rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  fetchTickets();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchTickets}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-black border border-white/10 rounded-lg shadow p-12 text-center">
            <p className="text-gray-400 text-lg">No tickets found</p>
            <Link
              href="/tickets/create"
              className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Ticket
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-black border border-white/10 rounded-lg shadow p-6 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100">{ticket.title}</h3>
                    <p className="text-gray-300 text-sm mt-1">
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
                <p className="text-gray-300 mb-4 line-clamp-3">{ticket.description || 'No description provided'}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Created by User {ticket.createdByUserId}
                    {ticket.assignedToUserId && <span> • Assigned to User {ticket.assignedToUserId}</span>}
                  </div>
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.location.href = '/tickets/create'}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            + Create New Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
