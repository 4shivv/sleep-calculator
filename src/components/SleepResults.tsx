'use client';

import { useState, useEffect } from 'react';

interface SleepResultsProps {
  title: string;
  items: string[];
  description?: string;
  icon?: React.ReactNode;
  accent?: string;
  onSelect?: (item: string, index: number) => void;
  sleepDurations?: string[];
  cycles?: number[];
  selectedIndex?: number | null;
  extraInfo?: string[];
  
  // Props for controlling expansion from parent
  forceExpanded?: boolean; // Override local expanded state
  toggleCount?: number; // Change this to trigger an expand/collapse
}

export default function SleepResults({ 
  title, 
  items, 
  description, 
  icon, 
  accent = 'violet',
  onSelect,
  sleepDurations = [],
  cycles = [],
  selectedIndex = null,
  extraInfo = [],
  forceExpanded,
  toggleCount = 0
}: SleepResultsProps) {
  // Track internal expanded state, but can be overridden by forceExpanded
  const [expanded, setExpanded] = useState(true);
  
  // Track the previous toggle count
  const [prevToggleCount, setPrevToggleCount] = useState(toggleCount);
  
  // Track if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Respond to toggleCount changes
  useEffect(() => {
    if (toggleCount !== prevToggleCount) {
      // Briefly collapse then expand to force a repaint
      setExpanded(false);
      
      // Re-expand after a brief delay
      const timer = setTimeout(() => {
        setExpanded(true);
        setPrevToggleCount(toggleCount);
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [toggleCount, prevToggleCount]);
  
  // Handle expansion toggle
  const toggleExpanded = () => {
    // Only allow toggling if not being controlled externally
    if (forceExpanded === undefined) {
      setExpanded(prev => !prev);
    }
  };
  
  // Determine if the component should be expanded
  const isExpanded = forceExpanded !== undefined ? forceExpanded : expanded;
  
  // Helper to get abbreviated sleep duration for mobile
  const getAbbreviatedDuration = (duration: string) => {
    if (!isMobile) return duration;
    
    // Transform "7 hours 30 mins" to "7h 30m"
    return duration
      .replace('hours', 'h')
      .replace('hour', 'h')
      .replace('mins', 'm')
      .replace('min', 'm');
  };
  
  // Helper to get shorter nap recommendation for mobile
  const getShorterNapInfo = (info: string) => {
    if (!isMobile) return info;
    
    // Abbreviate common phrases
    return info
      .replace('minutes', 'min')
      .replace('minute', 'min')
      .replace('to address significant sleep deficit', '')
      .replace('for recovery', '')
      .replace('without affecting night sleep', '')
      .replace('(complete sleep cycle with REM)', '(full cycle)')
      .replace('(refreshing without grogginess)', '')
      .replace('(alertness boost without sleep inertia)', '')
      .replace('(alertness without affecting night sleep)', '')
      .replace('(brief refresher only)', '');
  };
  
  // Return null if no items
  if (items.length === 0) return null;
  
  return (
    <div className={`sleep-results-card border-${accent}-500/20`}>
      <div 
        className={`sleep-results-header bg-${accent}-500/05 hover:bg-${accent}-500/10`}
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl glow-icon">{icon}</span>}
          <h3 className="sleep-results-title">
            {title}
          </h3>
        </div>
        
        <button 
          className="p-1 rounded-full hover:bg-violet-500/10 transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-violet-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className="sleep-results-body">
          {description && (
            <p className="sleep-results-description">
              {description}
            </p>
          )}
          
          <ul className="space-y-2.5">
            {items.map((item, index) => {
              const isSelected = selectedIndex === index;
              
              return (
                <li 
                  key={index}
                  className={`sleep-results-item ${
                    onSelect ? 'cursor-pointer transition-all hover:bg-violet-500/20 hover:shadow-md hover:translate-y-0' : ''
                  } ${isSelected ? 'bg-violet-500/30 border-violet-500/50 shadow-md transform -translate-y-px' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (onSelect) onSelect(item, index);
                  }}
                  onTouchEnd={(e) => {
                    if (onSelect) {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(item, index);
                    }
                  }}
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                  aria-label={onSelect ? `Select ${item}` : undefined}
                  aria-selected={isSelected}
                  onKeyDown={(e) => {
                    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelect(item, index);
                    }
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4 flex-grow">
                    <span className={`sleep-results-time ${isSelected ? 'text-white font-semibold' : 'text-violet-100'}`}>
                      {item}
                      {isSelected && (
                        <span className="ml-2 text-xs font-normal bg-violet-500/40 px-1.5 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </span>
                    
                    <div className="sleep-results-badges">
                      {/* Nap duration info (for nap times) */}
                      {extraInfo[index] && (
                        <span className="sleep-results-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="badge-text">{getShorterNapInfo(extraInfo[index])}</span>
                        </span>
                      )}
                      
                      {/* Sleep duration (for bedtimes/wake times) */}
                      {sleepDurations[index] && (
                        <span className="sleep-results-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="badge-text">{getAbbreviatedDuration(sleepDurations[index])}</span>
                        </span>
                      )}
                      
                      {/* Sleep cycles (for bedtimes/wake times) */}
                      {cycles[index] && (
                        <span className="sleep-results-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="badge-text">{cycles[index]} {isMobile ? 'cycle' : `sleep ${cycles[index] === 1 ? 'cycle' : 'cycles'}`}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {onSelect && !isSelected && (
                    <div className="flex justify-end mt-2 md:mt-0">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-violet-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="flex justify-end mt-2 md:mt-0">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-violet-200" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}