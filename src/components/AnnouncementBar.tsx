import React from 'react';
import { Wifi, Sparkles } from 'lucide-react';
import { SiteSettings } from '../types';

interface AnnouncementBarProps {
  settings: SiteSettings;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ settings }) => {
  if (!settings.announcementActive || !settings.announcementText) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-sm border-b border-red-400/20">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-4 h-4 text-red-200 animate-pulse shrink-0 hidden sm:inline" />
        <span>{settings.announcementText}</span>
        <div className="hidden md:inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
          <Wifi className="w-3 h-3 text-red-200" />
          <span>4G & 5G Voamarina</span>
        </div>
      </div>
    </div>
  );
};
