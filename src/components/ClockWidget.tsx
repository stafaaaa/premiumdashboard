import React from 'react';
import { format } from 'date-fns';
import { Clock as ClockIcon, Calendar } from 'lucide-react';
import { WidgetCard } from './WidgetCard.tsx';
import { TileDesignSettings } from '../types.ts';

interface ClockWidgetProps {
  settings: TileDesignSettings;
  time: Date;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ settings, time }) => {
  const isDark = settings.theme === 'dark';

  return (
    <WidgetCard title="Zeit & Datum" settings={settings} icon={<ClockIcon className="w-5 h-5" />}>
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <div className="flex flex-col items-center">
          <span className={`text-7xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-black'}`}>
            {format(time, 'HH:mm')}
          </span>
          <span className={`text-sm font-bold uppercase tracking-[0.3em] mt-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            {format(time, 'EEEE')}
          </span>
        </div>
        
        <div className={`mt-2 px-3 py-1.5 rounded-lg border flex items-center gap-2 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
          <Calendar className={isDark ? 'text-cyan-500' : 'text-cyan-600'} size={16} />
          <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-black'}`}>
            {format(time, 'dd. MM. yyyy')}
          </span>
        </div>
      </div>
    </WidgetCard>
  );
};
