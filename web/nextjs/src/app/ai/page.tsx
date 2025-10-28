'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AIPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082';
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await res.json();
      setResponse(data.response || data.message || data.content || 'No response received');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error?.message || 'Unknown error';
      const details = error?.details || '';
      setResponse(`Error: ${errorMessage}. ${details}` || 'Error communicating with AI service. Make sure Ollama is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-8">AI Assistant</h1>
        <p className="text-gray-600 mb-8">Powered by Ollama - Ask questions about the system or get help with modernizing legacy code</p>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask anything about microservices, modernizing legacy code, or this application..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Send Message'}
            </button>
          </form>

          {response && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response:</h3>
              <div className="text-gray-700 whitespace-pre-wrap">{response}</div>
            </div>
          )}

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Try asking:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>&quot;Explain the architecture of this microservices application&quot;</li>
              <li>&quot;How do I modernize a legacy Java application?&quot;</li>
              <li>&quot;What are the differences between .NET Framework and .NET 8?&quot;</li>
              <li>&quot;How does containerization help with deployment?&quot;</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

