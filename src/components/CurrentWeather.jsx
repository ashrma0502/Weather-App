// Current weather indicators card shell
export default function CurrentWeather({ weatherData, unit }) {
  if (!weatherData) return null;

  // Destructure weather parameters
  const { name, sys, main, weather, dt } = weatherData;
  const temp = Math.round(main.temp);
  const tempMin = Math.round(main.temp_min);
  const tempMax = Math.round(main.temp_max);
  const description = weather[0]?.description || '--';
  const iconCode = weather[0]?.icon;

  // Format UNIX timestamp
  const lastUpdate = new Date(dt * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      {/* City and status bar */}
      <div className="relative z-10 flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
            </svg>
            <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
              {name}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-medium">{sys.country}</p>
        </div>
        
        {/* Weather Icon slot rendering official OpenWeatherMap icon */}
        <div className="bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-2xl relative shadow-inner shrink-0">
          {iconCode ? (
            <img
              src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
              alt={description}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-400 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.03 5.03l1.59 1.59m10.76 10.76l1.59 1.59M3 12h2.25m13.5 0H21M5.03 18.97l1.59-1.59m10.76-10.76l1.59 1.59M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 0 0 0-7.5z" />
            </svg>
          )}
        </div>
      </div>

      {/* Main Temperature values */}
      <div className="relative z-10 my-6 sm:my-8 flex items-baseline gap-1 select-none">
        <span className="text-7xl sm:text-8xl font-black tracking-tighter text-white leading-none font-mono">
          {temp}
        </span>
        <span className="text-4xl sm:text-5xl font-semibold text-blue-400 leading-none">
          °{unit}
        </span>
      </div>

      {/* High and low temperature indicators */}
      <div className="relative z-10">
        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center mb-3">
          <span className="text-sm font-semibold text-slate-350 capitalize">{description}</span>
          <span className="text-slate-800">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="text-red-400 font-semibold">H: {tempMax}°</span>
            <span className="text-blue-400 font-semibold">L: {tempMin}°</span>
          </div>
        </div>
        
        {/* Visual temperature progress slider */}
        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
        </div>
        
        <p className="text-[10px] text-slate-500 mt-2 font-mono">Last update: {lastUpdate}</p>
      </div>

    </div>
  );
}
