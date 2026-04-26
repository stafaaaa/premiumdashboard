import React, { useState, useCallback } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Thermometer, MapPin, RefreshCw } from 'lucide-react';
import { WidgetCard } from './WidgetCard.tsx';
import { TileDesignSettings } from '../types.ts';

interface WeatherWidgetProps {
  settings: TileDesignSettings;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ settings }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    condition: string;
    forecast: { day: string; temp: number; icon: string }[];
  } | null>(null);
  const [error, setError] = useState(false);
  const isDark = settings.theme === 'dark';

  const fetchWeather = useCallback(async () => {
    if (!settings.city) return;
    setIsRefreshing(true);
    setError(false);
    try {
      // 1. Geocode city to coords (Open-Meteo needs coords)
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(settings.city)}&count=1&language=de&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude } = geoData.results[0];

      // 2. Fetch weather
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const data = await weatherRes.json();

      const getWeatherIcon = (code: number) => {
        if (code === 0) return 'sun';
        if (code <= 3) return 'cloud';
        if (code <= 48) return 'wind';
        if (code <= 67) return 'rain';
        if (code <= 77) return 'snow';
        if (code <= 82) return 'rain';
        return 'lightning';
      };

      const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

      setWeatherData({
        temp: Math.round(data.current.temperature_2m),
        condition: getWeatherIcon(data.current.weather_code),
        forecast: data.daily.time.slice(1, 6).map((time: string, idx: number) => ({
          day: days[new Date(time).getDay()],
          temp: Math.round(data.daily.temperature_2m_max[idx + 1]),
          icon: getWeatherIcon(data.daily.weather_code[idx + 1])
        }))
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [settings.city]);

  React.useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000); // 15 mins
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    switch (name) {
      case 'sun': return <Sun className={className} />;
      case 'cloud': return <Cloud className={className} />;
      case 'rain': return <CloudRain className={className} />;
      case 'lightning': return <CloudLightning className={className} />;
      case 'wind': return <Wind className={className} />;
      default: return <Sun className={className} />;
    }
  };

  // Fallback demo data if error or loading
  const demoForecast = [
    { day: 'Mo', temp: 22, icon: 'sun' },
    { day: 'Di', temp: 19, icon: 'cloud' },
    { day: 'Mi', temp: 18, icon: 'rain' },
    { day: 'Do', temp: 21, icon: 'sun' },
    { day: 'Fr', temp: 24, icon: 'lightning' },
  ];

  const currentTemp = weatherData?.temp ?? 21;
  const currentIcon = weatherData?.condition ?? 'sun';
  const displayForecast = weatherData?.forecast ?? demoForecast;

  return (
    <WidgetCard 
      title="Wetter" 
      settings={settings} 
      icon={<Cloud className="w-5 h-5" />}
      className="relative"
    >
      <button 
        onClick={fetchWeather}
        disabled={isRefreshing}
        className={`absolute top-3 right-12 p-1 rounded-full hover:bg-zinc-500/10 transition-all ${isRefreshing ? 'animate-spin opacity-50' : ''}`}
      >
        <RefreshCw size={14} className="text-zinc-500" />
      </button>

      <div className="flex flex-col gap-4 h-full justify-between py-2">
        {error && (
          <div className="absolute inset-0 bg-red-500/5 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl pointer-events-none">
             <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded">API Offline - Fallback aktiv</span>
          </div>
        )}
        
        {/* Main Temperature and icon row */}
        <div className="flex items-center justify-between px-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-cyan-500 mb-1">
              <MapPin size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{settings.city}</span>
            </div>
            <div className="flex items-baseline">
              <span className={`text-6xl font-black leading-none tracking-tighter ${isDark ? 'text-white' : 'text-black'}`}>
                {currentTemp}
              </span>
              <span className="text-2xl font-bold text-cyan-500 ml-1">°C</span>
            </div>
          </div>
          <IconComponent 
            name={currentIcon} 
            className={`w-16 h-16 ${currentIcon === 'sun' ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'text-zinc-400'}`} 
          />
        </div>

        {/* 5-Day Forecast - Expanded */}
        <div className={`mt-2 p-4 rounded-3xl border flex justify-between items-center ${isDark ? 'bg-black/20 border-zinc-800/50' : 'bg-zinc-50 border-zinc-100'}`}>
          {displayForecast.map((f, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-600'} transition-colors`}>{f.day}</span>
              <div className="scale-100 transition-transform group-hover:scale-110">
                <IconComponent 
                  name={f.icon} 
                  className={`w-6 h-6 ${f.icon === 'sun' ? 'text-yellow-400' : f.icon === 'rain' ? 'text-blue-400' : 'text-zinc-400'}`} 
                />
              </div>
              <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-zinc-900'} tabular-nums`}>{f.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
};
