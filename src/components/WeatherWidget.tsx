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
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const data = await weatherRes.json();

      const getWeatherIcon = (code: number, isDay: number = 1) => {
        if (code === 0) return isDay ? 'sun' : 'night';
        if (code === 1 || code === 2) return isDay ? 'cloudy-day' : 'cloudy-night';
        if (code === 3) return 'cloud';
        if (code <= 48) return 'fog';
        if (code <= 67) return 'rain';
        if (code <= 77) return 'snow';
        if (code <= 82) return 'rain';
        if (code >= 95) return 'lightning';
        return 'sun';
      };

      const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

      setWeatherData({
        temp: Math.round(data.current.temperature_2m),
        condition: getWeatherIcon(data.current.weather_code, data.current.is_day),
        forecast: data.daily.time.slice(1, 6).map((time: string, idx: number) => ({
          day: days[new Date(time).getDay()],
          temp: Math.round(data.daily.temperature_2m_max[idx + 1]),
          icon: getWeatherIcon(data.daily.weather_code[idx + 1], 1) // Forecast assumed as day
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
    const iconSize = className?.includes('w-16') ? 64 : 24;
    
    switch (name) {
      case 'sun':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <defs>
              <linearGradient id="sun-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <filter id="sun-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="32" cy="32" r="14" fill="url(#sun-grad)" filter="url(#sun-glow)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <rect key={deg} x="30" y="8" width="4" height="8" rx="2" fill="#fbbf24" transform={`rotate(${deg}, 32, 32)`} />
            ))}
          </svg>
        );
      case 'night':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <defs>
              <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>
            <path d="M42,32 A16,16 0 1,1 26,16 A12,12 0 0,0 42,32" fill="url(#moon-grad)" />
            <circle cx="28" cy="24" r="1.5" fill="#64748b" opacity="0.5" />
            <circle cx="34" cy="36" r="2" fill="#64748b" opacity="0.5" />
            <circle cx="22" cy="38" r="1" fill="#64748b" opacity="0.5" />
          </svg>
        );
      case 'cloud':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <defs>
              <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
              <filter id="cloud-shadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
              </filter>
            </defs>
            <path d="M46,40 a8,8 0 0,0 0,-16 a7,7 0 0,0 -12,-4 a10,10 0 1,0 -16,10 a8,8 0 1,0 0,10 z" fill="url(#cloud-grad)" filter="url(#cloud-shadow)" />
          </svg>
        );
      case 'cloudy-day':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <circle cx="44" cy="24" r="10" fill="#fbbf24" />
            <path d="M46,44 a8,8 0 0,0 0,-16 a7,7 0 0,0 -12,-4 a10,10 0 1,0 -16,10 a8,8 0 1,0 0,10 z" fill="white" />
          </svg>
        );
      case 'cloudy-night':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <path d="M44,24 A10,10 0 1,1 34,14 A8,8 0 0,0 44,24" fill="#cbd5e1" />
            <path d="M46,44 a8,8 0 0,0 0,-16 a7,7 0 0,0 -12,-4 a10,10 0 1,0 -16,10 a8,8 0 1,0 0,10 z" fill="#f1f5f9" />
          </svg>
        );
      case 'rain':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <path d="M46,32 a8,8 0 0,0 0,-16 a7,7 0 0,0 -12,-4 a10,10 0 1,0 -16,10 a8,8 0 1,0 0,10 z" fill="#94a3b8" />
            <g fill="#60a5fa">
              <path d="M22,44 v4 a2,2 0 0,1 -4,0 v-4 z" transform="rotate(15, 20, 46)" />
              <path d="M32,44 v4 a2,2 0 0,1 -4,0 v-4 z" transform="rotate(15, 30, 46)" />
              <path d="M42,44 v4 a2,2 0 0,1 -4,0 v-4 z" transform="rotate(15, 40, 46)" />
            </g>
          </svg>
        );
      case 'lightning':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <path d="M46,32 a8,8 0 0,0 0,-16 a7,7 0 0,0 -12,-4 a10,10 0 1,0 -16,10 a8,8 0 1,0 0,10 z" fill="#475569" />
            <path d="M30,36 l-4,12 h6 l-2,10 l10,-14 h-6 l4,-8 z" fill="#fbbf24" />
          </svg>
        );
      case 'snow':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <path d="M46,32 a8,8 0 0,0 0,-16 a7,7 0 0,0 -12,-4 a10,10 0 1,0 -16,10 a8,8 0 1,0 0,10 z" fill="#e2e8f0" />
            <g stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <path d="M20,44 l4,4 m-4,0 l4,-4" />
              <path d="M32,46 l4,4 m-4,0 l4,-4" />
              <path d="M44,44 l4,4 m-4,0 l4,-4" />
            </g>
          </svg>
        );
      case 'fog':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" className={className}>
            <path d="M46,32 a8,8 0 0,0 0,-16 a7,7 0 0,0 -12,-4 a10,10 0 1,0 -16,10 a8,8 0 1,0 0,10 z" fill="#cbd5e1" opacity="0.6" />
            <g stroke="#94a3b8" strokeWidth="3" strokeLinecap="round">
              <line x1="16" y1="40" x2="48" y2="40" />
              <line x1="20" y1="48" x2="44" y2="48" />
              <line x1="18" y1="56" x2="46" y2="56" />
            </g>
          </svg>
        );
      default:
        return <Sun className={className} />;
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
