import { useState } from 'react';

// Global clock variables to support ticking without useEffect
const clockListeners = new Set();
let clockInterval = null;

const startGlobalClock = () => {
  if (clockInterval) return;
  clockInterval = setInterval(() => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    clockListeners.forEach(listener => listener(time));
  }, 1000);
};

// Header section containing search bar and unit selection
export default function Header({ unit, setUnit, onSearch }) {
  // Local state to capture input text
  const [searchValue, setSearchValue] = useState('');

  // Live ticking clock state
  const [timeString, setTimeString] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Register listener and start global clock
  clockListeners.add(setTimeString);
  startGlobalClock();

  // Calendar date state initialized once on mount
  const [dateString] = useState(() => {
    return new Date().toLocaleDateString([], {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  });

  // Handle form submissions to trigger search
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchValue.trim() !== '') {
      onSearch(searchValue);
    }
  };

  return (
    <header className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center py-4 px-6 border-b border-slate-800/60 bg-slate-950/20 backdrop-blur-sm z-30">
      
      {/* Search Input Box wrapped in a Form */}
      <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search location (e.g. London, Tokyo)..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-sm placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200"
        />
      </form>

      {/* Date & Settings Toggle Bar */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        
        {/* Clock structure display using Heroicons Clock */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-xs font-medium text-slate-300 select-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono">{timeString}</span>
          <span className="text-slate-800">|</span>
          <span>{dateString}</span>
        </div>

        {/* C/F Unit buttons */}
        <div className="flex p-1 bg-slate-900/60 border border-slate-850 rounded-2xl">
          <button
            onClick={() => setUnit('C')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
              unit === 'C'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
              unit === 'F'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>

      </div>
    </header>
  );
}
