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
  const isDark = settings.theme === 'dark';

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
        ${isDark ? 'bg-zinc-800 border-zinc-700 shadow-2xl' : 'bg-white border-zinc-200 shadow-xl'} 
        border rounded-3xl overflow-hidden flex flex-col h-full group transition-colors duration-500
        ${className}
      `}
    >
      <div 
        className={`
          ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-50 border-zinc-100'} 
          px-4 py-3 
          flex items-center justify-between 
          border-b
        `}
      >
        <div className="flex items-center gap-3">
          {icon && <div className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'} group-hover:scale-110 transition-transform`}>{icon}</div>}
          <h2 
            className={`
              ${getFontSize()} 
              ${getFontWeight()} 
              ${isDark ? 'text-white' : 'text-zinc-900'} 
              uppercase tracking-tighter
            `}
          >
            {title}
          </h2>
        </div>
        
        <div className="flex gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
};
