'use client';

import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

export default function GTMGeneratorPage() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [positioning, setPositioning] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState('');

  // Poll for results
  useEffect(() => {
    if (!jobId) return;

    const checkResults = async () => {
      try {
        const response = await fetch(`/api/check-results?jobId=${jobId}`);
        const data = await response.json();
        
        if (data.completed) {
          // Redirect to results page
          window.location.href = `/results/${jobId}`;
        }
      } catch (err) {
        console.error('Error checking results:', err);
      }
    };

    const interval = setInterval(checkResults, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !website || !positioning) {
      setError('Please fill in all fields');
      return;
    }

    // Normalize website URL
    let normalizedWebsite = website.trim();
    if (!normalizedWebsite.match(/^https?:\/\//i)) {
      normalizedWebsite = 'https://' + normalizedWebsite;
    }
    
    try {
      new URL(normalizedWebsite);
    } catch (err) {
      setError('Please enter a valid website URL');
      return;
    }

    // Check for work email
    const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (freeEmailDomains.includes(emailDomain)) {
      setError('Please enter a work email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/submit-to-clay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          website: normalizedWebsite, 
          positioning 
        })
      });

      const data = await response.json();

      if (data.success) {
        setJobId(data.jobId);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (loading && jobId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mb-6"></div>
          <h3 className="text-2xl font-semibold text-white mb-3">Creating Your GTM Strategy...</h3>
          <p className="text-blue-100 mb-2">Our AI is analyzing your market opportunity</p>
          <p className="text-sm text-blue-200/60">This typically takes 45-60 seconds</p>
          
          <div className="mt-8 space-y-3">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-200">Analyzing company positioning</span>
            </div>
            <div className="flex items-center space-x-3 text-left">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <span className="text-gray-200">Researching market opportunity</span>
            </div>
            <div className="flex items-center space-x-3 text-left opacity-50">
              <div className="w-6 h-6 bg-gray-500/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
              <span className="text-gray-300">Creating campaign strategies</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span 
                className="text-3xl text-gray-900" 
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: '300',
                  letterSpacing: '-0.03em'
                }}
              >
                VeoGrowth
              </span>
            </div>
            <span className="text-sm text-gray-500">AI-Powered B2B GTM Strategy</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-6xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                New: Full GTM Strategy + Campaign Creation
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Get Your Free<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  GTM Strategy & Campaigns
                </span><br />
                in 60 Seconds
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Our AI analyzes your company, creates a complete go-to-market plan, 
                and generates ready-to-send campaign ideas
              </p>

              {/* Social Proof */}
              <div className="flex items-center justify-center space-x-8 mb-12">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="font-medium">500+</span> B2B companies
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Full GTM plan</span> included
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-medium">3 campaigns</span> ready to send
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Website Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Website
                      <span className="text-xs text-gray-500 ml-2 font-normal">(we'll analyze this)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="example.com or https://example.com"
                        required
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Work Email
                      <span className="text-xs text-gray-500 ml-2 font-normal">(for your results)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Positioning Radio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Is your website positioning clear?
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'yes', label: 'Yes, our value prop is crystal clear' },
                        { value: 'no', label: 'No, we need positioning help' },
                        { value: 'unsure', label: "I'm not sure" }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                          <input
                            type="radio"
                            name="positioning"
                            value={option.value}
                            checked={positioning === option.value}
                            onChange={(e) => setPositioning(e.target.value)}
                            required
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start p-4 bg-red-50 text-red-700 rounded-lg">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all transform ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      Generate My GTM Strategy
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </button>
                </form>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  No credit card required • Results in 60 seconds • 100% free
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Deep AI Analysis
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    GDPR Compliant
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No Spam Ever
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-sm text-gray-500">
          <p>© 2025 VeoGrowth. AI-Powered B2B Lead Generation.</p>
        </footer>
      </div>
    </div>
  );
}
