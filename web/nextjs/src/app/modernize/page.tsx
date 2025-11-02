'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Dependency {
  name: string;
  currentVersion: string;
  latestVersion: string;
  status: string;
  securityIssues: string[];
  breakingChanges: string[];
  upgradePath: string;
  recommendation: string;
  upgradeSteps: string[];
}

interface AnalysisResult {
  success: boolean;
  repository?: string;
  branch?: string;
  filesAnalyzed?: number;
  languages?: string[];
  overallSeverity?: string;
  modernizationScore?: number;
  criticalIssues?: Array<{
    type: string;
    severity: string;
    file: string;
    issue: string;
    location?: string;
    impact?: string;
    recommendation?: string;
    codeExample?: string;
  }>;
  deprecatedPatterns?: Array<{
    pattern: string;
    count: number | string;
    files: string[];
    description: string;
    replacement: string;
    migrationComplexity: string;
  }>;
  securityVulnerabilities?: Array<{
    type: string;
    severity: string;
    file: string;
    line?: string;
    description: string;
    cve?: string;
    fix: string;
    codeExample?: string;
  }>;
  codeQualityIssues?: Array<{
    type: string;
    severity: string;
    file: string;
    issue: string;
    recommendation: string;
  }>;
  modernizationRecommendations?: Array<{
    priority: string;
    category: string;
    description: string;
    estimatedEffort: string;
    filesAffected: string[];
    steps: string[];
  }>;
  technicalDebt?: {
    estimatedDays: number | string;
    priority: string;
    risk: string;
    breakdown?: {
      security?: string;
      deprecated?: string;
      refactoring?: string;
    };
  };
  dependencyFiles?: string[];
  language?: string;
  packageManager?: string;
  analysis?: {
    totalDependencies: number;
    outdatedCount: number;
    vulnerableCount: number;
    deprecatedCount: number;
  };
  dependencies?: Dependency[];
  upgradePlan?: {
    priorityOrder: string[];
    groupedUpgrades: {
      safe: string[];
      requiresTesting: string[];
      breaking: string[];
    };
    estimatedRisk: string;
    testingRequired: string[];
  };
  summary?: string;
  model?: string;
  error?: string;
  processedFiles?: string[];
}

