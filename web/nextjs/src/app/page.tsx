'use client';

import Link from 'next/link';
import DNAAnimation from '@/components/DNAAnimation';

export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Legacy Modernization Reference Application
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          A comprehensive reference for modernizing legacy codebases
        </p>

        <DNAAnimation />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link 
            href="/tickets"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">Tickets</h2>
            <p className="text-gray-300">
              Manage and track issues, tasks, and requests
            </p>
          </Link>

          <Link 
            href="/users"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">Users</h2>
            <p className="text-gray-300">
              User management and authentication
            </p>
          </Link>

          <Link 
            href="/ai"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">AI Assistant</h2>
            <p className="text-gray-300">
              AI-powered features powered by Ollama
            </p>
          </Link>

          <Link 
            href="/modernize"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">Code Modernization</h2>
            <p className="text-gray-300">
              Analyze dependencies and modernize legacy code
            </p>
          </Link>

          <Link 
            href="/docs"
            className="p-6 border border-white/10 bg-black rounded-lg hover:bg-black/80 transition-all"
          >
            <h2 className="text-2xl font-semibold mb-2">Documentation</h2>
            <p className="text-gray-300">
              Learn about the architecture and migration patterns
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

