'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'next-intl';

export default function AIPage() {
  const t = useTranslations('ai');
  const tCommon = useTranslations('common');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [streaming, setStreaming] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setMetrics(null);
    setCopied(false);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_AI || 'http://localhost:8082';
      const startTime = Date.now();
      
      if (streaming) {
        // Streaming mode
        const res = await fetch(`${API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, stream: true }),
        });

        if (!res.body) {
          throw new Error('No response body');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedResponse = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.chunk) {
                  accumulatedResponse += data.chunk;
                  setResponse(accumulatedResponse);
                }
                
                if (data.metrics) {
                  setMetrics(data.metrics);
                }
                
                if (data.done) {
                  setLoading(false);
                }
                
                if (data.error) {
                  setResponse(`Error: ${data.error}`);
                  setLoading(false);
                  break;
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      } else {
        // Non-streaming mode
        const res = await fetch(`${API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, stream: false }),
        });
        
        const data = await res.json();
        setResponse(data.response || data.message || data.content || 'No response received');
        setMetrics(data.metrics || null);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error?.message || 'Unknown error';
      setResponse(`Error: ${errorMessage}. ${t('error')}`);
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block transition-colors">
          {t('backToHome')}
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-100 mb-8">{t('title')}</h1>
        <p className="text-gray-300 mb-8">{t('subtitle')}</p>

        <div className="bg-black border border-white/10 rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                {t('yourMessage')}
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('messagePlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={streaming}
                  onChange={(e) => setStreaming(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-300">{t('streamingMode')}</span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('processing') : t('sendMessage')}
            </button>
          </form>

          {(response || loading) && (
            <div className="bg-black rounded-lg p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-100">{t('response')}:</h3>
                {metrics && (
                  <div className="flex gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{metrics.tokens}</span> {t('tokens')}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-semibold">{metrics.duration}s</span> {t('duration')}
                    </span>
                    {metrics.meanTokensPerSecond !== undefined && (
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">{metrics.meanTokensPerSecond}</span> {t('tokPerSecAvg')}
                      </span>
                    )}
                    {metrics.currentTokensPerSecond !== undefined && loading && parseFloat(metrics.currentTokensPerSecond) > 0 && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <span className="font-semibold">{metrics.currentTokensPerSecond}</span> {t('tokPerSecNow')}
                      </span>
                    )}
                    {metrics.tokensPerSecond !== undefined && !metrics.meanTokensPerSecond && (
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">{metrics.tokensPerSecond}</span> {t('tokPerSec')}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {loading && !response && (
                <div className="text-gray-400 italic">{t('waiting')}</div>
              )}
              
              {response && (
                <div className="prose prose-sm max-w-none mb-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {response}
                  </ReactMarkdown>
                </div>
              )}
              
              {loading && response && (
                <div className="mt-2 text-blue-600 text-sm">{t('streaming')}</div>
              )}
              
              {/* Copy button */}
              {response && !loading && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-300 rounded-lg transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t('copied')}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {t('copy')}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-6 bg-black border border-white/10 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{t('tryAsking')}:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>&quot;{t('suggestions.architecture')}&quot;</li>
              <li>&quot;{t('suggestions.modernizeJava')}&quot;</li>
              <li>&quot;{t('suggestions.netDifference')}&quot;</li>
              <li>&quot;{t('suggestions.containerization')}&quot;</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
