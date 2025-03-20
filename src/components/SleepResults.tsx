'use client';

import { useState } from 'react';

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
  selectedIndex = null
}: SleepResultsProps) {
  const [expanded, setExpanded] = useState(true);
  
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
                  onClick={() => {
                    if (onSelect) {
                      console.log(`Clicked on item: ${item} at index: ${index}`);
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
                    
                    {(sleepDurations.length > 0 || cycles.length > 0) && (
                      <div className="sleep-results-badges">
                        {sleepDurations[index] && (
                          <span className="sleep-results-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {sleepDurations[index]}
                          </span>
                        )}
                        
                        {cycles[index] && (
                          <span className="sleep-results-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {cycles[index]} sleep {cycles[index] === 1 ? 'cycle' : 'cycles'}
                          </span>
                        )}
                      </div>
                    )}
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