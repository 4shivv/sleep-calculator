'use client';

import { useState } from 'react';
import Link from 'next/link';
import StarryBackground from '../../components/StarryBackground';

export default function BlogLanding() {
  return (
    <div className="min-h-screen pb-12 relative">
      <StarryBackground />
      <div className="content-container px-4 sm:px-6 relative z-10">
        {/* Header section */}
        <header className="app-header max-w-4xl mx-auto pt-16 pb-12 sm:pt-20 px-4">
          <div className="flex flex-col items-center mb-16">
            <Link 
              href="/" 
              className="self-start mb-6 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg border border-blue-500/30 inline-flex items-center gap-2 text-lg hover:bg-blue-600/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>

            <div className="inline-flex items-center justify-center p-5 bg-indigo-900/30 rounded-full mb-6 glow-border">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-400 glow-icon animate-twinkle" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h1 className="text-center glow-text text-5xl md:text-6xl font-bold mb-8">
              <span className="text-gradient-cosmic">Sleep Science Blog</span>
            </h1>
            <p className="text-blue-200 max-w-2xl text-center leading-relaxed text-xl md:text-2xl mb-8">
              Explore the fascinating world of sleep science and discover evidence-based strategies to improve your sleep
            </p>
          </div>
        </header>
        
        {/* Blog Articles List */}
        <section className="max-w-4xl mx-auto px-4 sm:px-0 mb-16">
          <h2 className="sr-only">Blog Articles</h2>
          
          <div className="space-y-12">
            {/* Article Card 1 */}
            <article className="backdrop-blur-sm rounded-xl overflow-hidden transition-transform hover:scale-102 hover:-translate-y-1">
              <Link href="/blog/sleep-science" className="block">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                      <h3 className="text-3xl font-semibold text-cyan-300 mb-4">
                        The Science of Sleep
                      </h3>
                      <p className="text-blue-200 text-xl mb-6">
                        Understanding the complex mechanisms behind sleep and how optimizing your sleep patterns can improve your life
                      </p>
                      <div className="flex items-center gap-3 text-blue-300 text-lg mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <time>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                        <span className="mx-2">•</span>
                        <span>8 min read</span>
                      </div>
                      <span className="px-5 py-3 bg-blue-600/30 text-cyan-200 rounded-lg border border-blue-500/30 inline-flex items-center gap-2 text-lg hover:bg-blue-600/40 transition-colors">
                        Read Article
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                    <div className="md:w-1/3 flex justify-center">
                      <div className="relative w-full h-40 md:h-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20"></div>
                        <div className="relative z-10 bg-indigo-900/40 p-4 rounded-full glow-border">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 md:w-16 md:h-16 text-cyan-400 glow-icon animate-twinkle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
            
            {/* Placeholder for Future Articles */}
            <div className="backdrop-blur-sm rounded-xl p-8 border border-dashed border-blue-500/30 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-400/50 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-2xl font-semibold text-blue-300/70 mb-3">More articles coming soon</h3>
              <p className="text-blue-200/70 text-lg max-w-lg mx-auto">
                We're working on more sleep science content to help you understand and improve your sleep patterns.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="app-footer text-center py-10 mt-16 text-cyan-300">
        <p className="text-xl">Based on sleep cycle science and circadian rhythm research.</p>
        <p className="mt-2 text-cyan-400/80">© {new Date().getFullYear()} Slumber</p>
      </footer>
    </div>
  );
}