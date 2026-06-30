// Preference settings and toggles panel
export default function SettingsPanel({ unit, setUnit, dynamicColors, setDynamicColors }) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-slate-800/60 pb-3">
        <h2 className="text-xl font-bold tracking-tight text-white leading-tight">
          App Settings
        </h2>
        <p className="text-xs text-slate-400 font-medium">Configure dashboard displays and measurement units</p>
      </div>

      {/* Main settings box */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-3xl max-w-2xl">
        <div className="divide-y divide-slate-800/60 space-y-5 [&>div]:pt-5 first:[&>div]:pt-0">
          
          {/* Temperature unit setting */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Temperature Unit
              </p>
              <p className="text-xs text-slate-500">
                Display temperatures in Celsius or Fahrenheit
              </p>
            </div>
            
            <div className="flex p-1 bg-slate-950 border border-slate-850 rounded-2xl shrink-0">
              <button
                onClick={() => setUnit('C')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                  unit === 'C'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => setUnit('F')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                  unit === 'F'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          {/* Refresh frequency setting */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Auto Refresh Rate
              </p>
              <p className="text-xs text-slate-500">
                Background refresh frequency
              </p>
            </div>
            <select className="bg-slate-950 border border-slate-800 text-slate-300 px-3 py-2 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer">
              <option className="bg-slate-950">Every 15 Minutes</option>
              <option className="bg-slate-950">Every 30 Minutes</option>
              <option className="bg-slate-950">Every Hour</option>
              <option className="bg-slate-950">Manual Refresh Only</option>
            </select>
          </div>

          {/* Dynamic weather ambient colors theme setting */}
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Dynamic Weather Colors
              </p>
              <p className="text-xs text-slate-500">
                Alter background gradients based on weather conditions
              </p>
            </div>

            <div
              onClick={() => setDynamicColors(!dynamicColors)}
              className={`w-11 h-6 rounded-full p-0.5 flex items-center border cursor-pointer relative shrink-0 transition-all duration-200 ${
                dynamicColors
                  ? "bg-blue-600/25 border-blue-500/20 justify-end"
                  : "bg-slate-800 border-slate-700 justify-start"
              }`}
            >
              <div className={`w-5 h-5 rounded-full shadow transition-all duration-200 ${
                dynamicColors ? "bg-blue-400" : "bg-slate-500"
              }`}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
