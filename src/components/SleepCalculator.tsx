'use client';

import { useState, useEffect } from 'react';
import TimeInput from './TimeInput';
import SleepResults from './SleepResults';
import { 
  calculateBedtimes, 
  calculateWakeUpTimes, 
  calculateDeepWorkPeriods,
  calculateAfternoonSlump,
  calculateNapTime,
  getRecommendedSleepDuration,
  getBestWakeTime,
  getIdealNapDuration,
  Chronotype,
  AgeRange,
  getChronotypeRecommendation,
  calculateSleepDuration,
  getSleepCycles,
  getPersonalizedSleepRecommendation
} from '../utils/sleepCalculator';

type CalculationType = 'wakeToBed' | 'bedToWake';
type ChronotypeOption = Chronotype | 'unknown';

// Icons for different sections
const Icons = {
  Bed: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Wake: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Work: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Slump: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  Nap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Chronotype: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Age: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Recommendation: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 glow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};

export default function SleepCalculator() {
  const [calculationType, setCalculationType] = useState<CalculationType>('wakeToBed');
  const [wakeUpTime, setWakeUpTime] = useState<Date | null>(null);
  const [bedTime, setBedTime] = useState<Date | null>(null);
  const [chronotype, setChronotype] = useState<ChronotypeOption>('unknown');
  const [ageRange, setAgeRange] = useState<AgeRange>('adult');
  const [bestWakeUpTime, setBestWakeUpTime] = useState<string>('');
  const [napDuration, setNapDuration] = useState<string>('');
  const [personalRecommendation, setPersonalRecommendation] = useState<string>('');
  
  // Result states
  const [bedtimes, setBedtimes] = useState<string[]>([]);
  const [wakeUpTimes, setWakeUpTimes] = useState<string[]>([]);
  const [deepWorkPeriods, setDeepWorkPeriods] = useState<string[]>([]);
  const [afternoonSlump, setAfternoonSlump] = useState<string>('');
  const [napTime, setNapTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sleepDurations, setSleepDurations] = useState<string[]>([]);
  const [sleepCycles, setSleepCycles] = useState<number[]>([]);
  const [wakeUpSleepDurations, setWakeUpSleepDurations] = useState<string[]>([]);
  const [wakeUpSleepCycles, setWakeUpSleepCycles] = useState<number[]>([]);
  
  // Calculate results when inputs change
  useEffect(() => {
    if (calculationType === 'wakeToBed' && wakeUpTime) {
      setLoading(true);
      
      // Simulate a loading delay for better UX
      setTimeout(() => {
        const newBedtimes = calculateBedtimes(wakeUpTime);
        setBedtimes(newBedtimes);
        
        // Calculate sleep durations and cycles for each bedtime
        const durations: string[] = [];
        const cycles: number[] = [];
        
        newBedtimes.forEach((bedtimeStr) => {
          const duration = calculateSleepDuration(bedtimeStr, wakeUpTime);
          durations.push(duration);
          
          const cycleCount = getSleepCycles(bedtimeStr, wakeUpTime);
          cycles.push(cycleCount);
        });
        
        setSleepDurations(durations);
        setSleepCycles(cycles);
        
        // Calculate productivity periods based on wake-up time
        setDeepWorkPeriods(calculateDeepWorkPeriods(wakeUpTime));
        setAfternoonSlump(calculateAfternoonSlump(wakeUpTime));
        setNapTime(calculateNapTime(wakeUpTime));
        
        // Calculate nap duration
        const napTimeDate = new Date(wakeUpTime);
        const napHours = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getHours();
        const napMins = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getMinutes();
        const napDateTime = new Date();
        napDateTime.setHours(napHours);
        napDateTime.setMinutes(napMins);
        setNapDuration(getIdealNapDuration(napDateTime));
        
        // Generate personalized recommendation if chronotype is known
        if (chronotype !== 'unknown') {
          const recommendation = getPersonalizedSleepRecommendation(
            chronotype as Chronotype, 
            ageRange, 
            newBedtimes
          );
          setPersonalRecommendation(recommendation);
        } else {
          setPersonalRecommendation('');
        }
        
        // Clear other results
        setWakeUpTimes([]);
        setWakeUpSleepDurations([]);
        setWakeUpSleepCycles([]);
        setBestWakeUpTime('');
        
        setLoading(false);
      }, 600);
    } else if (calculationType === 'bedToWake' && bedTime) {
      setLoading(true);
      
      // Simulate a loading delay for better UX
      setTimeout(() => {
        const newWakeUpTimes = calculateWakeUpTimes(bedTime);
        setWakeUpTimes(newWakeUpTimes);
        
        // Calculate sleep durations and cycles for each wake-up time
        const durations: string[] = [];
        const cycles: number[] = [];
        
        newWakeUpTimes.forEach((wakeTimeStr) => {
          const duration = calculateSleepDuration(bedTime, wakeTimeStr);
          durations.push(duration);
          
          const cycleCount = getSleepCycles(bedTime, wakeTimeStr);
          cycles.push(cycleCount);
        });
        
        setWakeUpSleepDurations(durations);
        setWakeUpSleepCycles(cycles);
        
        // Get the best wake up time
        const best = getBestWakeTime(bedTime);
        setBestWakeUpTime(best);
        
        // Calculate productivity periods based on the best wake-up time
        // First, convert best wake time string to Date
        const bestWakeTimeParts = best.split(':');
        const [bestWakeTimeHours, bestWakeTimeMinutesWithPeriod] = bestWakeTimeParts;
        const [bestWakeTimeMinutes, period] = bestWakeTimeMinutesWithPeriod.split(' ');
        
        let hours = parseInt(bestWakeTimeHours);
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        const bestWakeTimeDate = new Date();
        bestWakeTimeDate.setHours(hours);
        bestWakeTimeDate.setMinutes(parseInt(bestWakeTimeMinutes));
        
        // Calculate productivity periods
        setDeepWorkPeriods(calculateDeepWorkPeriods(bestWakeTimeDate));
        setAfternoonSlump(calculateAfternoonSlump(bestWakeTimeDate));
        setNapTime(calculateNapTime(bestWakeTimeDate));
        
        // Calculate nap duration
        const napTimeDate = new Date(bestWakeTimeDate);
        const napHours = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getHours();
        const napMins = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getMinutes();
        const napDateTime = new Date();
        napDateTime.setHours(napHours);
        napDateTime.setMinutes(napMins);
        setNapDuration(getIdealNapDuration(napDateTime));
        
        // Generate personalized recommendation if chronotype is known
        if (chronotype !== 'unknown') {
          const recommendation = getPersonalizedSleepRecommendation(
            chronotype as Chronotype, 
            ageRange, 
            newWakeUpTimes
          );
          setPersonalRecommendation(recommendation);
        } else {
          setPersonalRecommendation('');
        }
        
        // Clear other results
        setBedtimes([]);
        setSleepDurations([]);
        setSleepCycles([]);
        
        setLoading(false);
      }, 600);
    }
  }, [calculationType, wakeUpTime, bedTime, chronotype, ageRange]);
  
  // Handle calculation type change
  const handleTypeChange = (type: CalculationType) => {
    setCalculationType(type);
    // Reset inputs and results when changing calculator type
    setBedTime(null);
    setWakeUpTime(null);
    setBedtimes([]);
    setWakeUpTimes([]);
    setDeepWorkPeriods([]);
    setAfternoonSlump('');
    setNapTime('');
    setNapDuration('');
    setBestWakeUpTime('');
    setSleepDurations([]);
    setSleepCycles([]);
    setWakeUpSleepDurations([]);
    setWakeUpSleepCycles([]);
    setPersonalRecommendation('');
  };
  
  // Update the state and productivity data when a wake time is selected
  const handleWakeTimeSelect = (time: string) => {
    // Parse the selected wake time
    const [hoursStr, minutesStr] = time.split(':');
    const [minutes, period] = minutesStr.split(' ');
    
    let hours = parseInt(hoursStr);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const selectedWakeTime = new Date();
    selectedWakeTime.setHours(hours);
    selectedWakeTime.setMinutes(parseInt(minutes));
    
    // Update wake time and calculate productivity periods
    setWakeUpTime(selectedWakeTime);
    setDeepWorkPeriods(calculateDeepWorkPeriods(selectedWakeTime));
    setAfternoonSlump(calculateAfternoonSlump(selectedWakeTime));
    setNapTime(calculateNapTime(selectedWakeTime));
    
    // Calculate nap duration
    const napTimeDate = new Date(selectedWakeTime);
    const napHours = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getHours();
    const napMins = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getMinutes();
    const napDateTime = new Date();
    napDateTime.setHours(napHours);
    napDateTime.setMinutes(napMins);
    setNapDuration(getIdealNapDuration(napDateTime));
    
    // If in bedToWake mode and have a bedTime, update all calculations
    if (calculationType === 'bedToWake' && bedTime) {
      // Calculate sleep duration for this specific wake-up time
      const duration = calculateSleepDuration(bedTime, selectedWakeTime);
      const cycleCount = getSleepCycles(bedTime, selectedWakeTime);
      
      // Update the sleep duration and cycles (in arrays with single item)
      setWakeUpSleepDurations([duration]);
      setWakeUpSleepCycles([cycleCount]);
      
      // Update recommendation based on selected wake time if chronotype is known
      if (chronotype !== 'unknown') {
        const recommendation = getPersonalizedSleepRecommendation(
          chronotype as Chronotype,
          ageRange,
          [time]
        );
        setPersonalRecommendation(recommendation);
      }
    } 
    // If in wakeToBed mode, calculate new bedtimes and update all calculations
    else if (calculationType === 'wakeToBed') {
      // Calculate new bedtimes
      const newBedtimes = calculateBedtimes(selectedWakeTime);
      setBedtimes(newBedtimes);
      
      // Calculate sleep durations and cycles for each bedtime
      const durations: string[] = [];
      const cycles: number[] = [];
      
      newBedtimes.forEach((bedtimeStr) => {
        const duration = calculateSleepDuration(bedtimeStr, selectedWakeTime);
        durations.push(duration);
        
        const cycleCount = getSleepCycles(bedtimeStr, selectedWakeTime);
        cycles.push(cycleCount);
      });
      
      setSleepDurations(durations);
      setSleepCycles(cycles);
      
      // Generate personalized recommendation if chronotype is known
      if (chronotype !== 'unknown') {
        const recommendation = getPersonalizedSleepRecommendation(
          chronotype as Chronotype,
          ageRange,
          newBedtimes
        );
        setPersonalRecommendation(recommendation);
      }
    }
  };
  
  // Update the state and productivity data when a bedtime is selected
  const handleBedTimeSelect = (time: string) => {
    // Parse the selected bedtime
    const [hoursStr, minutesStr] = time.split(':');
    const [minutes, period] = minutesStr.split(' ');
    
    let hours = parseInt(hoursStr);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const selectedBedTime = new Date();
    selectedBedTime.setHours(hours);
    selectedBedTime.setMinutes(parseInt(minutes));
    
    // Update bed time
    setBedTime(selectedBedTime);
    
    // If in wakeToBed mode and we have a wake-up time, update all calculations
    if (calculationType === 'wakeToBed' && wakeUpTime) {
      // Calculate sleep duration for this specific bedtime
      const duration = calculateSleepDuration(selectedBedTime, wakeUpTime);
      const cycleCount = getSleepCycles(selectedBedTime, wakeUpTime);
      
      // We're setting these as arrays with a single item because our UI expects arrays
      setSleepDurations([duration]);
      setSleepCycles([cycleCount]);
      
      // Update productivity periods based on the wake-up time
      setDeepWorkPeriods(calculateDeepWorkPeriods(wakeUpTime));
      setAfternoonSlump(calculateAfternoonSlump(wakeUpTime));
      setNapTime(calculateNapTime(wakeUpTime));
      
      // Calculate nap duration
      const napTimeDate = new Date(wakeUpTime);
      const napHours = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getHours();
      const napMins = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getMinutes();
      const napDateTime = new Date();
      napDateTime.setHours(napHours);
      napDateTime.setMinutes(napMins);
      setNapDuration(getIdealNapDuration(napDateTime));
      
      // Update recommendation
      if (chronotype !== 'unknown') {
        const recommendation = getPersonalizedSleepRecommendation(
          chronotype as Chronotype,
          ageRange,
          [time]
        );
        setPersonalRecommendation(recommendation);
      }
    } 
    // If in bedToWake mode, calculate new wake-up times and update all calculations
    else if (calculationType === 'bedToWake') {
      // Calculate new wake-up times
      const newWakeUpTimes = calculateWakeUpTimes(selectedBedTime);
      setWakeUpTimes(newWakeUpTimes);
      
      // Calculate sleep durations and cycles for each wake-up time
      const durations: string[] = [];
      const cycles: number[] = [];
      
      newWakeUpTimes.forEach((wakeTimeStr) => {
        const duration = calculateSleepDuration(selectedBedTime, wakeTimeStr);
        durations.push(duration);
        
        const cycleCount = getSleepCycles(selectedBedTime, wakeTimeStr);
        cycles.push(cycleCount);
      });
      
      setWakeUpSleepDurations(durations);
      setWakeUpSleepCycles(cycles);
      
      // Get the best wake up time
      const best = getBestWakeTime(selectedBedTime);
      setBestWakeUpTime(best);
      
      // Calculate productivity periods based on the best wake-up time
      const bestWakeTimeParts = best.split(':');
      const [bestWakeTimeHours, bestWakeTimeMinutesWithPeriod] = bestWakeTimeParts;
      const [bestWakeTimeMinutes, bestPeriod] = bestWakeTimeMinutesWithPeriod.split(' ');
      
      let bestHours = parseInt(bestWakeTimeHours);
      if (bestPeriod === 'PM' && bestHours < 12) bestHours += 12;
      if (bestPeriod === 'AM' && bestHours === 12) bestHours = 0;
      
      const bestWakeTimeDate = new Date();
      bestWakeTimeDate.setHours(bestHours);
      bestWakeTimeDate.setMinutes(parseInt(bestWakeTimeMinutes));
      
      // Use the best wake time to calculate productivity periods
      setDeepWorkPeriods(calculateDeepWorkPeriods(bestWakeTimeDate));
      setAfternoonSlump(calculateAfternoonSlump(bestWakeTimeDate));
      setNapTime(calculateNapTime(bestWakeTimeDate));
      
      // Calculate nap duration
      const napTimeDate = new Date(bestWakeTimeDate);
      const napHours = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getHours();
      const napMins = new Date(napTimeDate.getTime() + 6.5 * 60 * 60 * 1000).getMinutes();
      const napDateTime = new Date();
      napDateTime.setHours(napHours);
      napDateTime.setMinutes(napMins);
      setNapDuration(getIdealNapDuration(napDateTime));
      
      // Generate personalized recommendation if chronotype is known
      if (chronotype !== 'unknown') {
        const recommendation = getPersonalizedSleepRecommendation(
          chronotype as Chronotype,
          ageRange,
          newWakeUpTimes
        );
        setPersonalRecommendation(recommendation);
      }
    }
  };
  
  // Generate chronotype recommendations if available
  const chronotypeRecommendation = chronotype !== 'unknown' 
    ? getChronotypeRecommendation(chronotype as Chronotype) 
    : '';
  
  return (
    <div className="sleep-calculator-container">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Calculator Type Selector */}
        <div className="calculation-type-selector">
          <div className="card-cosmic p-1.5 rounded-xl shadow-sm inline-flex gap-3 border-violet-500/20 w-full max-w-md overflow-x-auto glow-border">
            <button
              onClick={() => handleTypeChange('wakeToBed')}
              className={`calculation-type-button ${
                calculationType === 'wakeToBed' ? 'active' : ''
              }`}
            >
              <Icons.Wake />
              <span>From Wake-up</span>
            </button>
            <button
              onClick={() => handleTypeChange('bedToWake')}
              className={`calculation-type-button ${
                calculationType === 'bedToWake' ? 'active' : ''
              }`}
            >
              <Icons.Bed />
              <span>From Bedtime</span>
            </button>
          </div>
        </div>
        
        {/* Personal profile */}
        <div className="card-cosmic p-4 md:p-5 rounded-xl shadow-sm border-violet-500/20">
          <h3 className="text-lg font-medium text-violet-300 mb-3 md:mb-4 glow-text">Personal Sleep Profile</h3>
          
          <div className="flex flex-col space-y-4">
            {/* Chronotype Selection */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-indigo-200">
                Your Chronotype (Sleep-Wake Tendency)
              </label>
              <div className="chronotype-selector">
                {(['early', 'intermediate', 'late'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChronotype(type)}
                    className={`chronotype-button ${
                      chronotype === type ? 'active' : ''
                    }`}
                  >
                    {type === 'early' && "Early Bird (Morning Lark)"}
                    {type === 'intermediate' && "Intermediate"}
                    {type === 'late' && "Night Owl"}
                  </button>
                ))}
              </div>
              {chronotypeRecommendation && (
                <p className="mt-3 text-sm text-indigo-300">
                  <span className="font-medium text-violet-300">Chronotype:</span> {chronotypeRecommendation}
                </p>
              )}
            </div>
            
            {/* Age Range Selection */}
            <div>
              <label className="block text-sm font-medium mb-1.5 text-indigo-200">
                Your Age Range
              </label>
              <div className="chronotype-selector">
                {(['teen', 'adult', 'older-adult'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setAgeRange(range)}
                    className={`chronotype-button ${
                      ageRange === range ? 'active' : ''
                    }`}
                  >
                    {range === 'teen' && "Teen (13-17)"}
                    {range === 'adult' && "Adult (18-64)"}
                    {range === 'older-adult' && "Older Adult (65+)"}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-indigo-300">
                <span className="font-medium text-violet-300">Sleep Needs:</span> {getRecommendedSleepDuration(ageRange)} of quality sleep is recommended for your age range.
              </p>
            </div>
          </div>
        </div>
        
        {/* Time Input Section */}
        <div className="card-cosmic p-4 md:p-5 rounded-xl shadow-sm border-violet-500/20">
          {calculationType === 'wakeToBed' ? (
            <TimeInput 
              label="What time do you want to wake up?" 
              onTimeChange={setWakeUpTime}
              placeholder="e.g., 7:00 AM"
            />
          ) : (
            <TimeInput 
              label="What time do you want to go to bed?" 
              onTimeChange={setBedTime}
              placeholder="e.g., 10:00 PM"
            />
          )}
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="loading-dots">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          </div>
        )}
        
        {/* Results Sections */}
        {!loading && (
          <div className="space-y-4 md:space-y-6 mt-1 md:mt-2">
            {/* Personal Recommendation */}
            {personalRecommendation && (
              <div className="card-cosmic p-4 md:p-5 rounded-xl shadow-sm border-violet-500/20 bg-gradient-to-br from-indigo-950/80 to-violet-950/80">
                <div className="flex items-start space-x-3">
                  <Icons.Recommendation />
                  <div>
                    <h3 className="text-lg font-medium text-violet-300 mb-2">Your Personalized Recommendation</h3>
                    <p className="text-indigo-200 text-sm">{personalRecommendation}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bedtime Results */}
            {bedtimes.length > 0 && (
              <SleepResults 
                title="Optimal Bedtimes"
                items={bedtimes}
                description="Go to bed at one of these times for optimal sleep cycles and to wake up feeling refreshed."
                icon={<Icons.Bed />}
                accent="violet"
                sleepDurations={sleepDurations}
                cycles={sleepCycles}
                onSelect={handleBedTimeSelect}
              />
            )}
            
            {/* Wake-up Time Results */}
            {wakeUpTimes.length > 0 && (
              <SleepResults 
                title="Optimal Wake-up Times"
                items={wakeUpTimes}
                description={bestWakeUpTime ? `The best wake-up time is ${bestWakeUpTime} (aligns with both sleep cycles and natural light).` : ''}
                icon={<Icons.Wake />}
                accent="indigo"
                onSelect={handleWakeTimeSelect}
                sleepDurations={wakeUpSleepDurations}
                cycles={wakeUpSleepCycles}
              />
            )}
            
            {/* Deep Work Periods */}
            {deepWorkPeriods.length > 0 && (
              <SleepResults 
                title="Optimal Deep Work Periods"
                items={deepWorkPeriods}
                description="Schedule your most important tasks during these high alertness periods for maximum productivity."
                icon={<Icons.Work />}
                accent="purple"
              />
            )}
            
            {/* Afternoon Slump */}
            {afternoonSlump && (
              <SleepResults 
                title="Afternoon Energy Dip"
                items={[afternoonSlump]}
                description="This is when your body naturally experiences an energy dip. Consider a short nap or lighter tasks during this period."
                icon={<Icons.Slump />}
                accent="blue"
              />
            )}
            
            {/* Optimal Nap Time */}
            {napTime && (
              <SleepResults 
                title="Optimal Nap Time"
                items={[napTime]}
                description={`Recommended nap duration: ${napDuration}`}
                icon={<Icons.Nap />}
                accent="cyan"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}