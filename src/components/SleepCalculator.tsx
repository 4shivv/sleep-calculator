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
type SleepDeficitLevel = 'none' | 'mild' | 'moderate' | 'severe';

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
  const [chronotype, setChronotype] = useState<ChronotypeOption>('intermediate'); // Set intermediate as default
  const [ageRange, setAgeRange] = useState<AgeRange>('adult');
  const [bestWakeUpTime, setBestWakeUpTime] = useState<string>('');
  const [napDurations, setNapDurations] = useState<string[]>([]);
  const [personalRecommendation, setPersonalRecommendation] = useState<string>('');
  
  // Selection states
  const [selectedWakeTimeIndex, setSelectedWakeTimeIndex] = useState<number | null>(null);
  const [selectedBedTimeIndex, setSelectedBedTimeIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sleepDeficitLevel, setSleepDeficitLevel] = useState<SleepDeficitLevel>('none');
  
  // Result states
  const [bedtimes, setBedtimes] = useState<string[]>([]);
  const [wakeUpTimes, setWakeUpTimes] = useState<string[]>([]);
  const [deepWorkPeriods, setDeepWorkPeriods] = useState<string[]>([]);
  const [energyDips, setEnergyDips] = useState<string[]>([]);
  const [napTimes, setNapTimes] = useState<string[]>([]);
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
  
  // Helper to check sleep deficiency level
  const checkSleepDeficiency = (sleepDurationStr: string, ageRange: AgeRange): SleepDeficitLevel => {
    // Extract hours from sleep duration string (e.g., "7 hours 30 mins" -> 7.5)
    const hourMatch = sleepDurationStr.match(/(\d+)\s*hours?/);
    const minuteMatch = sleepDurationStr.match(/(\d+)\s*mins?/);
    
    let hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    
    // Convert to decimal hours
    const totalHours = hours + (minutes / 60);
    
    // Get recommended hours based on age range
    let minRecommendedHours = 7; // Default for adult
    let optimalHours = 8; // Default optimal for adult
    
    if (ageRange === 'teen') {
      minRecommendedHours = 8;
      optimalHours = 9;
    } else if (ageRange === 'adult') {
      minRecommendedHours = 7;
      optimalHours = 8;
    } else if (ageRange === 'older-adult') {
      minRecommendedHours = 7;
      optimalHours = 7.5;
    }
    
    // Determine deficit level
    if (totalHours >= optimalHours) {
      return 'none';
    } else if (totalHours >= minRecommendedHours) {
      return 'mild';
    } else if (totalHours >= minRecommendedHours - 1.5) {
      return 'moderate';
    } else {
      return 'severe';
    }
  };
  
  // Helper to get scientifically accurate nap recommendations
  const getScientificNapRecommendation = (napTime: Date, deficitLevel: SleepDeficitLevel): string => {
    const hours = napTime.getHours();
    
    // Base recommendations on time of day and sleep deficit
    if (hours < 12) {
      // Morning naps (before noon)
      if (deficitLevel === 'severe') {
        return "90 minutes (full sleep cycle) to address significant sleep deficit";
      } else if (deficitLevel === 'moderate') {
        return "20-30 minutes (refreshing without grogginess) or 90 minutes (full cycle)";
      } else {
        return "10-20 minutes (alertness boost without sleep inertia)";
      }
    } else if (hours < 15) {
      // Early afternoon naps (12pm-3pm, optimal nap window)
      if (deficitLevel === 'severe' || deficitLevel === 'moderate') {
        return "90 minutes (complete sleep cycle with REM) for recovery";
      } else if (deficitLevel === 'mild') {
        return "30 minutes (some deep sleep) or 90 minutes (full cycle)";
      } else {
        return "20 minutes (optimal power nap) or 90 minutes (full cycle)";
      }
    } else if (hours < 17) {
      // Late afternoon naps (3pm-5pm)
      if (deficitLevel === 'severe') {
        return "90 minutes (full sleep cycle) but may affect night sleep";
      } else {
        return "10-20 minutes (alertness without affecting night sleep)";
      }
    } else {
      // Evening naps (after 5pm)
      if (deficitLevel === 'severe') {
        return "20-30 minutes maximum (avoid disrupting night sleep)";
      } else {
        return "10 minutes maximum (brief refresher only)";
      }
    }
  };
  
  // Helper to calculate multiple nap times and energy dips
  const calculateMultipleTimeOptions = (wakeUpTime: Date, deficitLevel: SleepDeficitLevel) => {
    // Energy dips calculation based on circadian rhythm research
    const energyDips = [];
    
    // Primary afternoon dip (occurs 6-8 hours after waking)
    const postLunchDipStart = new Date(wakeUpTime);
    postLunchDipStart.setHours(postLunchDipStart.getHours() + 6);
    const postLunchDipEnd = new Date(postLunchDipStart);
    postLunchDipEnd.setHours(postLunchDipEnd.getHours() + 2);
    
    // Evening dip (occurs 12-14 hours after waking)
    const eveningDipStart = new Date(wakeUpTime);
    eveningDipStart.setHours(eveningDipStart.getHours() + 12);
    const eveningDipEnd = new Date(eveningDipStart);
    eveningDipEnd.setHours(eveningDipEnd.getHours() + 2);
    
    // Format dips as strings
    const postLunchDipStr = `${formatTime(postLunchDipStart)} - ${formatTime(postLunchDipEnd)}`;
    const eveningDipStr = `${formatTime(eveningDipStart)} - ${formatTime(eveningDipEnd)}`;
    
    // Mid-morning dip (only for sleep deprived individuals)
    let morningDipStr = '';
    if (deficitLevel === 'moderate' || deficitLevel === 'severe') {
      const morningDipStart = new Date(wakeUpTime);
      morningDipStart.setHours(morningDipStart.getHours() + 3);
      const morningDipEnd = new Date(morningDipStart);
      morningDipEnd.setMinutes(morningDipEnd.getMinutes() + 60);
      morningDipStr = `${formatTime(morningDipStart)} - ${formatTime(morningDipEnd)}`;
    }
    
    // Order energy dips chronologically
    if (morningDipStr) energyDips.push(morningDipStr);
    energyDips.push(postLunchDipStr);
    energyDips.push(eveningDipStr);
    
    // Calculate nap times based on circadian rhythms and sleep deficit
    const napTimeObjects = [];
    
    // Late morning nap (4-5 hours after waking) for sleep deficient
    if (deficitLevel === 'mild' || deficitLevel === 'moderate' || deficitLevel === 'severe') {
      const morningNapTime = new Date(wakeUpTime);
      morningNapTime.setHours(morningNapTime.getHours() + 4.5);
      napTimeObjects.push({
        time: morningNapTime,
        duration: getScientificNapRecommendation(morningNapTime, deficitLevel)
      });
    }
    
    // Primary nap time (early afternoon, 6-7 hours after waking)
    // This is the ideal nap time that aligns with natural circadian dip
    const primaryNapTime = new Date(wakeUpTime);
    primaryNapTime.setHours(primaryNapTime.getHours() + 6.5);
    napTimeObjects.push({
      time: primaryNapTime,
      duration: getScientificNapRecommendation(primaryNapTime, deficitLevel)
    });
    
    // Late afternoon nap (8-9 hours after waking)
    if (deficitLevel === 'moderate' || deficitLevel === 'severe') {
      const lateAfternoonNapTime = new Date(wakeUpTime);
      lateAfternoonNapTime.setHours(lateAfternoonNapTime.getHours() + 8.5);
      napTimeObjects.push({
        time: lateAfternoonNapTime,
        duration: getScientificNapRecommendation(lateAfternoonNapTime, deficitLevel)
      });
    }
    
    // Early evening nap (for severely sleep deprived)
    if (deficitLevel === 'severe') {
      const eveningNapTime = new Date(wakeUpTime);
      eveningNapTime.setHours(eveningNapTime.getHours() + 11);
      napTimeObjects.push({
        time: eveningNapTime,
        duration: getScientificNapRecommendation(eveningNapTime, deficitLevel)
      });
    }
    
    // Sort nap times chronologically
    napTimeObjects.sort((a, b) => a.time.getTime() - b.time.getTime());
    
    // Extract sorted times and durations
    const napTimes = napTimeObjects.map(obj => formatTime(obj.time));
    const napDurations = napTimeObjects.map(obj => obj.duration);
    
    return {
      energyDips,
      napTimes,
      napDurations
    };
  };
  
  // Helper to format a Date object to a time string (e.g., "2:30 PM")
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Convert to 12-hour format
    const displayHours = hours % 12 || 12;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  // Adjust times based on chronotype
  const adjustTimesForChronotype = (times: string[], chronotype: ChronotypeOption): string[] => {
    if (chronotype === 'unknown' || chronotype === 'intermediate') {
      // No adjustment needed for intermediate or unknown
      return times;
    }
    
    // Convert all times to minutes since midnight
    const minutesArray = times.map(time => {
      const [hoursStr, minutesStr] = time.split(':');
      const [minutes, period] = minutesStr.split(' ');
      
      let hours = parseInt(hoursStr);
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return hours * 60 + parseInt(minutes);
    });
    
    // Sort minutes (earliest to latest)
    minutesArray.sort((a, b) => a - b);
    
    // For early types (morning larks), prefer earlier times
    if (chronotype === 'early') {
      // Take the first 3-4 options (earlier times)
      const earlyMinutes = minutesArray.slice(0, Math.min(4, minutesArray.length));
      return earlyMinutes.map(minutes => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
      });
    }
    
    // For late types (night owls), prefer later times
    if (chronotype === 'late') {
      // Take the last 3-4 options (later times)
      const lateMinutes = minutesArray.slice(-Math.min(4, minutesArray.length));
      return lateMinutes.map(minutes => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
      });
    }
    
    return times; // fallback
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
        // Calculate all possible bedtimes
        const allBedtimes = calculateBedtimes(wakeUpTime);
        
        // Adjust bedtimes based on chronotype
        const adjustedBedtimes = chronotype !== 'unknown' ? 
          adjustTimesForChronotype(allBedtimes, chronotype) : allBedtimes;
        
        setBedtimes(adjustedBedtimes);
        
        // Calculate sleep durations and cycles for each bedtime
        const durations: string[] = [];
        const cycles: number[] = [];
        
        adjustedBedtimes.forEach((bedtimeStr) => {
          const duration = calculateSleepDuration(bedtimeStr, wakeUpTime);
          durations.push(duration);
          
          const cycleCount = getSleepCycles(bedtimeStr, wakeUpTime);
          cycles.push(cycleCount);
        });
        
        setSleepDurations(durations);
        setSleepCycles(cycles);
        
        // Check sleep deficit level (use first bedtime which has most cycles)
        const deficitLevel = checkSleepDeficiency(durations[0], ageRange);
        setSleepDeficitLevel(deficitLevel);
        
        // Calculate productivity periods based on wake-up time
        const newDeepWorkPeriods = calculateDeepWorkPeriods(wakeUpTime);
        
        // Calculate multiple energy dips and nap times
        const { energyDips: newEnergyDips, napTimes: newNapTimes, napDurations: newNapDurations } = 
          calculateMultipleTimeOptions(wakeUpTime, deficitLevel);
        
        setDeepWorkPeriods(newDeepWorkPeriods);
        setEnergyDips(newEnergyDips);
        setNapTimes(newNapTimes);
        setNapDurations(newNapDurations);
        
        // Generate personalized recommendation if chronotype is known
        if (chronotype !== 'unknown') {
          const recommendation = getPersonalizedSleepRecommendation(
            chronotype as Chronotype, 
            ageRange, 
            adjustedBedtimes
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
        // Calculate all possible wake-up times
        const allWakeUpTimes = calculateWakeUpTimes(bedTime);
        
        // Adjust wake times based on chronotype
        const adjustedWakeUpTimes = chronotype !== 'unknown' ? 
          adjustTimesForChronotype(allWakeUpTimes, chronotype) : allWakeUpTimes;
        
        setWakeUpTimes(adjustedWakeUpTimes);
        
        // Calculate sleep durations and cycles for each wake-up time
        const durations: string[] = [];
        const cycles: number[] = [];
        
        adjustedWakeUpTimes.forEach((wakeTimeStr) => {
          const duration = calculateSleepDuration(bedTime, wakeTimeStr);
          durations.push(duration);
          
          const cycleCount = getSleepCycles(bedTime, wakeTimeStr);
          cycles.push(cycleCount);
        });
        
        setWakeUpSleepDurations(durations);
        setWakeUpSleepCycles(cycles);
        
        // Check sleep deficit level (use first wake time which has most cycles)
        const deficitLevel = checkSleepDeficiency(durations[0], ageRange);
        setSleepDeficitLevel(deficitLevel);
        
        // Get the best wake up time (accounting for chronotype)
        let best = getBestWakeTime(bedTime);
        if (chronotype === 'early') {
          // For early types, select an earlier best time if possible
          const bestTimeDate = timeStringToDate(best);
          const earlierTime = new Date(bestTimeDate);
          earlierTime.setMinutes(earlierTime.getMinutes() - 90); // One cycle earlier
          best = formatTime(earlierTime);
        } else if (chronotype === 'late') {
          // For late types, select a later best time if possible
          const bestTimeDate = timeStringToDate(best);
          const laterTime = new Date(bestTimeDate);
          laterTime.setMinutes(laterTime.getMinutes() + 90); // One cycle later
          best = formatTime(laterTime);
        }
        setBestWakeUpTime(best);
        
        // Calculate productivity periods based on the best wake-up time
        const bestWakeTimeDate = timeStringToDate(best);
        
        // Calculate productivity periods based on best wake time
        const newDeepWorkPeriods = calculateDeepWorkPeriods(bestWakeTimeDate);
        
        // Calculate multiple energy dips and nap times
        const { energyDips: newEnergyDips, napTimes: newNapTimes, napDurations: newNapDurations } = 
          calculateMultipleTimeOptions(bestWakeTimeDate, deficitLevel);
        
        setDeepWorkPeriods(newDeepWorkPeriods);
        setEnergyDips(newEnergyDips);
        setNapTimes(newNapTimes);
        setNapDurations(newNapDurations);
        
        // Generate personalized recommendation if chronotype is known
        if (chronotype !== 'unknown') {
          const recommendation = getPersonalizedSleepRecommendation(
            chronotype as Chronotype, 
            ageRange, 
            adjustedWakeUpTimes
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
    setEnergyDips([]);
    setNapTimes([]);
    setNapDurations([]);
    setBestWakeUpTime('');
    setSleepDurations([]);
    setSleepCycles([]);
    setWakeUpSleepDurations([]);
    setWakeUpSleepCycles([]);
    setPersonalRecommendation('');
    setSelectedBedTimeIndex(null);
    setSelectedWakeTimeIndex(null);
    setSelectedTime(null);
    setSleepDeficitLevel('none');
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
    
    // Check sleep deficit level with this selection
    const deficitLevel = checkSleepDeficiency(wakeUpSleepDurations[index], ageRange);
    setSleepDeficitLevel(deficitLevel);
    
    // Calculate multiple energy dips and nap times based on new wake time
    const { energyDips: newEnergyDips, napTimes: newNapTimes, napDurations: newNapDurations } = 
      calculateMultipleTimeOptions(selectedWakeTime, deficitLevel);
    
    // Force a direct state update
    setDeepWorkPeriods([...newDeepWorkPeriods]);
    setEnergyDips(newEnergyDips);
    setNapTimes(newNapTimes);
    setNapDurations(newNapDurations);
    
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
    
    // Check sleep deficit level with this selection
    const deficitLevel = checkSleepDeficiency(sleepDurations[index], ageRange);
    setSleepDeficitLevel(deficitLevel);
    
    // For wakeToBed mode, we need to simulate what the wake-up time would be
    // if the user went to bed at this time
    if (calculationType === 'wakeToBed') {
      // Calculate the corresponding wake time (assuming 5 sleep cycles)
      const simulatedWakeUpDate = new Date(selectedBedTime.getTime());
      // 14 min to fall asleep + 90 min per cycle * 5 cycles = 464 minutes
      simulatedWakeUpDate.setMinutes(simulatedWakeUpDate.getMinutes() + 464);
      
      // Calculate new productivity periods based on this simulated wake-up time
      const newDeepWorkPeriods = calculateDeepWorkPeriods(simulatedWakeUpDate);
      
      // Calculate multiple energy dips and nap times based on simulated wake up time
      const { energyDips: newEnergyDips, napTimes: newNapTimes, napDurations: newNapDurations } = 
        calculateMultipleTimeOptions(simulatedWakeUpDate, deficitLevel);
      
      // Force a direct state update
      setDeepWorkPeriods([...newDeepWorkPeriods]);
      setEnergyDips(newEnergyDips);
      setNapTimes(newNapTimes);
      setNapDurations(newNapDurations);
      
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
  
  // Get deficit message based on level
  const getDeficitMessage = (level: SleepDeficitLevel) => {
    switch(level) {
      case 'mild':
        return "You'll get slightly less than the ideal amount of sleep. Consider a short nap to compensate.";
      case 'moderate':
        return "With this schedule, you'll get less than the recommended sleep for your age group. Additional nap times are recommended to help you stay alert.";
      case 'severe':
        return "This schedule results in significant sleep deprivation. Multiple strategic naps are strongly recommended, including a 90-minute full-cycle nap if possible.";
      default:
        return "";
    }
  };
  
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
            
            {/* Sleep Deficiency Warning */}
            {(sleepDeficitLevel !== 'none') && selectedTime && (
              <div className={`card-cosmic p-3 md:p-4 rounded-xl shadow-sm border-${sleepDeficitLevel === 'severe' ? 'red' : 'amber'}-500/20 bg-${sleepDeficitLevel === 'severe' ? 'red' : 'amber'}-900/10`}>
                <div className="flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-${sleepDeficitLevel === 'severe' ? 'red' : 'amber'}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className={`text-sm text-${sleepDeficitLevel === 'severe' ? 'red' : 'amber'}-200`}>
                      <span className="font-medium">Sleep Alert:</span> {getDeficitMessage(sleepDeficitLevel)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bedtime Results */}
            {bedtimes.length > 0 && (
              <SleepResults 
                title="Optimal Bedtimes"
                items={bedtimes}
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
                icon={<Icons.Wake />}
                accent="indigo"
                items={wakeUpTimes}
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
                icon={<Icons.Work />}
                accent="purple"
              />
            )}
            
            {/* Energy Dips */}
            {energyDips.length > 0 && (
              <SleepResults 
                title="Energy Dip Periods"
                items={energyDips}
                icon={<Icons.Slump />}
                accent="blue"
                description="These are times when your body naturally experiences energy dips due to circadian rhythm fluctuations."
              />
            )}
            
            {/* Optimal Nap Times */}
            {napTimes.length > 0 && (
              <SleepResults 
                title="Optimal Nap Times"
                items={napTimes}
                icon={<Icons.Nap />}
                accent="cyan"
                description={sleepDeficitLevel !== 'none' 
                  ? "Strategic nap recommendations to compensate for sleep deficit. 90-minute naps complete a full sleep cycle including REM sleep." 
                  : "Scientifically-timed nap options to boost alertness and cognitive performance."}
                extraInfo={napDurations}
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