'use client';

import React from 'react';
import Link from 'next/link';
import StarryBackground from '../../../components/StarryBackground';

export default function SleepScienceBlog() {
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            </div>
            <h1 className="text-center glow-text text-5xl md:text-6xl font-bold mb-8">
              <span className="text-gradient-cosmic">The Science of Sleep</span>
            </h1>
            <p className="text-blue-200 max-w-2xl text-center leading-relaxed text-xl md:text-2xl mb-8">
              Understanding the complex mechanisms behind sleep and how optimizing your sleep patterns can improve your life
            </p>
            <div className="flex items-center gap-3 text-blue-300 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <time>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              <span className="mx-2">•</span>
              <span>8 min read</span>
            </div>
          </div>
        </header>
        
        {/* Main Blog Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-0 mb-16">
          <div className="prose prose-lg prose-blue mx-auto text-blue-100">
            {/* Introduction */}
            <p className="text-xl leading-relaxed mb-8">
              Sleep is a fundamental biological process that affects nearly every aspect of our health and wellbeing. 
              Understanding how sleep works can help you optimize your own sleep patterns for better health, enhanced 
              cognitive performance, and improved quality of life.
            </p>
            
            {/* Sleep Cycles Section */}
            <section className="mb-12">
              <h2 className="text-4xl font-semibold text-cyan-300 mb-6">Sleep Cycles Explained</h2>
              <p className="text-blue-100 mb-6 text-xl">
                Sleep consists of multiple 90-minute cycles, each containing both NREM (Non-Rapid Eye Movement) and REM 
                (Rapid Eye Movement) stages. A complete cycle progresses through distinct phases that serve different 
                physiological purposes.
              </p>
              
              <div className="backdrop-blur-sm p-8 mb-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-cyan-300 mb-4">The Stages of Sleep</h3>
                <ul className="science-list text-blue-100 pl-5 space-y-4 text-xl">
                  <li>
                    <strong className="text-cyan-200">NREM Stage 1 (5% of total sleep):</strong> Light sleep where you 
                    drift in and out of consciousness. Your muscles relax, breathing and heart rate begin to slow down, 
                    and brain activity starts to decrease. It&apos;s easy to wake from this stage.
                  </li>
                  <li>
                    <strong className="text-cyan-200">NREM Stage 2 (45% of total sleep):</strong> A deeper sleep state 
                    where body temperature drops and heart rate continues to slow. Your brain produces brief bursts of 
                    activity called sleep spindles, which are thought to help with memory consolidation.
                  </li>
                  <li>
                    <strong className="text-cyan-200">NREM Stage 3 (25% of total sleep):</strong> This is deep, 
                    slow-wave sleep that&apos;s most difficult to wake from. It&apos;s deeply restorative – your body repairs 
                    tissues, builds bone and muscle, and strengthens the immune system during this stage.
                  </li>
                  <li>
                    <strong className="text-cyan-200">REM Sleep (25% of total sleep):</strong> Brain activity increases 
                    to levels similar to wakefulness. This is when most dreaming occurs. Your body experiences temporary 
                    muscle paralysis (to prevent you from acting out dreams), while your brain processes emotions and 
                    consolidates memories. REM sleep supports learning and cognitive function.
                  </li>
                </ul>
              </div>
              
              <p className="text-blue-100 text-xl">
                These cycles repeat throughout the night, with earlier cycles having more NREM Stage 3 sleep, and later 
                cycles having more REM sleep. Waking up during deep sleep can cause sleep inertia (grogginess), which 
                is why timing your wake-up to coincide with the end of a full cycle can help you feel more refreshed.
              </p>
            </section>
            
            {/* Circadian Rhythm Section */}
            <section className="mb-12">
              <h2 className="text-4xl font-semibold text-cyan-300 mb-6">Circadian Rhythm</h2>
              <p className="text-blue-100 mb-6 text-xl">
                Your circadian rhythm is your body&apos;s internal 24-hour clock that regulates your sleep-wake cycle. This 
                biological timekeeper influences multiple bodily functions including hormone release, body temperature, 
                and metabolism.
              </p>
              
              <div className="backdrop-blur-sm p-8 mb-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Key Components of Circadian Rhythm</h3>
                <ul className="science-list text-blue-100 pl-5 space-y-4 text-xl">
                  <li>
                    <strong className="text-cyan-200">Melatonin production:</strong> The pineal gland increases 
                    melatonin release in the evening when light levels decrease, signaling to your body that it&apos;s 
                    time to sleep. This hormone helps regulate your sleep-wake timing.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Body temperature fluctuation:</strong> Your core temperature 
                    naturally drops by 1-2°F during sleep, reaching its lowest point 2-3 hours before you typically 
                    wake up. This temperature dip facilitates optimal sleep quality.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Cortisol rhythm:</strong> This stress hormone follows a daily 
                    pattern, with levels peaking in the early morning hours to increase alertness and prepare your 
                    body for daily activities.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Afternoon energy dip:</strong> Most people experience a natural 
                    decrease in alertness in the mid-afternoon (typically between 1-3 PM), which is a normal part of 
                    the circadian cycle rather than simply a post-lunch effect.
                  </li>
                </ul>
              </div>
              
              <p className="text-blue-100 text-xl">
                Light exposure is the most powerful influence on your circadian rhythm. Morning sunlight helps reset 
                your body clock and promotes alertness, while limiting blue light exposure in the evening helps your 
                body prepare for sleep. Maintaining a consistent sleep-wake schedule reinforces healthy circadian rhythms.
              </p>
            </section>
            
            {/* Optimal Sleep Duration Section */}
            <section className="mb-12">
              <h2 className="text-4xl font-semibold text-cyan-300 mb-6">Optimal Sleep Duration</h2>
              <p className="text-blue-100 mb-6 text-xl">
                While sleep needs are highly individual, scientific research has established general guidelines for 
                optimal sleep duration across different age groups. These recommendations are based on extensive 
                studies of cognitive performance, physical health outcomes, and overall wellbeing.
              </p>
              
              <div className="backdrop-blur-sm p-8 mb-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Recommended Sleep Durations</h3>
                <ul className="science-list text-blue-100 pl-5 space-y-4 text-xl">
                  <li>
                    <strong className="text-cyan-200">Adults (18-64 years):</strong> 7-9 hours (equivalent to 4-6 
                    complete sleep cycles). This range supports optimal cognitive function, emotional regulation, 
                    and physical health maintenance.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Teenagers (13-17 years):</strong> 8-10 hours. Adolescents 
                    require more sleep to support rapid growth, hormonal changes, and brain development. This age 
                    group also experiences a natural shift toward later sleep timing.
                  </li>
                  <li>
                    <strong className="text-cyan-200">School-age children (6-12 years):</strong> 9-11 hours. 
                    Adequate sleep in children supports learning, attention, emotional regulation, and physical 
                    development.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Quality matters:</strong> Sleep duration alone doesn&apos;t 
                    determine restfulness. Sleep continuity (minimal disruptions), timing aligned with your circadian 
                    rhythm, and sufficient time in each sleep stage all contribute to restorative sleep.
                  </li>
                </ul>
              </div>
              
              <p className="text-blue-100 text-xl">
                Consistently getting less sleep than your body needs can lead to sleep debt, which accumulates over 
                time and can impair cognitive function, mood, and physical health. While occasional short nights 
                can be compensated for with recovery sleep, chronic sleep deprivation has been linked to serious 
                health conditions including cardiovascular disease, metabolic disorders, and impaired immune function.
              </p>
            </section>
            
            {/* Sleep Hygiene Section */}
            <section className="mb-12">
              <h2 className="text-4xl font-semibold text-cyan-300 mb-6">Sleep Hygiene Tips</h2>
              <p className="text-blue-100 mb-6 text-xl">
                Sleep hygiene refers to practices and habits that promote good sleep quality and full daytime 
                alertness. Research has identified several evidence-based strategies that can significantly 
                improve sleep quality for most people.
              </p>
              
              <div className="backdrop-blur-sm p-8 mb-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Evidence-Based Sleep Practices</h3>
                <ul className="science-list text-blue-100 pl-5 space-y-4 text-xl">
                  <li>
                    <strong className="text-cyan-200">Maintain a consistent schedule:</strong> Going to bed and 
                    waking up at the same times every day (even on weekends) helps regulate your body&#39;s internal 
                    clock and can improve sleep quality. Consistency reinforces your natural circadian rhythm.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Limit blue light exposure:</strong> The blue light emitted 
                    by screens (phones, tablets, computers) suppresses melatonin production. Try to avoid screens 
                    1-2 hours before bedtime or use blue light filtering glasses or apps if necessary.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Optimize your sleep environment:</strong> Keep your bedroom 
                    cool (65-68°F/18-20°C), dark, and quiet. Temperature regulation is particularly important for 
                    sleep initiation and maintenance.
                  </li>
                  <li>
                    <strong className="text-cyan-200">Mind your consumption:</strong> Avoid caffeine at least 6 
                    hours before bedtime, as its stimulant effects can last much longer than you might expect. 
                    Similarly, while alcohol might help you fall asleep initially, it disrupts sleep architecture 
                    and reduces sleep quality.
                  </li>
                </ul>
              </div>
              
              <p className="text-blue-100 text-xl">
                Additional research-backed practices include creating a relaxing pre-sleep routine to signal to 
                your body that it&apos;s time to wind down, exercising regularly (but not too close to bedtime), 
                reserving your bed primarily for sleep to strengthen the association between your bed and 
                sleepiness, and managing stress through relaxation techniques like deep breathing, meditation, 
                or progressive muscle relaxation.
              </p>
            </section>
            
            {/* Conclusion */}
            <section className="mb-8">
              <h2 className="text-4xl font-semibold text-cyan-300 mb-6">Putting It All Together</h2>
              <p className="text-blue-100 text-xl mb-6">
                Understanding the science of sleep empowers you to make informed decisions about your sleep habits. 
                By aligning your sleep schedule with your body&apos;s natural cycles, you can optimize both your sleep 
                quality and your waking performance.
              </p>
              <p className="text-blue-100 text-xl mb-6">
                Our sleep calculator helps you implement this scientific knowledge by calculating optimal bedtimes 
                or wake-up times based on sleep cycle duration, ensuring you wake up at the end of a complete cycle 
                rather than during deep sleep.
              </p>
              <div className="flex justify-center mt-10">
                <Link href="/" className="px-6 py-4 bg-blue-600/30 text-cyan-200 rounded-lg border border-blue-500/30 inline-flex items-center gap-3 text-xl hover:bg-blue-600/40 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Sleep Calculator
                </Link>
              </div>
            </section>
          </div>
        </article>
      </div>
      
      <footer className="app-footer text-center py-10 mt-16 text-cyan-300">
        <p className="text-xl">Based on sleep cycle science and circadian rhythm research.</p>
        <p className="mt-2 text-cyan-400/80">© {new Date().getFullYear()} Slumber</p>
      </footer>
    </div>
  );
}