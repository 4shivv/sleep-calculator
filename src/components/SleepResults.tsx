'use client';

import { useState } from 'react';

interface SleepResultsProps {
  title: string;
  items: string[];
  description?: string;
  icon?: React.ReactNode;
  accent?: string;
  onSelect?: (item: string) => void;
  sleepDurations?: string[];
  cycles?: number[];
}

export default function SleepResults({ 
  title, 
  items, 
  description, 
  icon, 
  accent: _,
  onSelect,
  sleepDurations = [],
  cycles = []
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
            {items.map((item, index) => (
              <li 
                key={index}
                className={`sleep-results-item ${
                  onSelect ? 'cursor-pointer' : ''
                }`}
                onClick={() => onSelect && onSelect(item)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:gap-4 flex-grow">
                  <span className="sleep-results-time text-violet-100">{item}</span>
                  
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
                
                {onSelect && (
                  <button 
                    className="sleep-results-select-button mt-2 md:mt-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}
                  >
                    Select
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}