'use client';

import { useState, useEffect, useRef } from 'react';

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

  // Handle clicks outside the time picker to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
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
      setError('Please enter a valid time (e.g., 7:30 AM)');
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

  const handleTimeSelection = (hour: number, minute: number, period: 'AM' | 'PM') => {
    const formattedHour = hour === 0 || hour === 12 ? 12 : hour % 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    const newTimeString = `${formattedHour}:${formattedMinute} ${period}`;
    
    setTimeString(newTimeString);
    setShowTimePicker(false);
    
    // Create and pass the date object
    let adjustedHour = hour;
    if (period === 'PM' && hour !== 12) adjustedHour += 12;
    if (period === 'AM' && hour === 12) adjustedHour = 0;
    
    const date = new Date();
    date.setHours(adjustedHour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    onTimeChange(date);
    setError('');
  };

  // Set current time
  const setCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    
    const newTimeString = `${formattedHour}:${formattedMinute} ${period}`;
    setTimeString(newTimeString);
    onTimeChange(now);
    setError('');
  };

  // Generate hour options
  const hourOptions = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
  
  // Generate minute options in 5-minute increments
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={timeString}
              onChange={handleTimeChange}
              onFocus={() => {
                setIsFocused(true);
                setShowTimePicker(true);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={`w-full px-4 py-3 border rounded-lg text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 
                ${isFocused ? 'border-blue-500 shadow-sm' : 'border-gray-300 dark:border-gray-700'} 
                dark:bg-gray-800 dark:text-white`}
            />
            
            <button 
              type="button"
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none"
              aria-label="Open time picker"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          <button
            type="button"
            onClick={setCurrentTime}
            className="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors border border-blue-200 flex items-center justify-center w-full sm:w-auto whitespace-nowrap dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-300 dark:border-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Now
          </button>
        </div>
        
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
        
        {/* Time picker dropdown */}
        {showTimePicker && (
          <div 
            ref={timePickerRef}
            className="absolute z-10 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-full max-w-sm"
          >
            <div className="flex flex-col space-y-4">
              {/* Hour selection */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Hour</p>
                <div className="grid grid-cols-4 gap-2">
                  {hourOptions.map(hour => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => {
                        // Parse current time if exists
                        let minute = 0;
                        let period: 'AM' | 'PM' = 'AM';
                        
                        if (timeString) {
                          const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
                          if (match) {
                            minute = parseInt(match[2], 10);
                            period = match[3].toUpperCase() as 'AM' | 'PM';
                          }
                        }
                        
                        handleTimeSelection(hour, minute, period);
                      }}
                      className="py-2 px-2 text-center rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-100 dark:focus:bg-gray-600 text-sm"
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Minute selection */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Minute</p>
                <div className="grid grid-cols-4 gap-2">
                  {minuteOptions.map(minute => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => {
                        // Parse current time if exists
                        let hour = 12;
                        let period: 'AM' | 'PM' = 'AM';
                        
                        if (timeString) {
                          const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
                          if (match) {
                            hour = parseInt(match[1], 10);
                            period = match[3].toUpperCase() as 'AM' | 'PM';
                          }
                        }
                        
                        handleTimeSelection(hour, minute, period);
                      }}
                      className="py-2 px-2 text-center rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-blue-100 dark:focus:bg-gray-600 text-sm"
                    >
                      {minute.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* AM/PM selection */}
              <div className="flex justify-center space-x-4">
                {(['AM', 'PM'] as const).map(period => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      // Parse current time if exists
                      let hour = 12;
                      let minute = 0;
                      
                      if (timeString) {
                        const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
                        if (match) {
                          hour = parseInt(match[1], 10);
                          minute = parseInt(match[2], 10);
                        }
                      }
                      
                      handleTimeSelection(hour, minute, period);
                    }}
                    className={`px-6 py-2 rounded-full text-sm font-medium focus:outline-none 
                      ${timeString.toUpperCase().includes(period) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              
              {/* Quick time selections */}
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Select</p>
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
                      onClick={() => handleTimeSelection(
                        option.time.hour, 
                        option.time.minute, 
                        option.time.period
                      )}
                      className="py-2 px-3 text-center rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 