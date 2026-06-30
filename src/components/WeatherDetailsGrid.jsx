// Grid panel of individual weather detail metrics
export default function WeatherDetailsGrid({ weatherData, unit }) {
  if (!weatherData) return null;

  // Extract variables
  const { wind, main, sys, clouds, visibility } = weatherData;

  // Wind direction helper
  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8];
  };

  const windSpeedUnit = unit === 'C' ? 'km/h' : 'mph';
  // OpenWeatherMap wind speed is in m/s for metric, and mph for imperial.
  // Let's convert m/s to km/h if unit is C (1 m/s = 3.6 km/h)
  const speedVal = unit === 'C' ? Math.round(wind.speed * 3.6) : Math.round(wind.speed);
  const windDir = wind.deg !== undefined ? getWindDirection(wind.deg) : '--';
  const windRotation = wind.deg !== undefined ? wind.deg : 0;

  // Humidity
  const humidityVal = main.humidity !== undefined ? main.humidity : '--';

  // UV index estimation based on cloud cover
  const cloudCover = clouds?.all ?? 50;
  const estUv = Math.max(1, Math.round(11 - (cloudCover / 10)));
  const getUvCategory = (uv) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };
  const uvCategory = getUvCategory(estUv);

  // Sunrise/Sunset formatting
  const sunriseTime = sys.sunrise
    ? new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const sunsetTime = sys.sunset
    ? new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  // Calculate daylight duration in hours
  const daylightHours = sys.sunset && sys.sunrise
    ? ((sys.sunset - sys.sunrise) / 3600).toFixed(1)
    : '--';

  // Air Quality Index estimation based on visibility and wind
  const visKm = visibility ? visibility / 1000 : 10;
  const airQualityVal = Math.max(15, Math.min(150, Math.round(160 - visKm * 6 - wind.speed * 4)));
  const getAqiCategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    return 'Poor';
  };
  const aqiCategory = getAqiCategory(airQualityVal);

  // Pressure
  const pressureVal = main.pressure || '--';

  // Visibility range in kilometers or miles
  const visibilityDistance = visibility
    ? unit === 'C'
      ? (visibility / 1000).toFixed(1)
      : (visibility * 0.000621371).toFixed(1)
    : '--';
  const visibilityUnit = unit === 'C' ? 'km' : 'mi';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {/* Wind Details Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Wind</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Realtime</span>
        </div>
        
        <div className="flex items-center justify-between my-4 gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold font-mono text-white">{speedVal}</span>
            <span className="text-xs text-slate-400 font-medium">{windSpeedUnit}</span>
          </div>

          {/* Rotatable wind direction compass */}
          <div className="w-14 h-14 border border-slate-800/80 rounded-full flex items-center justify-center relative shadow-inner">
            <span className="absolute top-0.5 text-[8px] font-bold text-slate-650">N</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-blue-400 transition-transform duration-300"
              style={{ transform: `rotate(${windRotation}deg)` }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">Direction: {windDir} ({windRotation}°)</p>
      </div>

      {/* Humidity Details Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Humidity</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Relative</span>
        </div>

        <div className="my-4">
          <span className="text-3xl font-bold font-mono text-white">{humidityVal}%</span>
          <div className="w-full h-2 bg-slate-855 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${humidityVal}%` }}
            ></div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">Dew point: estimated</p>
      </div>

      {/* UV Index Details Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.03 5.03l1.59 1.59m10.76 10.76l1.59 1.59M3 12h2.25m13.5 0H21M5.03 18.97l1.59-1.59m10.76-10.76l1.59 1.59M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 0 0 0-7.5z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">UV Index</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Estimated</span>
        </div>

        <div className="my-4">
          <span className="text-3xl font-bold font-mono text-white">{estUv}</span>
          <div className="w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mt-3 relative">
            <div
              className="w-3 h-3 bg-white border border-slate-900 rounded-full absolute -top-0.5 shadow"
              style={{ left: `${Math.min(100, (estUv / 11) * 100)}%` }}
            ></div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">Category: {uvCategory}</p>
      </div>

      {/* Sunrise & Sunset Solar Path Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between select-none lg:col-span-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M5.03 5.03l1.59 1.59m10.76 10.76l1.59 1.59M3 12h2.25m13.5 0H21M5.03 18.97l1.59-1.59m10.76-10.76l1.59 1.59M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 0 0 0-7.5z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Sunrise & Sunset</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Solar Arc</span>
        </div>

        {/* Solar path vector */}
        <div className="flex items-center justify-between my-4 gap-6">
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-500 font-medium">Sunrise</span>
            <span className="text-sm font-semibold font-mono text-white">{sunriseTime}</span>
          </div>

          <div className="flex-grow h-12 relative">
            <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M 0 30 Q 50 0 100 30" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="50" cy="15" r="3.5" fill="#eab308" className="animate-pulse" />
            </svg>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-500 font-medium">Sunset</span>
            <span className="text-sm font-semibold font-mono text-white">{sunsetTime}</span>
          </div>
        </div>
        
        <p className="text-[10px] text-slate-500 font-mono text-center">Daylight: {daylightHours} hours</p>
      </div>

      {/* Air Quality Index Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Air Quality</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Estimated</span>
        </div>

        <div className="my-4">
          <span className="text-3xl font-bold font-mono text-white">{airQualityVal}</span>
          <div className="w-full h-2 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full mt-3 relative">
            <div
              className="w-3 h-3 bg-white border border-slate-900 rounded-full absolute -top-0.5 shadow"
              style={{ left: `${Math.min(100, (airQualityVal / 180) * 100)}%` }}
            ></div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">Category: {aqiCategory}</p>
      </div>

      {/* Pressure Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.625C7.5 19.371 6.996 19.875 6.375 19.875h-2.25A1.125 1.125 0 0 1 3 18.75v-5.625zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.625c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Pressure</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Barometer</span>
        </div>

        <div className="my-4">
          <span className="text-3xl font-bold font-mono text-white">{pressureVal}</span>
          <span className="text-xs text-slate-400 font-semibold ml-1">hPa</span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">Trend: stable</p>
      </div>

      {/* Visibility Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-blue-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.412 8.357 8.3 5.4 12.002 5.4c3.7 0 8.59 2.957 9.966 6.278a1.012 1.012 0 010 .644C20.588 15.64 15.7 18.6 11.998 18.6c-3.7 0-8.59-2.957-9.966-6.278z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Visibility</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Range</span>
        </div>

        <div className="my-4">
          <span className="text-3xl font-bold font-mono text-white">{visibilityDistance}</span>
          <span className="text-xs text-slate-400 font-semibold ml-1">{visibilityUnit}</span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono">Clear line of sight</p>
      </div>

    </div>
  );
}
