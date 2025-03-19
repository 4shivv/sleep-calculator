// Sleep cycle constants based on scientific research
const SLEEP_CYCLE_MINUTES = 90; // One complete sleep cycle (NREM + REM) lasts approximately 90 minutes
const FALL_ASLEEP_TIME_MINUTES = 14; // Average time to fall asleep for healthy adults
const MIN_SLEEP_CYCLES = 3; // Minimum recommended complete sleep cycles
const MAX_SLEEP_CYCLES = 6; // Maximum recommended complete sleep cycles

// Time constants (in minutes)
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

// Sleep stages percentages (approximate for healthy adults)
// Reserved for future implementation of detailed sleep stage analysis
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SLEEP_STAGES = {
  N1: 0.05, // Stage 1 NREM - 5% of total sleep time
  N2: 0.45, // Stage 2 NREM - 45% of total sleep time
  N3: 0.25, // Stage 3 NREM (Deep sleep) - 25% of total sleep time
  REM: 0.25 // REM sleep - 25% of total sleep time
};

// Circadian rhythm markers (hours since waking)
const CIRCADIAN = {
  PEAK_ALERTNESS_MORNING: 2.5, // Peak alertness occurs around 2.5 hours after waking
  PEAK_ALERTNESS_EVENING: 10, // Second alertness peak around 10 hours after waking
  POST_LUNCH_DIP_START: 6, // Post-lunch dip starts around 6 hours after waking
  POST_LUNCH_DIP_END: 8, // Post-lunch dip ends around 8 hours after waking
  IDEAL_NAP_TIME: 6.5, // Best time for napping is during the post-lunch dip
  MELATONIN_ONSET: 14, // Melatonin begins to rise ~14 hours after waking (for people with healthy circadian rhythms)
};

// Age ranges for sleep recommendations - merged young-adult and adult
export type AgeRange = 'teen' | 'adult' | 'older-adult';

// Convert a Date object to minutes since midnight
export function dateToMinutes(date: Date): number {
  return date.getHours() * MINUTES_IN_HOUR + date.getMinutes();
}

