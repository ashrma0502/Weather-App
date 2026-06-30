import { useState } from 'react';

// Favorite cities dashboard monitor layout
export default function SavedLocations({ savedWeatherData, onAddCity, onRemoveCity }) {
  // Local states to handle custom city addition form inside card
  const [isAdding, setIsAdding] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [addError, setAddError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit handler to append a city
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (newCityName.trim() === '') return;

    setIsSubmitting(true);
    setAddError(null);
    try {
      const success = await onAddCity(newCityName);
      if (success) {
        setIsAdding(false);
        setNewCityName('');
      }
    } catch (err) {
      setAddError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
            Saved Locations
          </h2>
          <p className="text-xs text-slate-400 font-medium">Quick monitoring of favorited global locations</p>
        </div>
      </div>

      {/* Locations grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Render saved weather locations */}
        {savedWeatherData.map((w, index) => {
          const temp = Math.round(w.main.temp);
          const iconCode = w.weather[0]?.icon;
          const condition = w.weather[0]?.main || '--';
          
          // Calculate localized city clock based on OWM timezone offset (seconds from UTC)
          const deviceTimezoneOffset = new Date().getTimezoneOffset() * 60000;
          const utcTimestamp = new Date().getTime() + deviceTimezoneOffset;
          const cityLocalTime = new Date(utcTimestamp + w.timezone * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={index}
              className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[160px] group hover:bg-slate-800/40 hover:border-slate-700/60 transition-all duration-300 select-none"
            >
              {/* Location title row */}
              <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">{w.name}</h3>
                  <span className="text-[10px] text-slate-400 font-medium font-mono">{cityLocalTime}</span>
                </div>
                
                {/* Delete button */}
                <button
                  onClick={() => onRemoveCity(w.name)}
                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer"
                  title="Remove location"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Temperature and status details */}
              <div className="flex justify-between items-end z-10 mt-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-extrabold font-mono text-white leading-none">{temp}°</span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 capitalize">{condition}</span>
                </div>

                {/* Weather icon visual */}
                <div className="text-blue-400/80 group-hover:text-blue-400 transition-colors shrink-0">
                  {iconCode ? (
                    <img
                      src={`https://openweathermap.org/img/wn/${iconCode}.png`}
                      alt={condition}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Accent ribbon */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60"></div>
            </div>
          );
        })}

        {/* Dynamic add new city entry card */}
        {isAdding ? (
          <form
            onSubmit={handleAddSubmit}
            className="bg-slate-900/60 border border-blue-500/30 p-5 rounded-3xl flex flex-col justify-between min-h-[160px] relative"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Add New City</label>
              <input
                type="text"
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                placeholder="Enter city (e.g. Paris)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                disabled={isSubmitting}
                autoFocus
              />
              {addError && (
                <p className="text-[9px] text-red-400 font-medium leading-tight">{addError}</p>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewCityName('');
                  setAddError(null);
                }}
                className="px-2.5 py-1.5 border border-slate-800 hover:bg-slate-800 text-[10px] font-semibold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-[10px] font-semibold text-white rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                disabled={isSubmitting || newCityName.trim() === ''}
              >
                {isSubmitting ? 'Loading...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <div
            onClick={() => setIsAdding(true)}
            className="border border-dashed border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/20 p-5 rounded-3xl flex flex-col items-center justify-center min-h-[160px] group cursor-pointer transition-all duration-300"
          >
            <div className="bg-slate-900/60 border border-slate-800/80 group-hover:border-blue-500/30 group-hover:bg-blue-600/10 p-3 rounded-2xl mb-3 text-slate-400 group-hover:text-blue-400 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
              Add Location
            </span>
            <span className="text-[10px] text-slate-650 mt-1">Monitor additional city</span>
          </div>
        )}

      </div>

      {/* Info card display when list is empty */}
      {savedWeatherData.length === 0 && !isAdding && (
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-3xl p-6 text-center text-slate-400 text-sm max-w-lg mx-auto">
          No saved locations yet. Click <strong>"Add Location"</strong> above to start tracking your favorite global cities.
        </div>
      )}

    </div>
  );
}
