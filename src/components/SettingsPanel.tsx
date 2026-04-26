import React from 'react';
import { X, Palette, Type, Globe, Link, ImageIcon as ImageIconLucide, Sun, Moon, Music, Calendar } from 'lucide-react';
import { TitleFontSize, TileDesignSettings, AppTheme } from '../types';

interface SettingsPanelProps {
  settings: TileDesignSettings;
  onUpdate: (settings: TileDesignSettings) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onClose }) => {
  const update = <T extends keyof TileDesignSettings>(key: T, value: TileDesignSettings[T]) => {
    onUpdate({ ...settings, [key]: value });
  };

  const isDark = settings.theme === 'dark';

  return (
    <div className={`fixed right-0 top-0 h-full w-[400px] border-l-4 z-50 shadow-2xl p-8 flex flex-col gap-10 overflow-y-auto ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-black flex items-center gap-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          <Palette className="w-8 h-8 text-cyan-500" /> Setup
        </h2>
        <button onClick={onClose} className={`p-4 rounded-3xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'}`}><X size={32} /></button>
      </div>

      <div className="space-y-10">
        <div className="space-y-4">
          <label className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><Sun size={16}/> Thema</label>
          <div className="grid grid-cols-2 gap-4">
            {(['dark', 'light'] as AppTheme[]).map((t) => (
              <button key={t} onClick={() => update('theme', t)} className={`py-4 rounded-2xl font-black ${settings.theme === t ? 'bg-cyan-500 text-white' : `${isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-400'}`}`}>{t.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><Type size={16}/> Schriftgröße</label>
          <div className="grid grid-cols-2 gap-2">
            {(['small', 'medium', 'large', 'xxl'] as TitleFontSize[]).map((size) => (
              <button key={size} onClick={() => update('fontSize', size)} className={`py-3 rounded-xl font-bold ${settings.fontSize === size ? 'bg-zinc-200 text-black' : `${isDark ? 'bg-zinc-800 text-zinc-600' : 'bg-zinc-50 text-zinc-400'}`}`}>{size.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><Globe size={16}/> Stadt</label>
          <input type="text" value={settings.city} onChange={(e) => update('city', e.target.value)} className={`w-full py-4 px-5 rounded-2xl border-2 text-xl font-bold ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><Calendar size={16}/> Google Calendar Embed URL</label>
          <textarea value={settings.calendarEmbedUrl} onChange={(e) => update('calendarEmbedUrl', e.target.value)} className={`w-full py-4 px-5 rounded-2xl border-2 text-xs font-mono h-24 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><Link size={16}/> iCal URL (Backup)</label>
          <input type="text" value={settings.icalUrl} onChange={(e) => update('icalUrl', e.target.value)} className={`w-full py-4 px-5 rounded-2xl border-2 text-xs font-mono ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><Music size={16}/> Spotify Embed URL</label>
          <input type="text" value={settings.spotifyUrl} onChange={(e) => update('spotifyUrl', e.target.value)} className={`w-full py-4 px-5 rounded-2xl border-2 text-xs font-mono ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-50 border-zinc-200 text-black'}`} />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3"><ImageIconLucide size={16}/> Bilder</label>
          <div className="flex flex-col gap-4">
            <input 
              type="file" 
              id="image-upload" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  const currentImages = settings.slideshowImages || [];
                  const newImages = [...currentImages];
                  Array.from(files).forEach((file: File) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        newImages.push(event.target.result as string);
                        update('slideshowImages', [...newImages]);
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }
              }}
            />
            <label 
              htmlFor="image-upload" 
              className={`w-full py-6 border-2 border-dashed rounded-2xl text-sm font-black uppercase text-center cursor-pointer transition-all ${isDark ? 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white' : 'border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-black'}`}
            >
              Bilder Hinzufügen
            </label>
            
            <div className="flex flex-wrap gap-2">
              {(settings.slideshowImages || []).map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => {
                      const updated = (settings.slideshowImages || []).filter((_, i) => i !== idx);
                      update('slideshowImages', updated);
                    }}
                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t py-6"><p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] text-center font-black">Fridge OS v9.0</p></div>
    </div>
  );
};
