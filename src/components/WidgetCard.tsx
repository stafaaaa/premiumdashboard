import React from 'react';
import { motion } from 'motion/react';
import { TileDesignSettings } from '../types';

interface WidgetCardProps {
  title: string;
  settings: TileDesignSettings;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ title, settings, children, icon, className = "" }) => {
  const THEME_STYLES = {
    dark: { card: 'bg-zinc-900/80 border-zinc-800 shadow-2xl', header: 'bg-zinc-900/50 border-zinc-800', text: 'text-white', sub: 'text-zinc-400' },
    light: { card: 'bg-white/80 border-zinc-200 shadow-xl', header: 'bg-zinc-50 border-zinc-100', text: 'text-zinc-950', sub: 'text-zinc-500' },
    sunset: { card: 'bg-orange-950/40 border-orange-800/30 backdrop-blur-3xl shadow-2xl', header: 'bg-orange-900/40 border-orange-800/20', text: 'text-orange-50', sub: 'text-orange-300' },
    ocean: { card: 'bg-blue-950/40 border-blue-800/30 backdrop-blur-3xl shadow-2xl', header: 'bg-blue-900/40 border-blue-800/20', text: 'text-blue-50', sub: 'text-blue-300' },
    forest: { card: 'bg-emerald-950/40 border-emerald-800/30 backdrop-blur-3xl shadow-2xl', header: 'bg-emerald-900/40 border-emerald-800/20', text: 'text-emerald-50', sub: 'text-emerald-300' },
    midnight: { card: 'bg-indigo-950/40 border-indigo-800/30 backdrop-blur-3xl shadow-2xl', header: 'bg-indigo-900/40 border-indigo-800/20', text: 'text-indigo-50', sub: 'text-indigo-300' },
  };

  const style = THEME_STYLES[settings.theme] || THEME_STYLES.dark;

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-xl';
      case 'medium': return 'text-2xl';
      case 'large': return 'text-3xl md:text-4xl';
      case 'xxl': return 'text-4xl md:text-6xl';
      default: return 'text-3xl';
    }
  };

  const getFontWeight = () => {
    switch (settings.fontWeight) {
      case 'normal': return 'font-medium';
      case 'bold': return 'font-bold';
      case 'extra-bold': return 'font-black';
      default: return 'font-bold';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${style.card} 
        border rounded-3xl overflow-hidden flex flex-col h-full group transition-all duration-500
        ${className}
      `}
    >
      <div 
        className={`
          ${style.header} 
          px-4 py-3 
          flex items-center justify-between 
          border-b
        `}
      >
        <div className="flex items-center gap-3">
          {icon && <div className={`${style.sub} group-hover:scale-110 transition-transform`}>{icon}</div>}
          <h2 
            className={`
              ${getFontSize()} 
              ${getFontWeight()} 
              ${style.text} 
              uppercase tracking-tighter
            `}
          >
            {title}
          </h2>
        </div>
        
        <div className="flex gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${settings.theme === 'light' ? 'bg-zinc-200' : 'bg-white/10'}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${settings.theme === 'light' ? 'bg-zinc-200' : 'bg-white/10'}`} />
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};
