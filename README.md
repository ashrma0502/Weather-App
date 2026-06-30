# Weather Dashboard

A glassmorphism-styled weather dashboard built with React, Vite, and Tailwind CSS. It shows current conditions, an hourly timeline, a 5-day outlook, and a grid of detailed atmospheric metrics for any city, with support for saving multiple favorite locations.

**Live demo:** [weather-focus.vercel.app](https://weather-focus.vercel.app/)

## Features

- **Location-aware on load** — requests the browser's geolocation for an immediate local forecast, with manual city search available at any time from the header
- **Current conditions card** — temperature, daily high/low, condition description, weather icon, and last-updated time
- **Hourly forecast** — a scrollable strip covering the next ~18 hours in 3-hour increments, with precipitation probability
- **5-day forecast** — daily high/low temperature ranges with condition icons
- **Detailed metrics grid** — wind speed & direction with a rotating compass, humidity, UV index*, sunrise/sunset times with daylight length, air quality index*, barometric pressure, and visibility
- **Saved Locations** — add or remove favorite cities and monitor each one's current temperature and local time at a glance
- **Unit toggle** — switch the whole app between Celsius and Fahrenheit
- **Dynamic background** — an optional background gradient that shifts tone based on the active city's current weather condition
- **Persisted preferences** — saved cities and the dynamic-color preference are stored in `localStorage` and restored on reload
- **Responsive layout** — a sidebar on desktop that collapses into a bottom tab bar on mobile

\* UV index and air quality are estimated client-side from cloud cover, visibility, and wind speed, since the OpenWeatherMap endpoints used here don't return them directly. Treat them as indicative rather than precise readings.

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/) via `@vitejs/plugin-react`
- [Tailwind CSS 4](https://tailwindcss.com/) via the `@tailwindcss/vite` plugin
- [OpenWeatherMap API](https://openweathermap.org/api) — Current Weather Data and 5 Day / 3 Hour Forecast endpoints
- ESLint 10 for linting
- Icons are inline SVGs in the Heroicons style — no icon package dependency

## Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Create a `.env` file in the project root:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

   Open the URL printed in your terminal (typically `http://localhost:5173`).

> New OpenWeatherMap keys can take a little while to activate. If the app reports "Invalid API Key" right after signing up, wait a few minutes and try again.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_OPENWEATHER_API_KEY` | Yes | API key used to call OpenWeatherMap's Current Weather and Forecast endpoints |

Because this is a Vite project, any variable prefixed with `VITE_` is inlined into the client-side bundle at build time and is visible to anyone using the deployed app — don't reuse a key you need to keep private.

## Available Scripts

- `npm run dev` — start the Vite dev server with hot module reload
- `npm run build` — produce a production build in `dist/`
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint over the project

## Project Structure

```
.
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # App state, OpenWeatherMap requests, tab layout
    ├── index.css                 # Tailwind import + global styles
    └── components/
        ├── Sidebar.jsx            # Desktop sidebar / mobile bottom nav
        ├── Header.jsx             # Search bar, clock, unit toggle
        ├── CurrentWeather.jsx     # Current conditions card
        ├── HourlyForecast.jsx     # Hourly forecast strip
        ├── DailyForecast.jsx      # 5-day outlook
        ├── WeatherDetailsGrid.jsx # Wind, humidity, UV, sun, AQI, pressure, visibility
        ├── SavedLocations.jsx     # Saved cities grid with add/remove
        └── SettingsPanel.jsx      # Unit & dynamic-color preferences
```

## Deployment

The live demo runs on Vercel. To deploy your own copy:

1. Push this project to a Git provider (GitHub, GitLab, etc.)
2. Import it into Vercel and select the **Vite** framework preset — it sets the build command (`npm run build`) and output directory (`dist`) automatically
3. Add `VITE_OPENWEATHER_API_KEY` under Project Settings → Environment Variables
4. Deploy

## Known Limitations

- UV index and air quality figures are estimates derived on the client, not measurements from a dedicated air-quality API
- The "Auto Refresh Rate" option in Settings is currently UI-only and isn't yet wired up to automatic background refreshing
- Like any purely front-end app using `VITE_`-prefixed env vars, the OpenWeatherMap API key ships inside the client bundle

## License

No license file is currently included. Add one (for example, MIT) if you plan to share or open-source this project.
