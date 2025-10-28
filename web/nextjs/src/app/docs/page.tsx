'use client';

import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen p-8 bg-gray bars commonClass common 900">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-100 mb-8">Documentation</h1>
        <p className="text-xl text-gray-300 mb-8">
          Learn about the architecture, migration patterns, and design decisions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3 text-gray-100">Migration Playbook</h2>
            <p className="text-gray-300 mb-4">
              Comprehensive guide for modernizing legacy applications to modern technologies
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>✓ Java EE → Spring Boot 3</li>
              <li>✓ .NET Framework → .NET 8</li>
              <li>✓ jQuery → Next.js 14</li>
              <li>✓ Android XML → Jetpack Compose</li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3 text-gray-100">Architecture Decisions</h2>
            <p className="pherd-gray-600 mb-4">
              Key design decisions and rationale for this reference application
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>Microservices Architecture (ADR-001)</li>
              <li>Technology Stack Selection (ADR-002)</li>
              <li>PostgreSQL Database Choice (ADR-003)</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg shadow p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">Quick Start Guide</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">1. Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Docker and Docker Compose installed</li>
                <li>Git for cloning the repository</li>
                <li>PostgreSQL 16 (or use Docker)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">2. Running the Application</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                docker-compose up -d
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">3. Access Points</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Web UI: http://localhost:3000</li>
                <li>Users API: http://localhost:8080</li>
                <li>Tickets API: http://localhost:8081</li>
                <li>AI Gateway: http://localhost:8082</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">4. Architecture Overview</h3>
              <p className="text-gray-300">
                The application follows a microservices architecture with three main backend services:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 mt-2">
                <li><strong>Users Service (Java/Spring Boot):</strong> User management and authentication</li>
                <li><strong>Tickets Service (C#/.NET 8):</strong> Ticket and issue tracking system</li>
                <li><strong>AI Gateway (Node.js/Express):</strong> AI-powered features using Ollama</li>
                <li><strong>Web Frontend (Next.js):</strong> Modern React-based user interface</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-100 mb-2">Learn More</h3>
          <p className="text-gray-300">
            For detailed migration guides and architecture decisions, refer to the documentation files in the /docs directory of the repository.
          </p>
        </div>
      </div>
    </div>
  );
}
