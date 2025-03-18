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
  accent = 'blue', 
  onSelect,
  sleepDurations = [],
  cycles = []
}: SleepResultsProps) {
  const [expanded, setExpanded] = useState(true);
  
  if (items.length === 0) return null;
  
  // Color mappings for different accent colors
  const accentColors = {
    blue: {
      card: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      item: 'bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900 shadow-blue-100/50 dark:shadow-blue-900/30',
      button: 'bg-blue-100/50 hover:bg-blue-100 text-blue-700 dark:bg-blue-800/50 dark:hover:bg-blue-800 dark:text-blue-200',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
    },
    purple: {
      card: 'bg-purple-50 dark:bg-purple-900/20',
      title: 'text-purple-800 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      item: 'bg-white dark:bg-gray-800 border-purple-100 dark:border-purple-900 shadow-purple-100/50 dark:shadow-purple-900/30',
      button: 'bg-purple-100/50 hover:bg-purple-100 text-purple-700 dark:bg-purple-800/50 dark:hover:bg-purple-800 dark:text-purple-200',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
    },
    green: {
      card: 'bg-green-50 dark:bg-green-900/20',
      title: 'text-green-800 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      item: 'bg-white dark:bg-gray-800 border-green-100 dark:border-green-900 shadow-green-100/50 dark:shadow-green-900/30',
      button: 'bg-green-100/50 hover:bg-green-100 text-green-700 dark:bg-green-800/50 dark:hover:bg-green-800 dark:text-green-200',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
    },
    amber: {
      card: 'bg-amber-50 dark:bg-amber-900/20',
      title: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      item: 'bg-white dark:bg-gray-800 border-amber-100 dark:border-amber-900 shadow-amber-100/50 dark:shadow-amber-900/30',
      button: 'bg-amber-100/50 hover:bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:hover:bg-amber-800 dark:text-amber-200',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
    },
    red: {
      card: 'bg-red-50 dark:bg-red-900/20',
      title: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      item: 'bg-white dark:bg-gray-800 border-red-100 dark:border-red-900 shadow-red-100/50 dark:shadow-red-900/30',
      button: 'bg-red-100/50 hover:bg-red-100 text-red-700 dark:bg-red-800/50 dark:hover:bg-red-800 dark:text-red-200',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
    }
  };
  
  // Get the correct color set or fallback to blue
  const colors = accentColors[accent as keyof typeof accentColors] || accentColors.blue;
  
  return (
    <div className={`rounded-xl border ${colors.border} ${colors.card} overflow-hidden mb-6 transition-all duration-300 ease-in-out`}>
      <div 
        className="px-5 py-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          {icon && <span className="text-xl">{icon}</span>}
          <h3 className={`font-semibold text-lg ${colors.title}`}>
            {title}
          </h3>
        </div>
        
        <button 
          className="p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {expanded && (
        <div className="px-5 pb-5">
          {description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              {description}
            </p>
          )}
          
          <ul className="space-y-2.5">
            {items.map((item, index) => (
              <li 
                key={index}
                className={`py-3 px-4 rounded-lg border ${colors.item} shadow-sm
                  ${onSelect ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} 
                  flex flex-col md:flex-row md:items-center md:justify-between`}
                onClick={() => onSelect && onSelect(item)}
              >
                <div className="flex flex-col">
                  <span className="text-gray-800 dark:text-gray-200 font-medium mb-1 md:mb-0">{item}</span>
                  
                  {(sleepDurations.length > 0 || cycles.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-1.5 mb-2 md:mb-0">
                      {sleepDurations[index] && (
                        <span className={`text-xs px-2 py-1 rounded-md ${colors.badge} inline-flex items-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {sleepDurations[index]}
                        </span>
                      )}
                      
                      {cycles[index] && (
                        <span className={`text-xs px-2 py-1 rounded-md ${colors.badge} inline-flex items-center`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className={`text-xs md:text-sm px-3 py-1.5 rounded-md ${colors.button} transition-colors mt-2 md:mt-0`}
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