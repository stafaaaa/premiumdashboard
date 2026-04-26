import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, ExternalLink } from 'lucide-react';
import { WidgetCard } from './WidgetCard.tsx';
import { TileDesignSettings } from '../types.ts';

interface SpotifyWidgetProps {
  settings: TileDesignSettings;
}

export const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({ settings }) => {
  const isDark = settings.theme === 'dark';
  
  const isConnected = settings.spotifyUrl && 
                      settings.spotifyUrl !== '' && 
                      settings.spotifyUrl !== 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM3M';

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let processed = url.trim();
    if (processed.includes('<iframe')) {
      const match = processed.match(/src="([^"]+)"/);
      processed = match ? match[1] : processed;
    }
    if (processed.includes('open.spotify.com/') && !processed.includes('/embed/')) {
      processed = processed.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    return processed;
  };

  const embedUrl = getEmbedUrl(settings.spotifyUrl);

  return (
    <WidgetCard title="Spotify" settings={settings} icon={<Music className="w-5 h-5" />}>
      <div className="h-full w-full flex flex-col gap-2">
        <div className="flex-grow rounded-2xl relative overflow-hidden bg-black/5">
          {isConnected && embedUrl ? (
            <div className="absolute inset-0 w-full h-full flex flex-col">
               <iframe
                title="Spotify Embed"
                style={{ border: 'none' }}
                src={`${embedUrl}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
              <div className="flex-grow flex items-center justify-center">
                <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/20">
                  <Music size={20} className="text-black" />
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 text-[#1DB954] opacity-80">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.215.353-.674.464-1.027.249-2.846-1.737-6.429-2.131-10.648-1.168-.403.092-.806-.16-.898-.564-.093-.404.159-.807.563-.9 4.629-1.059 8.583-.612 11.761 1.332.353.214.464.673.249 1.027zm1.468-3.261c-.27.441-.85.579-1.291.309-3.259-2.003-8.228-2.584-12.083-1.414-.496.151-1.018-.129-1.169-.625-.152-.495.128-1.017.624-1.168 4.415-1.34 9.897-.686 13.61 1.597.441.27.579.85.309 1.291v.01zm.126-3.415C15.027 8.16 8.324 7.938 4.448 9.116c-.611.186-1.258-.168-1.444-.778-.186-.611.168-1.259.778-1.445 4.453-1.352 11.854-1.096 16.516 1.671.55.327.734 1.034.407 1.584-.326.551-1.033.735-1.583.408v-.026z"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        <a 
          href="spotify:open" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`py-3 rounded-xl border font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:text-black'}`}
        >
          Spotify App Offnen <ExternalLink size={12} />
        </a>
      </div>
    </WidgetCard>
  );
};
