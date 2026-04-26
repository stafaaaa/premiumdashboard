import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, RefreshCw, X, Info } from 'lucide-react';
import { WidgetCard } from './WidgetCard.tsx';
import { TileDesignSettings } from '../types.ts';
import { format, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';
import ICAL from 'ical.js';

interface CalendarEvent {
  time: string;
  title: string;
  location: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
}

interface CalendarWidgetProps {
  settings: TileDesignSettings;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ settings }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<'agenda' | 'visual'>('agenda');
  const isDark = settings.theme === 'dark';

  const fetchCalendar = async () => {
    if (!settings.icalUrl) return;
    
    setIsLoading(true);
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(settings.icalUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.text();
      
      const jcalData = ICAL.parse(data);
      const comp = new ICAL.Component(jcalData);
      const vevents = comp.getAllSubcomponents('vevent');
      
      const parsedEvents: CalendarEvent[] = vevents.map(vevent => {
        const event = new ICAL.Event(vevent);
        return {
          title: event.summary,
          time: format(event.startDate.toJSDate(), 'HH:mm'),
          location: event.location || 'Kein Ort angegeben',
          description: event.description || 'Keine Beschreibung',
          category: 'Termin',
          startDate: event.startDate.toJSDate(),
          endDate: event.endDate.toJSDate()
        };
      })
      .filter(e => isSameDay(e.startDate, new Date())) // Nur heute
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

      setEvents(parsedEvents);
    } catch (err) {
      console.error('Calendar error:', err);
      // Fallback Demo Daten
      setEvents([
        { time: '09:00', title: 'Frühstück', location: 'Küche', description: 'Gemütliches Frühstück mit der Familie', category: 'Privat', startDate: new Date(), endDate: new Date() },
        { time: '13:30', title: 'Wocheneinkauf', location: 'Supermarkt', description: 'Wochenvorrat einkaufen', category: 'Haushalt', startDate: new Date(), endDate: new Date() },
        { time: '18:00', title: 'Yoga Kurs', location: 'Studio', description: 'Entspannung pur', category: 'Freizeit', startDate: new Date(), endDate: new Date() },
        { time: '20:15', title: 'Movie Night', location: 'Wohnzimmer', description: 'Netflix & Chill', category: 'Privat', startDate: new Date(), endDate: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [settings.icalUrl]);

  return (
    <WidgetCard 
      title="Kalender" 
      settings={settings} 
      icon={<CalendarIcon className="w-8 h-8" />}
      className="relative"
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView('agenda')}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${view === 'agenda' ? 'bg-cyan-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Agenda
            </button>
            <button 
              onClick={() => setView('visual')}
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${view === 'visual' ? 'bg-cyan-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Kalender
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-cyan-500">{format(new Date(), 'dd. MMMM', { locale: de })}</span>
            <button onClick={fetchCalendar} className={`p-1.5 rounded-lg hover:bg-zinc-500/10 transition-all ${isLoading ? 'animate-spin' : ''}`}>
              <RefreshCw size={14} className="text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {view === 'agenda' ? (
            <>
              {events.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <CalendarIcon size={48} />
                  <p className="font-black uppercase text-[10px] mt-4">Keine Termine heute</p>
                </div>
              )}
              
              {events.map((event, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedEvent(event)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:border-cyan-500/50' : 'bg-zinc-50 border-zinc-100 hover:border-cyan-500/30'}`}
                >
                  <div className="flex flex-col items-center justify-center min-w-[65px] border-r border-zinc-500/10 pr-4">
                    <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-black'}`}>{event.time}</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className={`text-sm font-black truncate group-hover:text-cyan-500 transition-colors ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{event.title}</h4>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase truncate">{event.location}</p>
                  </div>
                  <ChevronRight size={16} className="text-zinc-700 group-hover:text-cyan-500 transition-colors" />
                </button>
              ))}
            </>
          ) : (
            <div className="h-full rounded-2xl overflow-hidden border border-zinc-500/10 bg-white">
              <iframe 
                src={settings.calendarEmbedUrl}
                style={{ border: 0 }} 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no"
                className={isDark ? 'invert-0 hue-rotate-180 brightness-90 contrast-110' : ''}
                loading="lazy"
              />
            </div>
          )}
        </div>

        <button 
          onClick={() => window.open('https://calendar.google.com', '_blank')}
          className={`w-full py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:text-black'}`}
        >
          Google Calendar öffnen <ChevronRight size={14} />
        </button>
      </div>

      {/* Detail Overlay */}
      {selectedEvent && (
        <div className="absolute inset-0 z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className={`h-full w-full rounded-3xl border-2 shadow-2xl p-6 flex flex-col gap-6 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'}`}>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-[10px] font-black uppercase tracking-wider">
                {selectedEvent.category}
              </span>
              <button 
                onClick={() => setSelectedEvent(null)}
                className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-500' : 'hover:bg-zinc-100 text-zinc-400'}`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className={`text-2xl font-black leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {selectedEvent.title}
              </h2>
              <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
                <Clock size={16} />
                <span>{selectedEvent.time} Uhr</span>
                <span className="opacity-30">•</span>
                <span>{format(selectedEvent.startDate, 'dd. MMMM yyyy', { locale: de })}</span>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div className={`p-4 rounded-2xl flex items-start gap-3 ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'}`}>
                <MapPin size={18} className="text-zinc-500 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Ort</span>
                  <p className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{selectedEvent.location}</p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl flex items-start gap-3 ${isDark ? 'bg-zinc-900/50' : 'bg-zinc-50'}`}>
                <Info size={18} className="text-zinc-500 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Beschreibung</span>
                  <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{selectedEvent.description}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedEvent(null)}
              className={`w-full py-4 rounded-2xl bg-cyan-500 text-white font-black uppercase tracking-widest text-xs hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20`}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </WidgetCard>
  );
};
