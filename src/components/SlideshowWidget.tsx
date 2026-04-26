import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { WidgetCard } from './WidgetCard.tsx';
import { TileDesignSettings } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';

interface SlideshowWidgetProps {
  settings: TileDesignSettings;
}

const IMAGES = [
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&fit=crop",
  "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&fit=crop",
  "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=1200&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&fit=crop"
];

export const SlideshowWidget: React.FC<SlideshowWidgetProps> = ({ settings }) => {
  const images = (settings.slideshowImages && settings.slideshowImages.length > 0) ? settings.slideshowImages : [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&fit=crop",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&fit=crop"
  ];
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, images.length]);

  return (
    <WidgetCard title="Fotos" settings={settings} icon={<ImageIcon className="w-6 h-6" />}>
      <div className="relative h-full w-full rounded-2xl overflow-hidden bg-black group">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-900/20"
          >
            {/* Blurred background for premium feel when using contain */}
            <img
              src={images[index]}
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-110"
              referrerPolicy="no-referrer"
            />
            <motion.img
              src={images[index]}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10 w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
          <div className="space-y-0.5">
            <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">Erinnerungen</span>
            {/* Show title if available, otherwise generic */}
            <h4 className="text-base font-bold text-white uppercase tracking-wider">
              {images[index].startsWith('data:') ? 'Eigene Fotos' : 'Family Trip 2025'}
            </h4>
          </div>
        </div>

        {/* Controls Overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button 
            onClick={() => setIndex((prev) => (prev + 1) % images.length)}
            className="p-2 bg-black/50 text-white rounded-full hover:bg-black/80 backdrop-blur-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Indicators */}
        <div className="absolute top-4 right-4 flex gap-1">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-0.5 transition-all rounded-full ${i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/20'}`} 
            />
          ))}
        </div>
      </div>
    </WidgetCard>
  );
};
