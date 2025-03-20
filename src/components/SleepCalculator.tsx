'use client';

import { useState, useEffect, useRef } from 'react';
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
  
  // Selection states
  const [selectedWakeTimeIndex, setSelectedWakeTimeIndex] = useState<number | null>(null);
  const [selectedBedTimeIndex, setSelectedBedTimeIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
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
  
  // Flag to disable main useEffect temporarily
  const skipMainEffect = useRef(false);
  
  // Helper function to convert a time string to a Date object
  const timeStringToDate = (timeStr: string): Date => {
    const [hoursStr, minutesStr] = timeStr.split(':');
    const [minutes, period] = minutesStr.split(' ');
    
    let hours = parseInt(hoursStr);
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date;
  };
  
  // Calculate results when inputs change
  useEffect(() => {
    // Skip if we're handling a selected time
    if (skipMainEffect.current) {
      skipMainEffect.current = false;
      return;
    }
    
    if (calculationType === 'wakeToBed' && wakeUpTime) {
      setLoading(true);
      
      // Reset selection states
      setSelectedBedTimeIndex(null);
      setSelectedWakeTimeIndex(null);
      setSelectedTime(null);
      
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
        const newDeepWorkPeriods = calculateDeepWorkPeriods(wakeUpTime);
        const newAfternoonSlump = calculateAfternoonSlump(wakeUpTime);
        const newNapTime = calculateNapTime(wakeUpTime);
        
        setDeepWorkPeriods(newDeepWorkPeriods);
        setAfternoonSlump(newAfternoonSlump);
        setNapTime(newNapTime);
        
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
      
      // Reset selection states
      setSelectedBedTimeIndex(null);
      setSelectedWakeTimeIndex(null);
      setSelectedTime(null);
      
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
        const bestWakeTimeDate = timeStringToDate(best);
        
        // Calculate productivity periods based on best wake time
        const newDeepWorkPeriods = calculateDeepWorkPeriods(bestWakeTimeDate);
        const newAfternoonSlump = calculateAfternoonSlump(bestWakeTimeDate);
        const newNapTime = calculateNapTime(bestWakeTimeDate);
        
        setDeepWorkPeriods(newDeepWorkPeriods);
        setAfternoonSlump(newAfternoonSlump);
        setNapTime(newNapTime);
        
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
    setSelectedBedTimeIndex(null);
    setSelectedWakeTimeIndex(null);
    setSelectedTime(null);
  };
  
  // Handle when a wake time is selected (from bedToWake mode)
  const handleWakeTimeSelect = (time: string, index: number) => {
    // Set a flag to skip the main useEffect
    skipMainEffect.current = true;
    setSelectedWakeTimeIndex(index);
    setSelectedBedTimeIndex(null);
    setSelectedTime(time);
    
    // Convert the selected time string to a Date object
    const selectedWakeTime = timeStringToDate(time);
    
    // Calculate new productivity periods based on this wake-up time
    const newDeepWorkPeriods = calculateDeepWorkPeriods(selectedWakeTime);
    const newAfternoonSlump = calculateAfternoonSlump(selectedWakeTime);
    const newNapTime = calculateNapTime(selectedWakeTime);
    
    // Force a direct state update
    setDeepWorkPeriods([...newDeepWorkPeriods]);
    setAfternoonSlump(newAfternoonSlump);
    setNapTime(newNapTime);
    
    // Calculate nap duration
    const napTimeDate = new Date(selectedWakeTime);
    const napDateTime = new Date();
    napDateTime.setHours(napTimeDate.getHours() + 6);
    napDateTime.setMinutes(napTimeDate.getMinutes() + 30);
    setNapDuration(getIdealNapDuration(napDateTime));
    
    // If we're in bedToWake mode and have a chronotype
    if (calculationType === 'bedToWake' && chronotype !== 'unknown') {
      // Update recommendation based on selected wake time
      const recommendation = getPersonalizedSleepRecommendation(
        chronotype as Chronotype,
        ageRange,
        [time]
      );
      setPersonalRecommendation(recommendation);
    }
  };
  
  // Handle when a bedtime is selected (from wakeToBed mode)
  const handleBedTimeSelect = (time: string, index: number) => {
    // Set a flag to skip the main useEffect
    skipMainEffect.current = true;
    setSelectedBedTimeIndex(index);
    setSelectedWakeTimeIndex(null);
    setSelectedTime(time);
    
    const selectedBedTime = timeStringToDate(time);
    
    // For wakeToBed mode, we need to simulate what the wake-up time would be
    // if the user went to bed at this time
    if (calculationType === 'wakeToBed') {
      // Calculate the corresponding wake time (assuming 5 sleep cycles)
      const simulatedWakeUpDate = new Date(selectedBedTime.getTime());
      // 14 min to fall asleep + 90 min per cycle * 5 cycles = 464 minutes
      simulatedWakeUpDate.setMinutes(simulatedWakeUpDate.getMinutes() + 464);
      
      // Calculate new productivity periods based on this simulated wake-up time
      const newDeepWorkPeriods = calculateDeepWorkPeriods(simulatedWakeUpDate);
      const newAfternoonSlump = calculateAfternoonSlump(simulatedWakeUpDate);
      const newNapTime = calculateNapTime(simulatedWakeUpDate);
      
      // Force a direct state update
      setDeepWorkPeriods([...newDeepWorkPeriods]);
      setAfternoonSlump(newAfternoonSlump);
      setNapTime(newNapTime);
      
      // Calculate nap duration
      const napTimeDate = new Date(simulatedWakeUpDate);
      const napDateTime = new Date();
      napDateTime.setHours(napTimeDate.getHours() + 6);
      napDateTime.setMinutes(napTimeDate.getMinutes() + 30);
      setNapDuration(getIdealNapDuration(napDateTime));
      
      // Update personalized recommendation if chronotype is known
      if (chronotype !== 'unknown') {
        const recommendation = getPersonalizedSleepRecommendation(
          chronotype as Chronotype,
          ageRange,
          [time]
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
                selectedIndex={selectedBedTimeIndex}
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
                selectedIndex={selectedWakeTimeIndex}
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
            
            {/* Selected Time Note */}
            {selectedTime && (
              <div className="card-cosmic p-3 md:p-4 rounded-xl shadow-sm border-violet-500/20 bg-violet-900/20">
                <div>
                  <p className="text-sm text-indigo-200 mb-2">
                    <span className="text-violet-300 font-medium">Note:</span> The productivity periods have been updated based on your selected {
                      selectedBedTimeIndex !== null ? 'bedtime' : 'wake-up time'
                    } ({selectedTime}).
                  </p>
                  <p className="text-xs text-indigo-300/70">
                    {selectedBedTimeIndex !== null && calculationType === 'wakeToBed' && 'Showing productivity periods as if you went to bed at this time and slept for 5 complete sleep cycles (7.5 hours).'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}