export default function ModernizePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'codebase' | 'github' | 'manual' | 'history'>('codebase');
  const [language, setLanguage] = useState('');
  const [maxFiles, setMaxFiles] = useState(30);
  const [progress, setProgress] = useState<{
    step?: string;
    message?: string;
    progress?: number;
    currentFile?: string;
    filesProcessed?: number;
    totalFiles?: number;
    filesCount?: number;
  } | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [analysisId, setAnalysisId] = useState<number | null>(null);

  const handleCodebaseAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setProgress(null);
    setAnalysisId(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082';
      
      // Use SSE for real-time progress
      const response = await fetch(`${API_URL}/api/modernization/analyze-codebase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          repoUrl,
          branch: branch || undefined,
          language: language || undefined,
          maxFiles: maxFiles || 30,
          stream: true,
        }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let currentEvent = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
            continue;
          }

          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.analysisId) {
                setAnalysisId(data.analysisId);
              }

              // Handle based on event type or data content
              if (currentEvent === 'error' || data.error) {
                setError(data.error || 'An error occurred');
                setLoading(false);
              } else if (currentEvent === 'started') {
                setProgress({ message: data.message || 'Analysis started', progress: 0 });
              } else if (currentEvent === 'progress') {
                setProgress({
                  step: data.step,
                  message: data.message,
                  progress: data.progress || 0,
                  currentFile: data.currentFile,
                  filesProcessed: data.filesProcessed,
                  totalFiles: data.totalFiles,
                  filesCount: data.filesCount,
                });
              } else if (currentEvent === 'result') {
                setResult(data);
                setProgress({ step: 'completed', message: 'Analysis completed', progress: 100 });
              } else if (currentEvent === 'done') {
                setLoading(false);
                fetchHistory(); // Refresh history after completion
              }
              currentEvent = ''; // Reset after processing
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the codebase');
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082';
      const response = await fetch(`${API_URL}/api/modernization/analysis-history?limit=20`);
      const data = await response.json();
      if (data.history) {
        setAnalysisHistory(data.history);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleGitHubAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082';
      const response = await fetch(`${API_URL}/api/modernization/analyze-dependencies-github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl,
          branch: branch || undefined,
          path: path || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze dependencies');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the repository');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const dependencies: Record<string, string> = {};
    const language = formData.get('language') as string;

    // This is a simplified version - in production, you'd have a better form for dependencies
    const depsInput = formData.get('dependencies') as string;
    try {
      const deps = JSON.parse(depsInput);
      Object.assign(dependencies, deps);
    } catch {
      setError('Invalid JSON format for dependencies');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082';
      const response = await fetch(`${API_URL}/api/modernization/analyze-dependencies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dependencies, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze dependencies');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing dependencies');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'up-to-date':
        return 'bg-green-500/20 text-green-400';
      case 'outdated':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'deprecated':
        return 'bg-orange-500/20 text-orange-400';
      case 'vulnerable':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors">
          ← Back to Home
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Legacy Code Modernization</h1>
          <p className="text-gray-300">Analyze dependencies and get modernization recommendations</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('codebase')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'codebase'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Full Codebase Analysis
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'github'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Dependencies Only
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'manual'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Manual Input
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                fetchHistory();
              }}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              History
            </button>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-white/10 rounded-lg shadow-xl p-8 backdrop-blur-sm">
          {/* Codebase Analysis Tab */}
          {activeTab === 'codebase' && (
            <form onSubmit={handleCodebaseAnalysis} className="space-y-4">
              <div>
                <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Repository URL *
                </label>
                <input
                  id="repoUrl"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Analyzes entire codebase for deprecated patterns and vulnerabilities</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
                    Branch (optional)
                  </label>
                  <input
                    id="branch"
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main, develop, etc."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                    Language (optional)
                  </label>
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  >
                    <option value="">Auto-detect</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="csharp">C#</option>
                    <option value="python">Python</option>
                    <option value="go">Go</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="maxFiles" className="block text-sm font-medium text-gray-300 mb-2">
                    Max Files
                  </label>
                  <input
                    id="maxFiles"
                    type="number"
                    value={maxFiles}
                    onChange={(e) => setMaxFiles(parseInt(e.target.value) || 30)}
                    min={10}
                    max={50}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !repoUrl}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing Codebase...
                  </span>
                ) : (
                  'Analyze Full Codebase'
                )}
              </button>
              
              {/* Real-time Progress Display */}
              {loading && progress && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-400">{progress.message || 'Processing...'}</span>
                    {progress.progress !== undefined && (
                      <span className="text-sm text-gray-400">{progress.progress}%</span>
                    )}
                  </div>
                  {progress.progress !== undefined && (
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  )}
                  {progress.currentFile && (
                    <p className="text-xs text-gray-400 mt-2">
                      Current file: <span className="font-mono">{progress.currentFile}</span>
                    </p>
                  )}
                  {progress.filesProcessed !== undefined && progress.totalFiles !== undefined && (
                    <p className="text-xs text-gray-400 mt-1">
                      Files: {progress.filesProcessed} / {progress.totalFiles}
                    </p>
                  )}
                  {progress.filesCount && (
                    <p className="text-xs text-gray-400 mt-1">
                      Total files found: {progress.filesCount}
                    </p>
                  )}
                </div>
              )}
            </form>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-100">Analysis History</h2>
                <button
                  onClick={fetchHistory}
                  className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Refresh
                </button>
              </div>
              
              {analysisHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No analysis history yet. Run an analysis to see results here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analysisHistory.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={async () => {
                        try {
                          // Try to fetch the full analysis from API if result_data is not available
                          let resultData = analysis.result_data;
                          
                          if (!resultData) {
                            // Fetch full analysis from API
                            const API_URL = process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082';
                            const response = await fetch(`${API_URL}/api/modernization/analysis/${analysis.id}`);
                            const fullAnalysis = await response.json();
                            resultData = fullAnalysis.result_data || fullAnalysis;
                          }
                          
                          // If result_data is a string, try to parse it
                          if (typeof resultData === 'string') {
                            try {
                              const jsonStart = resultData.indexOf('{');
                              if (jsonStart !== -1) {
                                let braceCount = 0;
                                let jsonEnd = jsonStart;
                                for (let i = jsonStart; i < resultData.length; i++) {
                                  if (resultData[i] === '{') braceCount++;
                                  if (resultData[i] === '}') braceCount--;
                                  if (braceCount === 0) {
                                    jsonEnd = i;
                                    break;
                                  }
                                }
                                if (braceCount === 0) {
                                  resultData = JSON.parse(resultData.substring(jsonStart, jsonEnd + 1));
                                }
                              }
                            } catch (e) {
                              console.error('Error parsing result_data:', e);
                            }
                          }
                          
                          // Ensure result data has the expected structure for visualization
                          if (resultData && typeof resultData === 'object') {
                            // Map database fields to expected fields for visualization
                            if (!resultData.filesAnalyzed && analysis.files_analyzed !== undefined) {
                              resultData.filesAnalyzed = analysis.files_analyzed;
                            }
                            if (!resultData.modernizationScore && analysis.modernization_score !== undefined) {
                              resultData.modernizationScore = analysis.modernization_score;
                            }
                            if (!resultData.overallSeverity && analysis.overall_severity) {
                              resultData.overallSeverity = analysis.overall_severity;
                            }
                            if (!resultData.repository && analysis.repository_url) {
                              resultData.repository = analysis.repository_url;
                            }
                            if (!resultData.branch && analysis.branch) {
                              resultData.branch = analysis.branch;
                            }
                            if (!resultData.processedFiles && analysis.processed_files) {
                              resultData.processedFiles = analysis.processed_files;
                            }
                            
                            // Ensure success flag is set if we have valid data
                            if (resultData.criticalIssues || resultData.securityVulnerabilities || 
                                resultData.deprecatedPatterns || resultData.dependencies || 
                                resultData.summary || resultData.filesAnalyzed) {
                              resultData.success = true;
                            }
                          } else {
                            // If resultData is not an object, create a basic structure from analysis
                            resultData = {
                              success: analysis.status === 'completed',
                              repository: analysis.repository_url,
                              branch: analysis.branch,
                              filesAnalyzed: analysis.files_analyzed,
                              modernizationScore: analysis.modernization_score,
                              overallSeverity: analysis.overall_severity,
                              language: analysis.language,
                              analysis_type: analysis.analysis_type
                            };
                          }
                          
                          setResult(resultData);
                          setActiveTab('codebase');
                        } catch (error) {
                          console.error('Error loading analysis:', error);
                          setError('Failed to load analysis details');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-100 mb-1">
                            {analysis.repository_url 
                              ? analysis.repository_url.split('/').slice(-2).join('/')
                              : analysis.analysis_type || 'Analysis'}
                          </h3>
                          {analysis.branch && (
                            <p className="text-sm text-gray-400 mb-2">Branch: {analysis.branch}</p>
                          )}
                          {!analysis.repository_url && analysis.language && (
                            <p className="text-sm text-gray-400 mb-2">Language: {analysis.language}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            analysis.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            analysis.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {analysis.status}
                          </span>
                          {analysis.modernization_score !== null && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                              Score: {analysis.modernization_score}/100
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {analysis.language && (
                          <span>Language: {analysis.language}</span>
                        )}
                        {analysis.files_analyzed && (
                          <span>Files: {analysis.files_analyzed}</span>
                        )}
                        {analysis.created_at && (
                          <span>
                            {new Date(analysis.created_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GitHub Tab */}
          {activeTab === 'github' && (
            <form onSubmit={handleGitHubAnalysis} className="space-y-4">
              <div>
                <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Repository URL *
                </label>
                <input
                  id="repoUrl"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Supports: github.com/owner/repo, github.com/owner/repo/tree/branch, etc.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
                    Branch (optional)
                  </label>
                  <input
                    id="branch"
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main, develop, etc."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="path" className="block text-sm font-medium text-gray-300 mb-2">
                    Path to Dependency File (optional)
                  </label>
                  <input
                    id="path"
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="package.json, pom.xml, etc."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !repoUrl}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Repository'
                )}
              </button>
            </form>
          )}

          {/* Manual Tab */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualAnalysis} className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                  Language *
                </label>
                <select
                  id="language"
                  name="language"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                >
                  <option value="">Select a language</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript/TypeScript</option>
                  <option value="csharp">C#/.NET</option>
                  <option value="python">Python</option>
                  <option value="go">Go</option>
                  <option value="ruby">Ruby</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              <div>
                <label htmlFor="dependencies" className="block text-sm font-medium text-gray-300 mb-2">
                  Dependencies (JSON format) *
                </label>
                <textarea
                  id="dependencies"
                  name="dependencies"
                  rows={8}
                  placeholder='{"spring-boot-starter-web": "2.7.0", "hibernate-core": "5.6.0"}'
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500 font-mono text-sm"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">Format: {`{"package-name": "version"}`}</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Dependencies'
                )}
              </button>
            </form>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="mt-8 space-y-6">
              {/* Codebase Analysis Summary */}
              {result.filesAnalyzed && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Codebase Analysis</h2>
                  {result.repository && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Repository</p>
                      <a
                        href={result.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 break-all"
                      >
                        {result.repository}
                      </a>
                      {result.branch && <span className="text-gray-400 ml-2">({result.branch})</span>}
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Files Analyzed</p>
                      <p className="text-2xl font-bold text-gray-100">{result.filesAnalyzed}</p>
                    </div>
                    {result.languages && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Languages</p>
                        <p className="text-lg font-bold text-gray-100">{result.languages.join(', ')}</p>
                      </div>
                    )}
                    {result.modernizationScore !== undefined && (
                      <div className="bg-blue-500/20 rounded-lg p-4">
                        <p className="text-sm text-blue-400">Modernization Score</p>
                        <p className="text-2xl font-bold text-blue-400">{result.modernizationScore}/100</p>
                      </div>
                    )}
                    {result.overallSeverity && (
                      <div className={`rounded-lg p-4 ${
                        result.overallSeverity === 'high' ? 'bg-red-500/20' :
                        result.overallSeverity === 'medium' ? 'bg-yellow-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <p className="text-sm text-gray-400">Overall Severity</p>
                        <p className={`text-xl font-bold ${
                          result.overallSeverity === 'high' ? 'text-red-400' :
                          result.overallSeverity === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {result.overallSeverity.toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Critical Issues */}
              {result.criticalIssues && result.criticalIssues.length > 0 && (
                <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-red-400 mb-4">Critical Issues</h2>
                  <div className="space-y-4">
                    {result.criticalIssues.map((issue, index) => (
                      <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                              issue.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {issue.severity.toUpperCase()}
                            </span>
                            <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300">
                              {issue.type}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">{issue.file}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100 mt-2">{issue.issue}</h3>
                        {issue.impact && <p className="text-sm text-gray-300 mt-1">Impact: {issue.impact}</p>}
                        {issue.location && <p className="text-xs text-gray-400 mt-1">Location: {issue.location}</p>}
                        {issue.recommendation && (
                          <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                            <p className="text-sm text-blue-400 font-medium">Recommendation:</p>
                            <p className="text-sm text-gray-300">{issue.recommendation}</p>
                          </div>
                        )}
                        {issue.codeExample && (
                          <pre className="mt-2 text-xs bg-gray-900 p-2 rounded overflow-auto text-gray-300">
                            {issue.codeExample}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Vulnerabilities */}
              {result.securityVulnerabilities && result.securityVulnerabilities.length > 0 && (
                <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-red-400 mb-4">Security Vulnerabilities</h2>
                  <div className="space-y-4">
                    {result.securityVulnerabilities.map((vuln, index) => (
                      <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                              {vuln.type}
                            </span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                              vuln.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                              vuln.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {vuln.severity.toUpperCase()}
                            </span>
                            {vuln.cve && (
                              <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                                {vuln.cve}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-400">{vuln.file}:{vuln.line}</span>
                        </div>
                        <p className="text-gray-100 mt-2">{vuln.description}</p>
                        <div className="mt-2 p-2 bg-green-500/10 border border-green-500/30 rounded">
                          <p className="text-sm text-green-400 font-medium">Fix:</p>
                          <p className="text-sm text-gray-300">{vuln.fix}</p>
                        </div>
                        {vuln.codeExample && (
                          <pre className="mt-2 text-xs bg-gray-900 p-2 rounded overflow-auto text-gray-300">
                            {vuln.codeExample}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deprecated Patterns */}
              {result.deprecatedPatterns && result.deprecatedPatterns.length > 0 && (
                <div className="bg-gray-900/50 border border-orange-500/30 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-orange-400 mb-4">Deprecated Patterns</h2>
                  <div className="space-y-4">
                    {result.deprecatedPatterns.map((pattern, index) => (
                      <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-100">{pattern.pattern}</h3>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
                              {pattern.count} occurrences
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              pattern.migrationComplexity === 'high' ? 'bg-red-500/20 text-red-400' :
                              pattern.migrationComplexity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {pattern.migrationComplexity} complexity
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 mt-2">{pattern.description}</p>
                        <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                          <p className="text-sm text-blue-400 font-medium">Modern Replacement:</p>
                          <p className="text-sm text-gray-300">{pattern.replacement}</p>
                        </div>
                        {pattern.files && pattern.files.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Affected Files:</p>
                            <div className="flex flex-wrap gap-1">
                              {pattern.files.slice(0, 5).map((file, i) => (
                                <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                                  {file}
                                </span>
                              ))}
                              {pattern.files.length > 5 && (
                                <span className="text-xs text-gray-400 px-2 py-1">
                                  +{pattern.files.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary Card */}
              {result.analysis && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Analysis Summary</h2>
                  {result.repository && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Repository</p>
                      <a
                        href={result.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 break-all"
                      >
                        {result.repository}
                      </a>
                    </div>
                  )}
                  {result.dependencyFiles && result.dependencyFiles.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Dependency Files</p>
                      <p className="text-gray-200">{result.dependencyFiles.join(', ')}</p>
                    </div>
                  )}
                  {result.language && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Language</p>
                      <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                        {result.language} ({result.packageManager || 'unknown'})
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-gray-100">{result.analysis.totalDependencies}</p>
                    </div>
                    <div className="bg-yellow-500/20 rounded-lg p-4">
                      <p className="text-sm text-yellow-400">Outdated</p>
                      <p className="text-2xl font-bold text-yellow-400">{result.analysis.outdatedCount}</p>
                    </div>
                    <div className="bg-red-500/20 rounded-lg p-4">
                      <p className="text-sm text-red-400">Vulnerable</p>
                      <p className="text-2xl font-bold text-red-400">{result.analysis.vulnerableCount}</p>
                    </div>
                    <div className="bg-orange-500/20 rounded-lg p-4">
                      <p className="text-sm text-orange-400">Deprecated</p>
                      <p className="text-2xl font-bold text-orange-400">{result.analysis.deprecatedCount}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dependencies List */}
              {result.dependencies && result.dependencies.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Dependencies</h2>
                  <div className="space-y-3">
                    {result.dependencies.map((dep, index) => (
                      <div
                        key={index}
                        className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100">{dep.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-400">
                                {dep.currentVersion} → {dep.latestVersion}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(dep.status)}`}>
                                {dep.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {dep.breakingChanges && dep.breakingChanges.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Breaking Changes:</p>
                            <ul className="list-disc list-inside text-sm text-orange-400">
                              {dep.breakingChanges.map((change, i) => (
                                <li key={i}>{change}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {dep.securityIssues && dep.securityIssues.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Security Issues:</p>
                            <ul className="list-disc list-inside text-sm text-red-400">
                              {dep.securityIssues.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {dep.upgradeSteps && dep.upgradeSteps.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Upgrade Steps:</p>
                            <ol className="list-decimal list-inside text-sm text-gray-300">
                              {dep.upgradeSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        <div className="mt-2">
                          <span className={`text-xs font-medium ${
                            dep.recommendation === 'should upgrade' ? 'text-green-400' :
                            dep.recommendation === 'keep' ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            Recommendation: {dep.recommendation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upgrade Plan */}
              {result.upgradePlan && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-100 mb-4">Upgrade Plan</h2>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-1">Estimated Risk</p>
                    <span className={`text-lg font-semibold ${getRiskColor(result.upgradePlan.estimatedRisk)}`}>
                      {result.upgradePlan.estimatedRisk.toUpperCase()}
                    </span>
                  </div>

                  {result.upgradePlan.priorityOrder && result.upgradePlan.priorityOrder.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Priority Order</p>
                      <ol className="list-decimal list-inside space-y-1 text-gray-300">
                        {result.upgradePlan.priorityOrder.map((dep, i) => (
                          <li key={i}>{dep}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {result.upgradePlan.groupedUpgrades && (
                    <div className="grid md:grid-cols-3 gap-4">
                      {result.upgradePlan.groupedUpgrades.safe && result.upgradePlan.groupedUpgrades.safe.length > 0 && (
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <p className="text-sm font-medium text-green-400 mb-2">Safe to Upgrade</p>
                          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {result.upgradePlan.groupedUpgrades.safe.map((dep, i) => (
                              <li key={i}>{dep}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.upgradePlan.groupedUpgrades.requiresTesting && result.upgradePlan.groupedUpgrades.requiresTesting.length > 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                          <p className="text-sm font-medium text-yellow-400 mb-2">Requires Testing</p>
                          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {result.upgradePlan.groupedUpgrades.requiresTesting.map((dep, i) => (
                              <li key={i}>{dep}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.upgradePlan.groupedUpgrades.breaking && result.upgradePlan.groupedUpgrades.breaking.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <p className="text-sm font-medium text-red-400 mb-2">Breaking Changes</p>
                          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                            {result.upgradePlan.groupedUpgrades.breaking.map((dep, i) => (
                              <li key={i}>{dep}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {result.upgradePlan.testingRequired && result.upgradePlan.testingRequired.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-400 mb-2">Testing Required</p>
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                        {result.upgradePlan.testingRequired.map((test, i) => (
                          <li key={i}>{test}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {result.summary && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Summary</h3>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {result.summary}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Fallback: Try to parse and display analysis if success is false but analysis field exists */}
              {!result.success && result.analysis && typeof result.analysis === 'string' && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Analysis Result</h3>
                  
                  {/* Try to extract JSON from the analysis string */}
                  {(() => {
                    try {
                      // Try to find JSON in the analysis string
                      const analysisText = result.analysis as string;
                      const jsonStart = analysisText.indexOf('{');
                      if (jsonStart !== -1) {
                        let braceCount = 0;
                        let jsonEnd = jsonStart;
                        
                        for (let i = jsonStart; i < analysisText.length; i++) {
                          if (analysisText[i] === '{') braceCount++;
                          if (analysisText[i] === '}') braceCount--;
                          if (braceCount === 0) {
                            jsonEnd = i;
                            break;
                          }
                        }
                        
                        if (braceCount === 0) {
                          const extractedJson = analysisText.substring(jsonStart, jsonEnd + 1);
                          const parsed = JSON.parse(extractedJson);
                          
                          // Display structured data if we successfully parsed
                          return (
                            <>
                              {parsed.modernizationScore !== undefined && (
                                <div className="mb-4 p-4 bg-blue-500/20 rounded-lg">
                                  <p className="text-sm text-blue-400 mb-1">Modernization Score</p>
                                  <p className="text-2xl font-bold text-blue-400">{parsed.modernizationScore}/100</p>
                                </div>
                              )}
                              
                              {parsed.criticalIssues && parsed.criticalIssues.length > 0 && (
                                <div className="mb-4 space-y-3">
                                  <h4 className="text-lg font-semibold text-red-400 mb-2">Critical Issues</h4>
                                  {parsed.criticalIssues.slice(0, 5).map((issue: any, i: number) => (
                                    <div key={i} className="bg-red-500/10 border border-red-500/30 rounded p-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-red-400">{issue.severity || 'Unknown'}</span>
                                        <span className="text-xs text-gray-400">{issue.file}</span>
                                      </div>
                                      <p className="text-sm text-gray-300">{issue.issue || issue.description}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {parsed.securityVulnerabilities && parsed.securityVulnerabilities.length > 0 && (
                                <div className="mb-4 space-y-3">
                                  <h4 className="text-lg font-semibold text-red-400 mb-2">Security Vulnerabilities</h4>
                                  {parsed.securityVulnerabilities.slice(0, 5).map((vuln: any, i: number) => (
                                    <div key={i} className="bg-red-500/10 border border-red-500/30 rounded p-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-red-400">{vuln.type}</span>
                                        <span className="text-xs text-gray-400">{vuln.file}:{vuln.line}</span>
                                      </div>
                                      <p className="text-sm text-gray-300">{vuln.description}</p>
                                      {vuln.fix && (
                                        <p className="text-xs text-green-400 mt-1">Fix: {vuln.fix}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {parsed.deprecatedPatterns && parsed.deprecatedPatterns.length > 0 && (
                                <div className="mb-4 space-y-3">
                                  <h4 className="text-lg font-semibold text-orange-400 mb-2">Deprecated Patterns</h4>
                                  {parsed.deprecatedPatterns.slice(0, 5).map((pattern: any, i: number) => (
                                    <div key={i} className="bg-orange-500/10 border border-orange-500/30 rounded p-3">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-orange-400">{pattern.pattern}</span>
                                        <span className="text-xs text-gray-400">{pattern.count} occurrences</span>
                                      </div>
                                      <p className="text-sm text-gray-300">{pattern.description}</p>
                                      {pattern.replacement && (
                                        <p className="text-xs text-blue-400 mt-1">Replace with: {pattern.replacement}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {parsed.summary && (
                                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                                  <h4 className="text-sm font-semibold text-blue-400 mb-2">Summary</h4>
                                  <div className="prose prose-sm prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {parsed.summary}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-4">
                                <details className="text-sm">
                                  <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
                                    View Raw Analysis Text
                                  </summary>
                                  <pre className="text-xs text-gray-400 overflow-auto bg-gray-800 p-4 rounded mt-2 max-h-96">
                                    {result.analysis}
                                  </pre>
                                </details>
                              </div>
                            </>
                          );
                        }
                      }
                      
                      // Fallback: show formatted text
                      return (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {result.analysis}
                          </ReactMarkdown>
                        </div>
                      );
                    } catch (e) {
                      // Final fallback: show raw text
                      return (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {result.analysis}
                          </ReactMarkdown>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
              
              {/* Raw JSON fallback - only show if none of the structured fields exist */}
              {!result.success && 
               !result.analysis && 
               !result.filesAnalyzed && 
               !result.criticalIssues && 
               !result.securityVulnerabilities && 
               !result.deprecatedPatterns && 
               !result.dependencies && 
               !result.summary && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">Analysis Result</h3>
                  <p className="text-sm text-gray-400 mb-4">Raw data (no structured format available):</p>
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
                      View Raw JSON
                    </summary>
                    <pre className="text-xs text-gray-400 overflow-auto bg-gray-800 p-4 rounded mt-2 max-h-96">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



