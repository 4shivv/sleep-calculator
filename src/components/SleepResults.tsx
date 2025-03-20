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
}

export default function SleepResults({ 
  title, 
  items, 
  description, 
  icon, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  accent, 
  onSelect,
  sleepDurations = [],
  cycles = [],
  selectedIndex = null,
  extraInfo = []
}: SleepResultsProps) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile device on component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Process selection
  const handleSelect = (item: string, index: number, event?: React.MouseEvent | React.TouchEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (onSelect) {
      // Delay slightly on mobile to ensure UI updates properly
      if (isMobile) {
        setTimeout(() => {
          onSelect(item, index);
        }, 50);
      } else {
        onSelect(item, index);
      }
    }
  };
  
  if (items.length === 0) return null;
  
  return (
    <div className="sleep-results-card">
      <div 
        className="sleep-results-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl glow-icon">{icon}</span>}
          <h3 className="sleep-results-title">
            {title}
          </h3>
        </div>
        
        <button 
          className="p-1 rounded-full hover:bg-violet-500/10 transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-violet-300 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {expanded && (
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
                  data-index={index} /* Add data attribute for easier selection */
                  onClick={(e) => onSelect && handleSelect(item, index, e)}
                  onTouchStart={(e) => {
                    if (onSelect) {
                      // Mark this element as being touched for the touchend handler
                      (e.currentTarget as HTMLElement).dataset.touched = "true";
                      e.stopPropagation();
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (onSelect && (e.currentTarget as HTMLElement).dataset.touched === "true") {
                      // Clean up the touched flag
                      delete (e.currentTarget as HTMLElement).dataset.touched;
                      handleSelect(item, index, e);
                    }
                  }}
                  onTouchCancel={(e) => {
                    // Clean up the touched flag if the touch is canceled
                    delete (e.currentTarget as HTMLElement).dataset.touched;
                  }}
                  role={onSelect ? "button" : undefined}
                  tabIndex={onSelect ? 0 : undefined}
                  aria-label={onSelect ? `Select ${item}` : undefined}
                  aria-selected={isSelected}
                  onKeyDown={(e) => {
                    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSelect(item, index);
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {extraInfo[index]}
                        </span>
                      )}
                      
                      {/* Sleep duration (for bedtimes/wake times) */}
                      {sleepDurations[index] && (
                        <span className="sleep-results-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {sleepDurations[index]}
                        </span>
                      )}
                      
                      {/* Sleep cycles (for bedtimes/wake times) */}
                      {cycles[index] && (
                        <span className="sleep-results-badge">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          {cycles[index]} sleep {cycles[index] === 1 ? 'cycle' : 'cycles'}
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