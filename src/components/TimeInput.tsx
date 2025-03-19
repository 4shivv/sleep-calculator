'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface TimeInputProps {
  label: string;
  onTimeChange: (time: Date | null) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function TimeInput({ label, onTimeChange, placeholder = "12:00 AM", initialValue = '' }: TimeInputProps) {
  const [timeString, setTimeString] = useState(initialValue);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  
  // Touch tracking
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  
  // State for time picker
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  
  // Parse initial time if provided
  useEffect(() => {
    if (initialValue) {
      const match = initialValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
      if (match) {
        const hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        const period = match[3].toUpperCase() as 'AM' | 'PM';
        
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setSelectedPeriod(period);
      }
    }
  }, [initialValue]);

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent, type: 'hour' | 'minute') => {
    if (touchStartY === null) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    
    // Only process if they've moved enough (avoid micro-adjustments)
    if (Math.abs(deltaY) > 10) {
      if (type === 'hour') {
        handleHourChange(deltaY > 0 ? 1 : -1);
      } else {
        handleMinuteChange(deltaY > 0 ? 1 : -1);
      }
      // Reset touch start to allow continuous scrolling
      setTouchStartY(touchY);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
  };

  // Handle clicks outside the time picker to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateAndParseTime = (timeStr: string): Date | null => {
    // Regular expression for time format (12:34 AM/PM)
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5][0-9])\s*(AM|PM|am|pm)$/;
    
    if (!timeRegex.test(timeStr)) {
      setError('Invalid time format');
      return null;
    }
    
    // Parse the time string
    const [, hours, minutes, period] = timeStr.match(timeRegex) || [];
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    
    // Adjust hour based on AM/PM
    if (period.toLowerCase() === 'pm' && hour < 12) {
      hour += 12;
    } else if (period.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }
    
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    setError('');
    return date;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeString(value);
    
    if (value.trim() === '') {
      setError('');
      onTimeChange(null);
      return;
    }
    
    const parsedTime = validateAndParseTime(value);
    onTimeChange(parsedTime);
  };

  const updateTimeFromPicker = useCallback(() => {
    const formattedHour = selectedHour === 0 || selectedHour === 12 ? 12 : selectedHour % 12;
    const formattedMinute = selectedMinute.toString().padStart(2, '0');
    const newTimeString = `${formattedHour}:${formattedMinute} ${selectedPeriod}`;
    
    setTimeString(newTimeString);
    
    // Create and pass the date object
    let adjustedHour = selectedHour;
    if (selectedPeriod === 'PM' && selectedHour !== 12) adjustedHour += 12;
    if (selectedPeriod === 'AM' && selectedHour === 12) adjustedHour = 0;
    
    const date = new Date();
    date.setHours(adjustedHour);
    date.setMinutes(selectedMinute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    onTimeChange(date);
    setError('');
  }, [selectedHour, selectedMinute, selectedPeriod, onTimeChange]);

  // Update time when picker values change
  useEffect(() => {
    if (showTimePicker) {
      updateTimeFromPicker();
    }
  }, [selectedHour, selectedMinute, selectedPeriod, showTimePicker, updateTimeFromPicker]);

  // Set current time
  const setCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    const roundedMinute = Math.floor(minute / 5) * 5; // Round to nearest 5 minutes
    
    setSelectedHour(formattedHour);
    setSelectedMinute(roundedMinute);
    setSelectedPeriod(period);
    
    // This will trigger the useEffect to update the time
    const newTimeString = `${formattedHour}:${roundedMinute.toString().padStart(2, '0')} ${period}`;
    setTimeString(newTimeString);
    onTimeChange(now);
    setError('');
    setShowTimePicker(false);
  };

  // Helper for hour scroll
  const handleHourChange = (direction: number) => {
    setSelectedHour(prev => {
      let newHour = prev + direction;
      if (newHour > 12) newHour = 1;
      if (newHour < 1) newHour = 12;
      return newHour;
    });
  };

  // Helper for minute scroll
  const handleMinuteChange = (direction: number) => {
    setSelectedMinute(prev => {
      let newMinute = prev + direction * 5;
      if (newMinute >= 60) newMinute = 0;
      if (newMinute < 0) newMinute = 55;
      return newMinute;
    });
  };

  // Toggle AM/PM
  const togglePeriod = () => {
    setSelectedPeriod(prev => prev === 'AM' ? 'PM' : 'AM');
  };

  return (
    <div className="w-full">
      <label className="block text-base font-medium mb-2 text-indigo-200 glow-text">
        {label}
      </label>
      
      {/* Container that will expand to fit the time picker */}
      <div className={`relative ${showTimePicker ? 'pb-[450px] sm:pb-[400px]' : ''} transition-all duration-300`}>
        <div className="flex flex-col sm:flex-row gap-2 time-input-mobile">
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              type="text"
              value={timeString}
              onChange={handleTimeChange}
              onFocus={() => {
                setIsFocused(true);
                setShowTimePicker(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={`w-full px-4 py-3.5 border-2 rounded-xl text-lg md:text-xl font-medium focus:outline-none transition-all duration-200 
                ${error ? 'border-red-500' : isFocused ? 'border-violet-500 glow-border' : 'border-violet-500/30'} 
                bg-indigo-950/40 backdrop-blur-md text-white placeholder-indigo-300/70 tracking-wide`}
            />
            
            <button 
              type="button"
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-violet-300 focus:outline-none touch-target p-2"
              aria-label="Open time picker"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-4 py-3.5 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 font-medium rounded-xl transition-colors 
                    border-2 border-violet-500/40 flex items-center justify-center whitespace-nowrap touch-target 
                    sm:w-auto w-full backdrop-blur-md text-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Now
          </button>
        </div>
        
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        
        {/* Time picker dropdown - Styled to stay within the parent, but visible */}
        {showTimePicker && (
          <div 
            ref={timePickerRef}
            className="absolute left-0 right-0 mt-2 z-50"
          >
            <div 
              className="bg-indigo-950/95 backdrop-blur-xl border-2 border-violet-500/40 rounded-xl shadow-lg p-4 
                       sm:p-5 w-full animate-fadeIn overflow-hidden time-picker-cosmic"
            >
              <div className="flex justify-center items-center space-x-4 relative py-3">
                {/* Hour selector */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => handleHourChange(1)}
                    className="p-2 text-violet-300 hover:text-white focus:outline-none touch-target w-12 h-12 
                             flex items-center justify-center transition-all hover:bg-violet-500/20 rounded-full time-transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  
                  <div 
                    ref={hourRef}
                    className="text-center text-2xl font-bold py-2 text-white w-14 h-14 flex items-center justify-center
                             glow-text time-control"
                    onTouchStart={handleTouchStart}
                    onTouchMove={(e) => handleTouchMove(e, 'hour')}
                    onTouchEnd={handleTouchEnd}
                  >
                    {selectedHour}
                  </div>
                  
                  <button 
                    onClick={() => handleHourChange(-1)}
                    className="p-2 text-violet-300 hover:text-white focus:outline-none touch-target w-12 h-12 
                             flex items-center justify-center transition-all hover:bg-violet-500/20 rounded-full time-transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-2xl font-bold text-white time-control">:</div>
                
                {/* Minute selector */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => handleMinuteChange(1)}
                    className="p-2 text-violet-300 hover:text-white focus:outline-none touch-target w-12 h-12 
                             flex items-center justify-center transition-all hover:bg-violet-500/20 rounded-full time-transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  
                  <div 
                    ref={minuteRef}
                    className="text-center text-2xl font-bold py-2 text-white w-14 h-14 flex items-center justify-center
                             glow-text time-control"
                    onTouchStart={handleTouchStart}
                    onTouchMove={(e) => handleTouchMove(e, 'minute')}
                    onTouchEnd={handleTouchEnd}
                  >
                    {selectedMinute.toString().padStart(2, '0')}
                  </div>
                  
                  <button 
                    onClick={() => handleMinuteChange(-1)}
                    className="p-2 text-violet-300 hover:text-white focus:outline-none touch-target w-12 h-12 
                             flex items-center justify-center transition-all hover:bg-violet-500/20 rounded-full time-transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* AM/PM toggle */}
                <button
                  onClick={togglePeriod}
                  className={`ml-3 px-5 py-3 rounded-xl text-lg font-bold focus:outline-none transition-all time-control time-transition
                            ${selectedPeriod === 'AM' 
                             ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' 
                             : 'bg-indigo-800 text-indigo-200'}`}
                >
                  {selectedPeriod}
                </button>
              </div>
              
              {/* Quick time selections */}
              <div className="mt-4 pt-3 border-t border-indigo-700/50">
                <p className="text-sm font-medium text-indigo-300 mb-2">Quick Select</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Morning', time: { hour: 7, minute: 0, period: 'AM' as const } },
                    { label: 'Noon', time: { hour: 12, minute: 0, period: 'PM' as const } },
                    { label: 'Evening', time: { hour: 6, minute: 0, period: 'PM' as const } },
                    { label: 'Night', time: { hour: 10, minute: 0, period: 'PM' as const } }
                  ].map(option => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setSelectedHour(option.time.hour);
                        setSelectedMinute(option.time.minute);
                        setSelectedPeriod(option.time.period);
                        setShowTimePicker(false);
                      }}
                      className="py-2.5 px-3 text-center rounded-lg border border-violet-500/30 
                               hover:border-violet-500/60 hover:bg-violet-600/20 text-indigo-200 
                               transition-all flex items-center justify-center space-x-1.5 touch-target"
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                      <span className="text-xs">
                        ({option.time.hour}:{option.time.minute.toString().padStart(2, '0')} {option.time.period})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg
                         transition-colors focus:outline-none touch-target text-lg"
                  onClick={() => setShowTimePicker(false)}
                >
                  Done
                </button>
                
                <button
                  className="flex-1 py-2.5 bg-indigo-800 hover:bg-indigo-700 text-indigo-200 font-medium rounded-lg
                         transition-colors focus:outline-none touch-target text-lg"
                  onClick={() => setShowTimePicker(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}