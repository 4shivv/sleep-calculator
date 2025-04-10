'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import StarryBackground from '../../components/StarryBackground';

export default function CalculatorIndex() {
  const router = useRouter();
  
  // Auto-redirect to home page after a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen pb-12 relative">
      <StarryBackground />
      <div className="content-container px-4 sm:px-6 relative z-10">
        <header className="app-header max-w-3xl mx-auto pt-8 pb-6 sm:pt-12 sm:pb-8">
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <div className="inline-flex items-center justify-center p-2.5 bg-indigo-900/30 rounded-full mb-3 glow-border">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-7 h-7 sm:w-8 sm:h-8 text-violet-400 glow-icon animate-twinkle" 
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
            <h1 className="text-center glow-text">
              <span className="text-gradient-cosmic">Slumber</span>
            </h1>
            <p className="text-indigo-200 max-w-2xl text-center leading-relaxed">
              Redirecting to home page...
            </p>
          </div>
          
          <div className="card-cosmic rounded-xl shadow-sm border-violet-500/20 mb-4 sm:mb-6 p-6 text-center">
            <p className="text-indigo-200 mb-4">
              Please select one of the calculator options below, or wait to be redirected to the home page.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <Link href="/calculator/wake" className="btn-primary py-3 rounded-lg flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>I want to wake up at...</span>
              </Link>
              
              <Link href="/calculator/sleep" className="btn-primary py-3 rounded-lg flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>I want to go to sleep at...</span>
              </Link>
              
              <Link href="/" className="btn-secondary py-3 rounded-lg flex items-center justify-center gap-2 col-span-1 sm:col-span-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </header>
      </div>
      
      <footer className="app-footer">
        <p>Based on sleep cycle science and circadian rhythm research.</p>
        <p className="mt-1">© {new Date().getFullYear()} Slumber</p>
      </footer>
    </div>
  );
}