// Horizontally scrollable timeline of hourly forecasts
export default function HourlyForecast({ forecastData }) {
  if (!forecastData || !forecastData.list) return null;

  // Take the first 6 forecast items (covering 18 hours)
  const hourlySlots = forecastData.list.slice(0, 6);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 sm:p-6 rounded-3xl">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
          Hourly Forecast
        </h3>
        <span className="text-[10px] bg-slate-800/50 border border-slate-700/40 px-2 py-0.5 rounded-lg text-slate-400 font-mono">
          Next 18 Hours
        </span>
      </div>

      {/* Horizontal timeline */}
      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
        {hourlySlots.map((slot, index) => {
          const slotTime = new Date(slot.dt * 1000).toLocaleTimeString([], {
            hour: 'numeric',
            hour12: true,
          });
          const temp = Math.round(slot.main.temp);
          const iconCode = slot.weather[0]?.icon;
          const pop = Math.round((slot.pop || 0) * 100); // Probability of precipitation

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-between p-3.5 min-w-[90px] flex-1 bg-slate-900/20 border border-slate-800/60 rounded-2xl hover:bg-slate-800/30 hover:border-slate-700/60 transition-all duration-200 select-none"
            >
              {/* Hour index */}
              <span className="text-xs text-slate-400 font-semibold font-mono">{slotTime}</span>

              {/* Weather status icon */}
              <div className="my-2.5 shrink-0">
                {iconCode ? (
                  <img
                    src={`https://openweathermap.org/img/wn/${iconCode}.png`}
                    alt={slot.weather[0]?.description}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2500/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-300/80 animate-pulse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                  </svg>
                )}
              </div>

              {/* Temperature scale */}
              <span className="text-base font-bold text-white font-mono">{temp}°</span>

              {/* Precipitation probability using Heroicons Arrow-Down */}
              <div className="flex items-center gap-0.5 mt-2 text-[10px] text-blue-350/80 font-mono">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                <span>{pop}%</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
