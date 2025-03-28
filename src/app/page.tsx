import SleepCalculator from '../components/SleepCalculator';

export default function Home() {
  return (
    <div className="min-h-screen pb-12">
      <div className="content-container px-4 sm:px-6">
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
              <span className="text-gradient-cosmic">Sleep Cycle Calculator</span>
            </h1>
            <p className="text-indigo-200 max-w-2xl text-center leading-relaxed">
              Optimize your sleep schedule and daily productivity by aligning with your natural sleep cycles
              and circadian rhythm.
            </p>
          </div>
          
          <div className="card-cosmic rounded-xl shadow-sm border-violet-500/20 mb-4 sm:mb-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-indigo-200">
                <p className="font-medium mb-1 text-violet-300">About Sleep Cycles</p>
                <p className="text-sm">Each sleep cycle lasts about 90 minutes and consists of different stages. Waking up at the end of a cycle helps you feel more refreshed, while waking during deep sleep can cause grogginess.</p>
              </div>
            </div>
          </div>
        </header>
        
        <SleepCalculator />
        
        <div className="science-section max-w-3xl mx-auto">
          <h2 className="text-white text-center glow-text">
            <span className="text-gradient-cosmic">The Science of Sleep</span>
          </h2>
          <div className="science-grid">
            <div className="science-card shadow-sm border-violet-500/20">
              <h3>Sleep Cycles Explained</h3>
              <p>
                Sleep consists of multiple 90-minute cycles, each containing both NREM (Non-Rapid Eye Movement) and REM 
                (Rapid Eye Movement) stages. A complete cycle progresses through:
              </p>
              <ul className="science-list">
                <li>NREM Stage 1 (5%): Light sleep, easy to wake</li>
                <li>NREM Stage 2 (45%): Body temperature drops, heart rate slows</li>
                <li>NREM Stage 3 (25%): Deep, restorative sleep</li>
                <li>REM Sleep (25%): Dreams occur, brain is active</li>
              </ul>
            </div>
            
            <div className="science-card shadow-sm border-violet-500/20">
              <h3>Circadian Rhythm</h3>
              <p>
                Your body&apos;s internal clock regulates alertness, body temperature, and hormone release. Key points:
              </p>
              <ul className="science-list">
                <li>Melatonin production increases in the evening</li>
                <li>Body temperature reaches its lowest point 2-3 hours before waking</li>
                <li>Cortisol peaks in the morning to increase alertness</li>
                <li>Most people experience an afternoon energy dip</li>
              </ul>
            </div>
            
            <div className="science-card shadow-sm border-violet-500/20">
              <h3>Optimal Sleep Duration</h3>
              <p>
                While individual needs vary, research suggests:
              </p>
              <ul className="science-list">
                <li>Adults: 7-9 hours (4-6 complete sleep cycles)</li>
                <li>Teenagers: 8-10 hours</li>
                <li>School-age children: 9-11 hours</li>
                <li>Quality is as important as quantity</li>
              </ul>
            </div>
            
            <div className="science-card shadow-sm border-violet-500/20">
              <h3>Sleep Hygiene Tips</h3>
              <p>
                Improve your sleep quality with these evidence-based practices:
              </p>
              <ul className="science-list">
                <li>Maintain a consistent sleep schedule</li>
                <li>Limit blue light exposure before bedtime</li>
                <li>Keep your bedroom cool (65-68°F/18-20°C)</li>
                <li>Avoid caffeine at least 6 hours before bed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <p>Based on sleep cycle science and circadian rhythm research.</p>
        <p className="mt-1">© {new Date().getFullYear()} Sleep Cycle Calculator</p>
      </footer>
    </div>
  );
}