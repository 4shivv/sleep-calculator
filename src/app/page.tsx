'use client';

import { useState } from 'react';
import Link from 'next/link';
import StarryBackground from '../components/StarryBackground';

export default function Home() {
  return (
    <div className="min-h-screen pb-12 relative">
      <StarryBackground />
      <div className="content-container px-4 sm:px-6 relative z-10">
        {/* Hero section */}
        <header className="app-header max-w-4xl mx-auto pt-16 pb-8 sm:pt-20 sm:pb-10 px-4">
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-900/30 rounded-full mb-5 glow-border">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 glow-icon animate-twinkle" 
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
            </div>
            <h1 className="text-center glow-text text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-cosmic">Slumber</span>
            </h1>
            <p className="text-cyan-100 max-w-2xl text-center leading-relaxed text-xl md:text-2xl">
              Optimize your sleep schedule and daily productivity by aligning with your natural sleep cycles
              and circadian rhythm.
            </p>
          </div>
          
          <div className="card-cosmic rounded-xl shadow-lg border-blue-500/20 mb-8 sm:mb-10 p-6 bg-blue-900/10">
            <div className="flex items-start gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mt-0.5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-cyan-50">
                <p className="font-semibold mb-3 text-cyan-300 text-xl">About Sleep Cycles</p>
                <p className="text-lg">Each sleep cycle lasts about 90 minutes and includes light, deep, and REM sleep. Waking up at the end of a complete cycle helps you feel more refreshed, while waking during deep sleep can cause grogginess.</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Calculator Options Section */}
        <section className="max-w-4xl mx-auto mb-10 md:mb-16 px-4 sm:px-0">
          <h2 className="text-center mb-10 text-3xl md:text-4xl font-semibold">
            <span className="text-cyan-300">Choose Your </span>
            <span className="text-gradient-cosmic">Sleep Calculator</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Link href="/calculator/wake" className="calculator-option-card transform transition duration-300 hover:scale-102 shadow-lg">
              <div className="flex flex-col items-center p-6 md:p-8 text-center h-full">
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
                <h3 className="text-2xl md:text-3xl font-semibold text-cyan-300 mb-4">I want to wake up at...</h3>
                <p className="text-cyan-100 text-lg mb-6">Calculate optimal bedtimes based on when you need to wake up.</p>
                <span className="mt-auto px-5 py-3 bg-blue-600/30 text-cyan-200 rounded-lg border border-blue-500/30 inline-flex items-center gap-2 text-lg hover:bg-blue-600/40 transition-colors">
                  Choose this option
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
            
            <Link href="/calculator/sleep" className="calculator-option-card transform transition duration-300 hover:scale-102 shadow-lg">
              <div className="flex flex-col items-center p-6 md:p-8 text-center h-full">
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
                <h3 className="text-2xl md:text-3xl font-semibold text-cyan-300 mb-4">I want to go to sleep at...</h3>
                <p className="text-cyan-100 text-lg mb-6">Calculate optimal wake-up times based on when you go to bed.</p>
                <span className="mt-auto px-5 py-3 bg-blue-600/30 text-cyan-200 rounded-lg border border-blue-500/30 inline-flex items-center gap-2 text-lg hover:bg-blue-600/40 transition-colors">
                  Choose this option
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Science Section - Redesigned */}
        <section className="science-section max-w-4xl mx-auto px-4 sm:px-0">
          <h2 className="text-center mb-10 text-3xl md:text-4xl font-semibold">
            <span className="text-gradient-cosmic">The Science of Sleep</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="science-card shadow-md border-blue-500/20 bg-blue-900/10 transition-transform hover:scale-102 hover:-translate-y-1 p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Sleep Cycles Explained</h3>
              <p className="text-cyan-100 mb-4 text-lg">
                Sleep consists of multiple 90-minute cycles, each containing both NREM (Non-Rapid Eye Movement) and REM 
                (Rapid Eye Movement) stages. A complete cycle progresses through:
              </p>
              <ul className="science-list text-cyan-100 pl-5 space-y-2 text-lg">
                <li>NREM Stage 1 (5%): Light sleep, easy to wake</li>
                <li>NREM Stage 2 (45%): Body temperature drops, heart rate slows</li>
                <li>NREM Stage 3 (25%): Deep, restorative sleep</li>
                <li>REM Sleep (25%): Dreams occur, brain is active</li>
              </ul>
            </div>
            
            <div className="science-card shadow-md border-blue-500/20 bg-blue-900/10 transition-transform hover:scale-102 hover:-translate-y-1 p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Circadian Rhythm</h3>
              <p className="text-cyan-100 mb-4 text-lg">
                Your body&apos;s internal clock regulates alertness, body temperature, and hormone release. Key points:
              </p>
              <ul className="science-list text-cyan-100 pl-5 space-y-2 text-lg">
                <li>Melatonin production increases in the evening</li>
                <li>Body temperature reaches its lowest point 2-3 hours before waking</li>
                <li>Cortisol peaks in the morning to increase alertness</li>
                <li>Most people experience an afternoon energy dip</li>
              </ul>
            </div>
            
            <div className="science-card shadow-md border-blue-500/20 bg-blue-900/10 transition-transform hover:scale-102 hover:-translate-y-1 p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Optimal Sleep Duration</h3>
              <p className="text-cyan-100 mb-4 text-lg">
                While individual needs vary, research suggests:
              </p>
              <ul className="science-list text-cyan-100 pl-5 space-y-2 text-lg">
                <li>Adults: 7-9 hours (4-6 complete sleep cycles)</li>
                <li>Teenagers: 8-10 hours</li>
                <li>School-age children: 9-11 hours</li>
                <li>Quality is as important as quantity</li>
              </ul>
            </div>
            
            <div className="science-card shadow-md border-blue-500/20 bg-blue-900/10 transition-transform hover:scale-102 hover:-translate-y-1 p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Sleep Hygiene Tips</h3>
              <p className="text-cyan-100 mb-4 text-lg">
                Improve your sleep quality with these evidence-based practices:
              </p>
              <ul className="science-list text-cyan-100 pl-5 space-y-2 text-lg">
                <li>Maintain a consistent sleep schedule</li>
                <li>Limit blue light exposure before bedtime</li>
                <li>Keep your bedroom cool (65-68°F/18-20°C)</li>
                <li>Avoid caffeine at least 6 hours before bed</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="app-footer text-center py-10 mt-12 text-cyan-300">
        <p className="text-lg">Based on sleep cycle science and circadian rhythm research.</p>
        <p className="mt-2 text-cyan-400/80">© {new Date().getFullYear()} Slumber</p>
      </footer>
    </div>
  );
}