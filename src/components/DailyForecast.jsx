// Vertical weekly outlook of daily forecasts
export default function DailyForecast({ forecastData }) {
  if (!forecastData || !forecastData.list) return null;

  // Group 3-hour forecast items by day of the week
  const getDailyForecasts = (list) => {
    const dailyMap = {};
    list.forEach((slot) => {
      const dayName = new Date(slot.dt * 1000).toLocaleDateString([], {
        weekday: 'short',
      });
      if (!dailyMap[dayName]) {
        dailyMap[dayName] = [];
      }
      dailyMap[dayName].push(slot);
    });

    // Map each day to a summarized forecast structure
    return Object.keys(dailyMap).map((day) => {
      const daySlots = dailyMap[day];
      // Grab midday slot as the visual condition icon representative
      const middaySlot =
        daySlots.find((s) => s.dt_txt.includes('12:00:00')) ||
        daySlots[Math.floor(daySlots.length / 2)];
      
      // Calculate true min/max temperatures for that entire day
      let minTemp = Infinity;
      let maxTemp = -Infinity;
      daySlots.forEach((s) => {
        if (s.main.temp_min < minTemp) minTemp = s.main.temp_min;
        if (s.main.temp_max > maxTemp) maxTemp = s.main.temp_max;
      });

      return {
        day,
        tempMin: Math.round(minTemp),
        tempMax: Math.round(maxTemp),
        iconCode: middaySlot.weather[0]?.icon,
        description: middaySlot.weather[0]?.description,
      };
    }).slice(0, 5); // Display 5 days
  };

  const dailyForecasts = getDailyForecasts(forecastData.list);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between">
      <div>
        
        {/* Title */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-2">
          <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase">
            5-Day Forecast
          </h3>
          <span className="text-[10px] bg-slate-800/50 border border-slate-700/40 px-2 py-0.5 rounded-lg text-slate-400 font-mono">
            Outlook
          </span>
        </div>

        {/* Forecast rows */}
        <div className="flex flex-col divide-y divide-slate-800/40">
          {dailyForecasts.map((forecast, index) => (
            <div key={index} className="flex items-center justify-between py-3.5 gap-4 select-none">
              
              {/* Day title */}
              <span className="w-16 text-sm text-slate-400 font-bold font-mono text-left">
                {forecast.day}
              </span>

              {/* Weather icon */}
              <div className="text-blue-400 shrink-0">
                {forecast.iconCode ? (
                  <img
                    src={`https://openweathermap.org/img/wn/${forecast.iconCode}.png`}
                    alt={forecast.description}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
                  </svg>
                )}
              </div>

              {/* Temperature progress slider (Visible on desktop) */}
              <div className="flex-1 hidden sm:flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">{forecast.tempMin}°</span>
                
                {/* Horizontal range visualizer */}
                <div className="flex-1 h-1.5 bg-slate-800/85 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-1/4 right-1/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
                
                <span className="text-xs text-slate-350 font-mono">{forecast.tempMax}°</span>
              </div>

              {/* Fallback values for mobile */}
              <div className="flex items-center gap-2 sm:hidden text-xs font-mono">
                <span className="text-slate-500">{forecast.tempMin}°</span>
                <span className="text-slate-300">{forecast.tempMax}°</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
