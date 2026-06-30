import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetailsGrid from './components/WeatherDetailsGrid';
import SavedLocations from './components/SavedLocations';
import SettingsPanel from './components/SettingsPanel';

// Load OpenWeatherMap API Key from Vite env configuration
const API_KEY = import.meta.env.OPENWEATHER_API_KEY;

// Main App container coordinating sidebar, header, and active tab viewports
export default function App() {
  // Navigation tab state: 'dashboard' | 'saved' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Temperature unit state: 'C' | 'F'
  const [unit, setUnit] = useState('C');

  // Weather data, loading, and error states (uninitialized on load)
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Saved locations states loaded from localStorage
  const [savedCities, setSavedCities] = useState(() => {
    try {
      const saved = localStorage.getItem('saved_cities');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [savedWeatherData, setSavedWeatherData] = useState([]);

  // Theme settings: dynamic background gradient based on weather condition
  const [dynamicColors, setDynamicColors] = useState(() => {
    try {
      const saved = localStorage.getItem('dynamic_colors');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Initial loaded trigger state
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Standalone API fetch function accepting string queries or coordinate objects
  const fetchWeather = async (queryOrCoords, unitSystem) => {

    setLoading(true);
    setError(null);
    try {
      const units = unitSystem === 'C' ? 'metric' : 'imperial';
      let weatherUrl, forecastUrl;

      if (typeof queryOrCoords === 'object') {
        const { lat, lon } = queryOrCoords;
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
      } else {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryOrCoords)}&appid=${API_KEY}&units=${units}`;
        forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(queryOrCoords)}&appid=${API_KEY}&units=${units}`;
      }

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (weatherRes.status === 401 || forecastRes.status === 401) {
        throw new Error("Invalid API Key. Please verify the API key at the top of src/App.jsx.");
      }
      if (weatherRes.status === 404 || forecastRes.status === 404) {
        throw new Error(`Location not found.`);
      }
      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("Failed to retrieve weather data from OpenWeatherMap.");
      }

      const weatherJson = await weatherRes.json();
      const forecastJson = await forecastRes.json();

      setWeatherData(weatherJson);
      setForecastData(forecastJson);
      setCity(weatherJson.name);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather data for all saved cities concurrently
  const fetchSavedCitiesWeather = async (cities, unitSystem) => {
    if (cities.length === 0) {
      setSavedWeatherData([]);
      return;
    }
    try {
      const units = unitSystem === 'C' ? 'metric' : 'imperial';
      const promises = cities.map((c) =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(c)}&appid=${API_KEY}&units=${units}`)
          .then((res) => (res.ok ? res.json() : null))
      );
      const results = await Promise.all(promises);
      setSavedWeatherData(results.filter(Boolean));
    } catch (e) {
      console.error("Failed to load saved cities weather", e);
    }
  };

  // Trigger initial fetch on component rendering once
  if (!initialLoaded) {
    setInitialLoaded(true);

    setLoading(true);

    // Load saved locations weather
    if (savedCities.length > 0) {
      fetchSavedCitiesWeather(savedCities, unit);
    }

    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather({ lat: latitude, lon: longitude }, unit);
        },
        () => {
          setError("Location access was denied. Please enable location permissions or search for a city manually in the search bar above.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser. Please search for a city manually in the search bar above.");
    }
  }

  // Handle city search submissions
  const handleSearch = (newCity) => {
    if (newCity && newCity.trim() !== '') {
      const cleanedCity = newCity.trim();
      setCity(cleanedCity);
      fetchWeather(cleanedCity, unit);
    }
  };

  // Handle temperature unit changes explicitly
  const handleUnitToggle = (newUnit) => {
    setUnit(newUnit);
    if (weatherData && city) {
      fetchWeather(city, newUnit);
    }
    if (savedCities.length > 0) {
      fetchSavedCitiesWeather(savedCities, newUnit);
    }
  };

  // Callback to add a city to saved locations
  const handleAddSavedCity = async (cityName) => {
    if (!cityName || cityName.trim() === '') return false;
    const cleanName = cityName.trim();

    // Avoid duplicate cities (case-insensitive)
    if (savedCities.some(c => c.toLowerCase() === cleanName.toLowerCase())) {
      throw new Error("This city is already saved in your dashboard.");
    }

    const units = unit === 'C' ? 'metric' : 'imperial';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanName)}&appid=${API_KEY}&units=${units}`;

    const res = await fetch(weatherUrl);
    if (!res.ok) {
      throw new Error("City not found. Please check spelling.");
    }

    const newWeatherData = await res.json();
    setSavedWeatherData(prev => [...prev, newWeatherData]);
    setSavedCities(prev => {
      const next = [...prev, newWeatherData.name];
      localStorage.setItem('saved_cities', JSON.stringify(next));
      return next;
    });
    return true;
  };

  // Callback to remove a city from saved locations
  const handleRemoveSavedCity = (cityName) => {
    const updatedCities = savedCities.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    setSavedCities(updatedCities);
    localStorage.setItem('saved_cities', JSON.stringify(updatedCities));
    setSavedWeatherData(prev => prev.filter(w => w.name.toLowerCase() !== cityName.toLowerCase()));
  };

  // Toggle dynamic color scheme background gradient
  const handleDynamicColorsToggle = (enabled) => {
    setDynamicColors(enabled);
    localStorage.setItem('dynamic_colors', JSON.stringify(enabled));
  };

  // Map OpenWeatherMap conditions to premium subtle background gradients
  const getBackgroundClass = () => {
    if (!dynamicColors || !weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return "bg-slate-950";
    }
    const weatherId = weatherData.weather[0].id;

    if (weatherId >= 200 && weatherId < 300) {
      return "bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950";
    }
    if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      return "bg-gradient-to-br from-slate-950 via-blue-950/25 to-slate-950";
    }
    if (weatherId >= 600 && weatherId < 700) {
      return "bg-gradient-to-br from-slate-950 via-sky-950/20 to-slate-950";
    }
    if (weatherId >= 700 && weatherId < 800) {
      return "bg-gradient-to-br from-slate-950 via-zinc-900/30 to-slate-950";
    }
    if (weatherId === 800) {
      return "bg-gradient-to-br from-slate-950 via-amber-950/15 to-slate-950";
    }
    return "bg-gradient-to-br from-slate-950 via-slate-900/40 to-slate-950";
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row text-slate-100 antialiased font-sans transition-colors duration-500 ${getBackgroundClass()}`}>
      
      {/* Navigation sidebar / mobile bottom navbar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content window */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Search and settings top bar */}
        <Header unit={unit} setUnit={handleUnitToggle} onSearch={handleSearch} />

        {/* Dynamic Inner Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Dashboard Viewport Layout */}
          {activeTab === 'dashboard' && (
            <>
              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
              )}

              {/* Error instruction display card (Geolocation denied / API Key missing / City Not Found) */}
              {error && !loading && (
                <div className="bg-slate-900/50 backdrop-blur-md border border-red-500/20 p-6 rounded-3xl text-center space-y-4">
                  <div className="inline-flex p-3 bg-red-500/10 text-red-400 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Weather Retrieval Stopped</h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
                </div>
              )}

              {/* Live dashboard stats */}
              {!loading && !error && weatherData && forecastData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Column (1/3): Current Weather Card + Weekly Forecast */}
                  <div className="lg:col-span-1 space-y-6">
                    <CurrentWeather weatherData={weatherData} unit={unit} />
                    <DailyForecast forecastData={forecastData} />
                  </div>

                  {/* Right Column (2/3): Hourly timeline + parameter metrics */}
                  <div className="lg:col-span-2 space-y-6">
                    <HourlyForecast forecastData={forecastData} />
                    
                    {/* Visual section separator */}
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">
                        Weather Parameters
                      </span>
                      <div className="flex-1 h-[1px] bg-slate-800"></div>
                    </div>

                    {/* Grid detailing weather parameters */}
                    <WeatherDetailsGrid weatherData={weatherData} unit={unit} />
                  </div>

                </div>
              )}
            </>
          )}

          {/* Saved Locations Viewport Layout */}
          {activeTab === 'saved' && (
            <SavedLocations
              savedWeatherData={savedWeatherData}
              onAddCity={handleAddSavedCity}
              onRemoveCity={handleRemoveSavedCity}
            />
          )}

          {/* Settings Viewport Layout */}
          {activeTab === 'settings' && (
            <SettingsPanel
              unit={unit}
              setUnit={handleUnitToggle}
              dynamicColors={dynamicColors}
              setDynamicColors={handleDynamicColorsToggle}
            />
          )}
        </main>

      </div>
    </div>
  );
}
