export type TitleFontSize = 'small' | 'medium' | 'large' | 'xxl';
export type TitleFontWeight = 'normal' | 'bold' | 'extra-bold';
export type AppTheme = 'dark' | 'light' | 'sunset' | 'ocean' | 'forest' | 'midnight';

export interface TileDesignSettings {
  fontSize: TitleFontSize;
  fontWeight: TitleFontWeight;
  theme: AppTheme;
  city: string;
  calendarEmbedUrl: string;
  icalUrl: string;
  spotifyUrl: string;
  slideshowImages: string[];
  backgroundImage?: string;
}

export const DEFAULT_SETTINGS: TileDesignSettings = {
  fontSize: 'large',
  fontWeight: 'bold',
  theme: 'dark',
  city: 'Berlin',
  calendarEmbedUrl: 'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Europe%2FBerlin&showPrint=0&src=bW9zZ2FiNjlAZ21haWwuY29t&src=ZmFtaWx5MTc1NjE3ODYwMjk1MzM3ODE3NzRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=YmVlNmJkNTBmZWQ2OTk3ZDdhNGI5YWQ1YTI2ZTI3NGZhZmU4NDk5YzI2ODVkYTBmOGRkMTNhYmZiMThiZjE1OUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ODQ3MGI1NmY0ZjRlYmJiMjZlNjllOTBjMzZiZTU1NjNlZWJiNjM5OTM1ZDUxNzQ5YTJkZDg2N2UxNTlkMDg5MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OWM5ZnNpNm9ubjZtbHBvZTNpN2Y3Ymc5cGdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23039be5&color=%233f51b5&color=%237986cb&color=%23795548&color=%23f4511e',
  icalUrl: 'https://calendar.google.com/calendar/ical/mosgab69%40gmail.com/public/basic.ics',
  spotifyUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM3M',
  backgroundImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80",
  slideshowImages: [
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&fit=crop",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&fit=crop",
    "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?w=1200&fit=crop"
  ]
};
