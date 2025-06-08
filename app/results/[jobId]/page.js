'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

// Animated counter hook
function useAnimatedCounter(end, duration = 1000, startOnMount = false) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const countRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!end || end <= 0) return;
    
    const startCounting = () => {
      if (hasStarted) return;
      setHasStarted(true);
      
      let startTime = null;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(end);
          setIsComplete(true);
        }
      };
      
      requestAnimationFrame(step);
    };

    if (startOnMount) {
      startCounting();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && !hasStarted) {
            startCounting();
          }
        },
        { threshold: 0.5 }
      );

      if (countRef.current) {
        observer.observe(countRef.current);
      }
      
      observerRef.current = observer;

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [end, duration, hasStarted, startOnMount]);

  return { count, ref: countRef, isComplete };
}

export default function ResultsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Counters
  const campaignCounter = useAnimatedCounter(data ? 3 : 0, 800);
  const personaCounter = useAnimatedCounter(data ? 3 : 0, 800);
  const segmentCounter = useAnimatedCounter(data ? 3 : 0, 800);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/get-results?jobId=${params.jobId}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load results');
        }
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [params.jobId]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mb-4"></div>
          <p className="text-white text-xl">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'No data found'}</p>
          <a href="/" className="text-blue-400 hover:text-blue-300">Go back to home</a>
        </div>
      </div>
    );
  }

  const { research, gtm, campaigns } = data.results || {};

  // Handle missing data gracefully
  if (!research || !gtm || !campaigns) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-400 text-xl mb-4">Partial data received. Some sections may be missing.</p>
          <pre className="text-white text-left bg-black/50 p-4 rounded">
            {JSON.stringify(data.results, null, 2)}
          </pre>
          <a href="/" className="inline-block mt-4 text-blue-400 hover:text-blue-300">Try again</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInFromTop {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes numberGlow {
          0% { text-shadow: 0 0 10px rgba(59, 130, 246, 0); }
          50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
          100% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.4); }
        }
        .animate-slide-in-top { animation: slideInFromTop 0.6s ease-out forwards; }
        .animate-slide-in-left { animation: slideInFromLeft 0.6s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        .number-glow { animation: numberGlow 0.6s ease-out; }
        .tab-button { position: relative; transition: all 0.3s ease; }
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
        }
      `}} />

      {/* Background animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-top">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">GTM Strategy Complete</h1>
                  <p className="text-sm text-gray-300">Full market analysis and campaign plan ready</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-gray-300">
                  <span className="text-gray-400">Company:</span> <span className="text-white font-medium">{data.website}</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl text-center animate-slide-in-left">
            <div ref={campaignCounter.ref} className={`text-4xl font-bold text-blue-400 ${campaignCounter.isComplete ? 'number-glow' : ''}`}>
              {campaignCounter.count}
            </div>
            <div className="text-base text-white mt-2">Campaign Ideas</div>
          </div>
          <div className="glass-card p-6 rounded-xl text-center animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
            <div ref={personaCounter.ref} className={`text-4xl font-bold text-purple-400 ${personaCounter.isComplete ? 'number-glow' : ''}`}>
              {personaCounter.count}
            </div>
            <div className="text-base text-white mt-2">Buyer Personas</div>
          </div>
          <div className="glass-card p-6 rounded-xl text-center animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <div ref={segmentCounter.ref} className={`text-4xl font-bold text-green-400 ${segmentCounter.isComplete ? 'number-glow' : ''}`}>
              {segmentCounter.count}
            </div>
            <div className="text-base text-white mt-2">Target Segments</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-8 bg-gray-900/70 backdrop-blur p-2 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-button flex-1 px-6 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'overview' 
                ? 'bg-blue-600 text-white shadow-lg active' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Company Overview
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`tab-button flex-1 px-6 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'market' 
                ? 'bg-blue-600 text-white shadow-lg active' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Market Analysis
          </button>
          <button
            onClick={() => setActiveTab('targeting')}
            className={`tab-button flex-1 px-6 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'targeting' 
                ? 'bg-blue-600 text-white shadow-lg active' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Targeting
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`tab-button flex-1 px-6 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'campaigns' 
                ? 'bg-blue-600 text-white shadow-lg active' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Campaigns
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Company Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              {/* Positioning Assessment */}
              <div className="glass-card rounded-2xl p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">Positioning Assessment</h2>
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6">
                    <p className="text-sm text-blue-400 uppercase tracking-wide font-bold mb-2">Current State</p>
                    <p className="text-white text-lg">{gtm.positioning_assessment}</p>
                  </div>
                  {gtm.recommended_positioning && (
                    <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6">
                      <p className="text-sm text-green-400 uppercase tracking-wide font-bold mb-2">Recommended Positioning</p>
                      <p className="text-white text-xl font-medium">{gtm.recommended_positioning}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* SWOT Analysis */}
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">SWOT Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-green-400 mb-4">Strengths</h3>
                    <ul className="space-y-2">
                      {gtm.swot.strengths.map((item, i) => (
                        <li key={i} className="text-white flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-yellow-400 mb-4">Weaknesses</h3>
                    <ul className="space-y-2">
                      {gtm.swot.weaknesses.map((item, i) => (
                        <li key={i} className="text-white flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-400 mb-4">Opportunities</h3>
                    <ul className="space-y-2">
                      {gtm.swot.opportunities.map((item, i) => (
                        <li key={i} className="text-white flex items-start">
                          <span className="text-blue-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-4">Threats</h3>
                    <ul className="space-y-2">
                      {gtm.swot.threats.map((item, i) => (
                        <li key={i} className="text-white flex items-start">
                          <span className="text-red-400 mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Analysis Tab */}
          {activeTab === 'market' && (
            <div className="animate-fade-in">
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Market Opportunity</h2>
                
                {/* TAM/SAM/SOM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-xl p-6 text-center">
                    <p className="text-sm text-blue-400 uppercase tracking-wide font-bold mb-2">Total Addressable Market</p>
                    <p className="text-3xl font-bold text-white">{gtm.market_sizing.tam}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-6 text-center">
                    <p className="text-sm text-purple-400 uppercase tracking-wide font-bold mb-2">Serviceable Addressable Market</p>
                    <p className="text-3xl font-bold text-white">{gtm.market_sizing.sam}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-400/30 rounded-xl p-6 text-center">
                    <p className="text-sm text-green-400 uppercase tracking-wide font-bold mb-2">Serviceable Obtainable Market</p>
                    <p className="text-3xl font-bold text-white">{gtm.market_sizing.som}</p>
                  </div>
                </div>

                {/* Competitive Positioning */}
                {gtm.competitive_positioning && (
                  <div className="bg-gray-800/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Competitive Positioning</h3>
                    <p className="text-gray-300">{gtm.competitive_positioning}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Targeting Tab */}
          {activeTab === 'targeting' && (
            <div className="animate-fade-in space-y-6">
              {/* ICP */}
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Ideal Customer Profile</h2>
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-6">
                  <p className="text-white leading-relaxed">{gtm.ideal_customer_profile}</p>
                </div>
              </div>

              {/* Personas */}
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Buyer Personas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {gtm.personas.map((persona, i) => (
                    <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4">{persona.title}</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Daily Reality:</p>
                          <p className="text-gray-200">{persona.daily_reality}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Measured On:</p>
                          <p className="text-gray-200">{persona.measured_on}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Current Pain:</p>
                          <p className="text-gray-200">{persona.current_pain}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Segments */}
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Target Segments</h2>
                <div className="space-y-6">
                  {gtm.segments.map((segment, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-blue-400 mb-3">{segment.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Target:</p>
                          <p className="text-white">{segment.target}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Market Size:</p>
                          <p className="text-white font-bold">{segment.market_size}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-400 mb-1">Pain Created:</p>
                          <p className="text-white">{segment.pain_created}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="animate-fade-in">
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Campaign Ideas</h2>
                <div className="space-y-8">
                  {campaigns.campaignIdeas.map((campaign, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-blue-400">{campaign.name}</h3>
                        <button
                          onClick={() => copyToClipboard(campaign.emailBody, i)}
                          className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                            copiedIndex === i 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                              : 'bg-gray-700/50 text-white hover:bg-gray-700 border border-gray-600'
                          }`}
                        >
                          {copiedIndex === i ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Target:</p>
                        <p className="text-white">{campaign.target}</p>
                      </div>

                      <div className="bg-gray-900/70 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-2">Email Template:</p>
                        <p className="text-white whitespace-pre-line">{campaign.emailBody}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Proof Note */}
                {campaigns.socialProofNote && (
                  <div className="mt-6 bg-yellow-500/10 border border-yellow-400/40 rounded-xl p-6">
                    <div className="flex">
                      <svg className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-white">{campaigns.socialProofNote}</p>
                    </div>
                  </div>
                )}

                {/* VeoGrowth Pitch */}
                <div className="mt-8 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-2 border-blue-400/50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-4">Ready to Execute?</h3>
                  <p className="text-white text-lg mb-4">{campaigns.veoGrowthPitch}</p>
                  <p className="text-gray-300 mb-6">{campaigns.prospectTargetingNote}</p>
                  <a 
                    href="https://calendly.com/veogrowth/strategy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all"
                  >
                    Book a Strategy Call
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-800/50 backdrop-blur rounded-lg text-white hover:bg-gray-800/70 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generate Another Analysis
          </a>
        </div>
      </div>
    </div>
  );
}
