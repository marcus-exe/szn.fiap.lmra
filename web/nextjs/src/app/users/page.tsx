'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_USERS || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/users`);
      const data = await response.json();
      
      let filteredData = data;
      if (searchTerm) {
        filteredData = data.filter((user: User) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      setUsers(filteredData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-600 text-white';
      case 'moderator':
        return 'bg-blue-600 text-white';
      case 'user':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-100">Users</h1>
            <p className="text-gray-300 mt-2">User management and authentication</p>
          </div>
          <Link
            href="/users/create"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Create User
          </Link>
        </div>

        <div className="bg-black border border-white/10 rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by email, first name, or last name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  fetchUsers();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="bg-black border border-white/10 rounded-lg shadow p-12 text-center">
            <p className="text-gray-400 text-lg">No users found</p>
          </div>
        ) : (
          <div className="bg-black border border-white/10 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-black/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-100">
                            {user.firstName || user.lastName 
                              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                              : 'No name'}
                          </div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