// Convert minutes since midnight to a formatted time string (HH:MM AM/PM)
export function minutesToTimeString(minutes: number): string {
  // Ensure minutes are within 0-1439 range (24 hours)
  minutes = ((minutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  
  const hours = Math.floor(minutes / MINUTES_IN_HOUR);
  const mins = minutes % MINUTES_IN_HOUR;
  
  // Convert to 12-hour format with AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

// Create a Date object from hours and minutes
export function createTimeFromHoursAndMinutes(hours: number, minutes: number): Date {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

// Parse a time string (HH:MM AM/PM) into a Date object
export function parseTimeString(timeStr: string): Date | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const isPM = match[3].toLowerCase() === 'pm';
  
  // Adjust hours for PM
  if (isPM && hours < 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  
  return createTimeFromHoursAndMinutes(hours, minutes);
}

// Calculate optimal bedtimes based on desired wake-up time
export function calculateBedtimes(wakeUpTime: Date): string[] {
  const wakeupMinutes = dateToMinutes(wakeUpTime);
  const bedtimes: string[] = [];
  
  // Calculate sleep cycles backward from wake time, starting from MAX (most) to MIN (least)
  for (let cycles = MAX_SLEEP_CYCLES; cycles >= MIN_SLEEP_CYCLES; cycles--) {
    const totalSleepMinutes = cycles * SLEEP_CYCLE_MINUTES;
    const bedtimeMinutes = wakeupMinutes - totalSleepMinutes - FALL_ASLEEP_TIME_MINUTES;
    bedtimes.push(minutesToTimeString(bedtimeMinutes));
  }
  
  // Now the bedtimes are ordered from most cycles (MAX_SLEEP_CYCLES) to least cycles (MIN_SLEEP_CYCLES)
  return bedtimes;
}

// Calculate optimal wake-up times based on bedtime
export function calculateWakeUpTimes(bedTime: Date): string[] {
  const bedtimeMinutes = dateToMinutes(bedTime);
  const wakeUpTimes: string[] = [];
  
  // Add the average time to fall asleep
  const actualSleepStartMinutes = bedtimeMinutes + FALL_ASLEEP_TIME_MINUTES;
  
  // Calculate sleep cycles forward from bed time, starting from MAX (most) to MIN (least)
  for (let cycles = MAX_SLEEP_CYCLES; cycles >= MIN_SLEEP_CYCLES; cycles--) {
    const totalSleepMinutes = cycles * SLEEP_CYCLE_MINUTES;
    const wakeUpMinutes = actualSleepStartMinutes + totalSleepMinutes;
    wakeUpTimes.push(minutesToTimeString(wakeUpMinutes));
  }
  
  // Now the wakeUpTimes are ordered from most cycles (MAX_SLEEP_CYCLES) to least cycles (MIN_SLEEP_CYCLES)
  return wakeUpTimes;
}

// Calculate sleep duration between bedtime and wake up time
export function calculateSleepDuration(bedTimeStr: string | Date, wakeUpTimeStr: string | Date): string {
  let bedTimeMinutes;
  let wakeUpMinutes;
  
  // Parse the bedtime
  if (typeof bedTimeStr === 'string') {
    const bedTimeParts = bedTimeStr.split(':');
    const [bedHoursStr, bedMinutesWithPeriod] = bedTimeParts;
    const [bedMinutesStr, period] = bedMinutesWithPeriod.split(' ');
    
    let bedHours = parseInt(bedHoursStr);
    const bedMinutes = parseInt(bedMinutesStr);
    
    if (period === 'PM' && bedHours < 12) bedHours += 12;
    if (period === 'AM' && bedHours === 12) bedHours = 0;
    
    bedTimeMinutes = bedHours * 60 + bedMinutes;
  } else {
    // It's a Date object
    bedTimeMinutes = dateToMinutes(bedTimeStr);
  }
  
  // Parse the wake up time
  if (typeof wakeUpTimeStr === 'string') {
    const wakeTimeParts = wakeUpTimeStr.split(':');
    const [wakeHoursStr, wakeMinutesWithPeriod] = wakeTimeParts;
    const [wakeMinutesStr, period] = wakeMinutesWithPeriod.split(' ');
    
    let wakeHours = parseInt(wakeHoursStr);
    const wakeMinutes = parseInt(wakeMinutesStr);
    
    if (period === 'PM' && wakeHours < 12) wakeHours += 12;
    if (period === 'AM' && wakeHours === 12) wakeHours = 0;
    
    wakeUpMinutes = wakeHours * 60 + wakeMinutes;
  } else {
    // It's a Date object
    wakeUpMinutes = dateToMinutes(wakeUpTimeStr);
  }
  
  // Calculate the time difference, accounting for crossing midnight
  let sleepMinutes = wakeUpMinutes - bedTimeMinutes;
  
  // If negative, it means we crossed midnight
  if (sleepMinutes < 0) {
    sleepMinutes += MINUTES_IN_DAY;
  }
  
  // Subtract time to fall asleep
  sleepMinutes -= FALL_ASLEEP_TIME_MINUTES;
  
  // Format as hours and minutes
  const sleepHours = Math.floor(sleepMinutes / 60);
  const sleepMins = sleepMinutes % 60;
  
  if (sleepMins === 0) {
    return `${sleepHours} hours`;
  } else {
    return `${sleepHours} hours ${sleepMins} mins`;
  }
}

// Calculate the number of complete sleep cycles
export function getSleepCycles(bedTimeStr: string | Date, wakeUpTimeStr: string | Date): number {
  let bedTimeMinutes;
  let wakeUpMinutes;
  
  // Parse the bedtime
  if (typeof bedTimeStr === 'string') {
    const bedTimeParts = bedTimeStr.split(':');
    const [bedHoursStr, bedMinutesWithPeriod] = bedTimeParts;
    const [bedMinutesStr, period] = bedMinutesWithPeriod.split(' ');
    
    let bedHours = parseInt(bedHoursStr);
    const bedMinutes = parseInt(bedMinutesStr);
    
    if (period === 'PM' && bedHours < 12) bedHours += 12;
    if (period === 'AM' && bedHours === 12) bedHours = 0;
    
    bedTimeMinutes = bedHours * 60 + bedMinutes;
  } else {
    // It's a Date object
    bedTimeMinutes = dateToMinutes(bedTimeStr);
  }
  
  // Parse the wake up time
  if (typeof wakeUpTimeStr === 'string') {
    const wakeTimeParts = wakeUpTimeStr.split(':');
    const [wakeHoursStr, wakeMinutesWithPeriod] = wakeTimeParts;
    const [wakeMinutesStr, period] = wakeMinutesWithPeriod.split(' ');
    
    let wakeHours = parseInt(wakeHoursStr);
    const wakeMinutes = parseInt(wakeMinutesStr);
    
    if (period === 'PM' && wakeHours < 12) wakeHours += 12;
    if (period === 'AM' && wakeHours === 12) wakeHours = 0;
    
    wakeUpMinutes = wakeHours * 60 + wakeMinutes;
  } else {
    // It's a Date object
    wakeUpMinutes = dateToMinutes(wakeUpTimeStr);
  }
  
  // Calculate the time difference, accounting for crossing midnight
  let sleepMinutes = wakeUpMinutes - bedTimeMinutes;
  
  // If negative, it means we crossed midnight
  if (sleepMinutes < 0) {
    sleepMinutes += MINUTES_IN_DAY;
  }
  
  // Subtract time to fall asleep
  sleepMinutes -= FALL_ASLEEP_TIME_MINUTES;
  
  // Calculate complete sleep cycles
  const cycles = Math.floor(sleepMinutes / SLEEP_CYCLE_MINUTES);
  
  return cycles;
}

// Get the best wake time based on both sleep cycles and natural light
export function getBestWakeTime(bedTime: Date): string {
  const wakeUpTimes = calculateWakeUpTimes(bedTime);
  
  // Calculate sunrise time (approximate - would ideally use a geolocation API)
  const date = new Date(bedTime);
  date.setHours(6); // Approximate sunrise time (would be better with actual sunrise data)
  date.setMinutes(30);
  const sunriseMinutes = dateToMinutes(date);
  
  // Find the wake time closest to sunrise
  const wakeTimeMinutes = wakeUpTimes.map(time => {
    const timeParts = time.split(':');
    const hourPart = parseInt(timeParts[0]);
    const minutePart = parseInt(timeParts[1].split(' ')[0]);
    const isPM = timeParts[1].includes('PM');
    
    let hours = hourPart;
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    return hours * 60 + minutePart;
  });
  
  // Find closest wake time to sunrise (or just after)
  let closestIndex = 0;
  let minDifference = Number.MAX_SAFE_INTEGER;
  
  wakeTimeMinutes.forEach((minutes, index) => {
    // Prefer wake times just after sunrise
    const difference = minutes >= sunriseMinutes ? 
      minutes - sunriseMinutes : 
      (MINUTES_IN_DAY - sunriseMinutes) + minutes;
    
    if (difference < minDifference) {
      minDifference = difference;
      closestIndex = index;
    }
  });
  
  return wakeUpTimes[closestIndex];
}

// Calculate optimal deep work periods based on wake-up time
export function calculateDeepWorkPeriods(wakeUpTime: Date): string[] {
  const wakeupMinutes = dateToMinutes(wakeUpTime);
  const deepWorkPeriods: string[] = [];
  
  // First deep work period: peak alertness in morning (2-3 hours after waking)
  const firstPeriodStart = wakeupMinutes + (CIRCADIAN.PEAK_ALERTNESS_MORNING * MINUTES_IN_HOUR);
  deepWorkPeriods.push(
    `${minutesToTimeString(firstPeriodStart)} - ${minutesToTimeString(firstPeriodStart + 90)}`
  );
  
  // Second deep work period: peak alertness in afternoon (before the post-lunch dip)
  const secondPeriodStart = wakeupMinutes + (CIRCADIAN.POST_LUNCH_DIP_START * MINUTES_IN_HOUR) - 90;
  deepWorkPeriods.push(
    `${minutesToTimeString(secondPeriodStart)} - ${minutesToTimeString(secondPeriodStart + 90)}`
  );
  
  // Third deep work period: evening alertness peak (if applicable)
  const thirdPeriodStart = wakeupMinutes + (CIRCADIAN.PEAK_ALERTNESS_EVENING * MINUTES_IN_HOUR);
  deepWorkPeriods.push(
    `${minutesToTimeString(thirdPeriodStart)} - ${minutesToTimeString(thirdPeriodStart + 90)}`
  );
  
  return deepWorkPeriods;
}

// Calculate afternoon slump time
export function calculateAfternoonSlump(wakeUpTime: Date): string {
  const wakeupMinutes = dateToMinutes(wakeUpTime);
  
  // Afternoon slump based on circadian rhythm (post-lunch dip)
  const slumpStartMinutes = wakeupMinutes + (CIRCADIAN.POST_LUNCH_DIP_START * MINUTES_IN_HOUR);
  const slumpEndMinutes = wakeupMinutes + (CIRCADIAN.POST_LUNCH_DIP_END * MINUTES_IN_HOUR);
  
  return `${minutesToTimeString(slumpStartMinutes)} - ${minutesToTimeString(slumpEndMinutes)}`;
}

// Calculate optimal nap time based on wake-up time
export function calculateNapTime(wakeUpTime: Date): string {
  const wakeupMinutes = dateToMinutes(wakeUpTime);
  
  // Optimal nap time is during the post-lunch dip
  const napTimeMinutes = wakeupMinutes + (CIRCADIAN.IDEAL_NAP_TIME * MINUTES_IN_HOUR);
  
  return minutesToTimeString(napTimeMinutes);
}

// Calculate ideal nap duration based on time of day
export function getIdealNapDuration(napTime: Date): string {
  const hours = napTime.getHours();
  
  // Earlier naps can be longer, later naps should be shorter
  if (hours < 12) {
    return "20-30 minutes (power nap) or 90 minutes (full cycle)";
  } else if (hours < 15) {
    return "20-30 minutes (power nap)";
  } else {
    return "10-20 minutes (micro nap)";
  }
}

// Get recommended sleep duration range in hours based on age
export function getRecommendedSleepDuration(ageRange: AgeRange): string {
  switch(ageRange) {
    case 'teen':
      return "8-10 hours";
    case 'adult':
      return "7-9 hours";
    case 'older-adult':
      return "7-8 hours";
    default:
      return "7-9 hours";
  }
}

// Get recommended bedtime based on chronotype (approximate)
export type Chronotype = 'early' | 'intermediate' | 'late';

export function getChronotypeRecommendation(chronotype: Chronotype): string {
  switch(chronotype) {
    case 'early': // Morning lark
      return "Go to bed between 9:00 PM - 10:30 PM and wake up between 5:00 AM - 6:30 AM";
    case 'intermediate': // Neither lark nor owl
      return "Go to bed between 10:00 PM - 11:30 PM and wake up between 6:00 AM - 7:30 AM";
    case 'late': // Night owl
      return "Go to bed between 11:30 PM - 1:00 AM and wake up between 7:30 AM - 9:00 AM";
    default:
      return "Follow a consistent sleep schedule aligned with your natural tendencies";
  }
}

// Get personalized sleep recommendation based on chronotype and age
export function getPersonalizedSleepRecommendation(chronotype: Chronotype, ageRange: AgeRange, calculatedTimes: string[]): string {
  // If no calculated times available, provide general guidance
  if (!calculatedTimes || calculatedTimes.length === 0) {
    return getChronotypeRecommendation(chronotype);
  }
  
  // Get optimal sleep duration for age
  const sleepDuration = getRecommendedSleepDuration(ageRange);
  
  // Choose recommended time from calculated options based on chronotype and age
  let recommendedIndex = 0;
  
  if (ageRange === 'teen') {
    // Teens need more sleep - recommend earlier bedtime (more cycles)
    recommendedIndex = 0; // First option with most sleep cycles
  } else if (ageRange === 'older-adult') {
    // Older adults often do better with a bit less sleep
    recommendedIndex = Math.min(2, calculatedTimes.length - 1); // Third option or last if fewer available
  } else {
    // Adults - middle options are usually best
    // For early chronotype, favor earlier times (more sleep)
    // For late chronotype, favor later times (less sleep)
    if (chronotype === 'early') {
      recommendedIndex = 0; // First option - more sleep for early types
    } else if (chronotype === 'late') {
      recommendedIndex = Math.min(2, calculatedTimes.length - 1); // Third option - less sleep for night owls
    } else {
      recommendedIndex = 1; // Second option for intermediate types
    }
  }
  
  const recommendedTime = calculatedTimes[recommendedIndex] || calculatedTimes[0];
  
  return `Based on your ${chronotype} chronotype and age range, we recommend ${recommendedTime}. Adults in your age range typically need ${sleepDuration} of quality sleep.`;
}

// Calculate wake window (optimal time to be awake) based on age
export function getRecommendedWakeWindow(ageRange: AgeRange): string {
  switch(ageRange) {
    case 'teen':
      return "8-10 hours";
    case 'adult':
      return "15-17 hours";
    case 'older-adult':
      return "15-16 hours";
    default:
      return "16 hours";
  }
}

// Get deep sleep percentage estimate based on age
export function getDeepSleepPercentage(ageRange: AgeRange): number {
  switch(ageRange) {
    case 'teen':
      return 25; // Teens have more deep sleep
    case 'adult':
      return 20; // Adults have moderate deep sleep
    case 'older-adult':
      return 15; // Older adults have less deep sleep
    default:
      return 20;
  }
}