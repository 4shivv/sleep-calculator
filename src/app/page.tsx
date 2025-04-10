'use client';

import React from 'react';
import Link from 'next/link';
import StarryBackground from '../components/StarryBackground';

export default function Home() {
  return (
    <div className="min-h-screen pb-12 relative">
      <StarryBackground />
      <div className="content-container px-4 sm:px-6 relative z-10">
        {/* Hero section */}
        <header className="app-header max-w-4xl mx-auto pb-8 px-4" style={{paddingTop: '50px'}}>
          <div className="flex flex-col items-center mb-8 md:mb-10">
            <h1 className="text-center glow-text flex items-center justify-center gap-4 mb-8 mt-12">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-16 h-16 sm:w-24 sm:h-24 text-cyan-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
              <span className="text-gradient-cosmic text-7xl md:text-8xl font-bold mt-4">Slumber</span>
            </h1>
            <p className="text-cyan-100 max-w-2xl text-center leading-relaxed text-2xl md:text-3xl">
              Optimize your sleep schedule and daily productivity by aligning with your natural sleep cycles
              and circadian rhythm.
            </p>
          </div>
        </header>
        
        {/* Calculator Options Section */}
        <section className="max-w-4xl mx-auto mb-16 md:mb-20 px-4 sm:px-0">
          
          <div className="backdrop-blur-sm p-8 mb-12 rounded-xl border border-blue-500/20">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16">
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="bg-blue-800/30 p-4 md:p-5 rounded-full mb-6 glow-border">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-12 h-12 md:w-14 md:h-14 text-cyan-400 glow-icon" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold text-cyan-300 mb-4">I want to wake up at...</h3>
                <p className="text-cyan-100 text-xl mb-6">Calculate optimal bedtimes based on when you need to wake up.</p>
                <Link href="/calculator/wake" className="mt-auto px-5 py-3 bg-blue-600/30 text-cyan-200 rounded-lg border border-blue-500/30 inline-flex items-center gap-2 text-xl hover:bg-blue-600/40 transition-colors">
                  Choose this option
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              <div className="w-px h-auto bg-blue-500/20 hidden md:block"></div>
              
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="bg-blue-800/30 p-4 md:p-5 rounded-full mb-6 glow-border">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-12 h-12 md:w-14 md:h-14 text-cyan-400 glow-icon" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-4xl font-semibold text-cyan-300 mb-4">I want to go to sleep at...</h3>
                <p className="text-cyan-100 text-xl mb-6">Calculate optimal wake-up times based on when you go to bed.</p>
                <Link href="/calculator/sleep" className="mt-auto px-5 py-3 bg-blue-600/30 text-cyan-200 rounded-lg border border-blue-500/30 inline-flex items-center gap-2 text-xl hover:bg-blue-600/40 transition-colors">
                  Choose this option
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Science Section - Link to Blog */}
        <section className="science-section max-w-4xl mx-auto px-4 sm:px-0 mb-16">
          <div className="backdrop-blur-sm p-8 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-semibold mb-6 md:mb-10">
                  <span className="text-gradient-cosmic">The Science of Sleep</span>
                </h2>
                <p className="text-blue-200 mb-6 text-xl">
                  Learn about sleep cycles, circadian rhythms, and evidence-based practices to improve your sleep quality and overall wellbeing.
                </p>
                <div className="flex justify-center w-full">
                  <Link href="/blog/sleep-science" className="mt-4 px-6 py-4 bg-blue-600/30 text-cyan-200 rounded-lg border border-blue-500/30 inline-flex items-center gap-3 text-xl hover:bg-blue-600/40 transition-colors">
                    Read the Full Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="w-full h-48 md:h-64 lg:h-80 flex items-center justify-center">
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 w-full h-full"></div>
                  <div className="z-10 bg-indigo-900/40 p-5 rounded-full mb-4 absolute">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 md:w-20 md:h-20 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
              </div>
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