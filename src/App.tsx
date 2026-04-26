import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Clock,
  LayoutGrid,
  Maximize2,
  Lock,
  Power
} from 'lucide-react';
import { SettingsPanel } from './components/SettingsPanel.tsx';
import { WeatherWidget } from './components/WeatherWidget.tsx';
import { CalendarWidget } from './components/CalendarWidget.tsx';
import { SpotifyWidget } from './components/SpotifyWidget.tsx';
import { SlideshowWidget } from './components/SlideshowWidget.tsx';
import { TileDesignSettings, DEFAULT_SETTINGS } from './types.ts';
import { format } from 'date-fns';

const STORAGE_KEY = 'dashboard-tile-settings';

export default function App() {
  const [settings, setSettings] = useState<TileDesignSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }, []);

  // Save to localStorage
  const handleUpdateSettings = (newSettings: TileDesignSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const THEMES = {
    dark: { bg: 'bg-zinc-950', text: 'text-zinc-100' },
    light: { bg: 'bg-zinc-50', text: 'text-zinc-900' },
    sunset: { bg: 'bg-orange-950', text: 'text-orange-50' },
    ocean: { bg: 'bg-blue-950', text: 'text-blue-50' },
    forest: { bg: 'bg-emerald-950', text: 'text-emerald-50' },
    midnight: { bg: 'bg-indigo-950', text: 'text-indigo-50' },
  };

  const currentTheme = THEMES[settings.theme] || THEMES.dark;

  return (
    <div className={`min-h-screen font-sans selection:bg-white/30 overflow-x-hidden transition-all duration-700 relative ${currentTheme.bg} ${currentTheme.text}`}>
      {/* Background Image Layer */}
      {settings.backgroundImage && (
        <div 
          className="fixed inset-0 z-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            backgroundImage: `url(${settings.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: settings.theme === 'light' ? 0.15 : 0.4
          }}
        />
      )}

      <div className="relative z-10 flex flex-col h-screen">
        {/* Top Status Bar (Fridge Style) */}
        <nav className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-50 overflow-hidden ${settings.theme === 'light' ? 'bg-white/80 border-zinc-200' : 'bg-black/40 border-zinc-700'} backdrop-blur-md`}>
          {/* Shine top bar */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-left">
              <span className={`text-3xl font-black tracking-tighter leading-none ${settings.theme === 'light' ? 'text-zinc-950' : 'text-white'}`}>
                {format(currentTime, 'HH:mm')}
              </span>
              <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${settings.theme === 'light' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {format(currentTime, 'EEEE, dd. MMMM')}
              </span>
            </div>
            
            <div className={`h-8 w-px ${settings.theme === 'light' ? 'bg-zinc-200' : 'bg-zinc-800'}`} />
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Fridge</span>
              <span className="text-lg font-bold text-cyan-500 leading-none">4°C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Freezer</span>
              <span className="text-lg font-bold text-blue-500 leading-none">-18°C</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors group"
          >
            <SettingsIcon className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors">
            <Clock className="w-5 h-5 text-zinc-500" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors">
            <Power className="w-5 h-5 text-red-500/50" />
          </button>
        </div>
      </nav>

      {/* Grid Layout (optimized fixed view for 11" landscape) */}
      <main className="p-4 max-w-[1920px] mx-auto h-[calc(100vh-64px-48px)] grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-hidden">
        
        {/* Column 1: Calendar (Full Height) */}
        <div className="h-full overflow-hidden">
          <CalendarWidget settings={settings} />
        </div>

        {/* Column 2: Slideshow */}
        <div className="h-full overflow-hidden">
          <SlideshowWidget settings={settings} />
        </div>

        {/* Column 3: Weather & Spotify */}
        <div className="grid grid-rows-[1fr_130px] gap-4 h-full overflow-hidden">
          <WeatherWidget settings={settings} />
          <SpotifyWidget settings={settings} />
        </div>
      </main>

      {/* Subtle interaction feedback bar */}
      <footer className="fixed bottom-0 inset-x-0 h-10 bg-black/90 backdrop-blur-2xl border-t border-zinc-800/50 px-10 flex items-center justify-between pointer-events-auto z-40">
        <div className="flex items-center gap-3">
           <Lock className="w-3.5 h-3.5 text-zinc-500" />
           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Touch Screen Locked (Tap to Unlock)</span>
        </div>
        <div className="flex gap-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
            System Online
          </div>
          <span className="opacity-50">v6.1.2</span>
          <Maximize2 className="w-3 h-3" />
        </div>
      </footer>

      {/* Settings Overlay */}
      {isSettingsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]" 
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-[70] shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
            <SettingsPanel 
              settings={settings} 
              onUpdate={handleUpdateSettings} 
              onClose={() => setIsSettingsOpen(false)} 
            />
          </div>
        </>
      )}

      {/* Custom Styles for Scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
      </div>
    </div>
  );
}
