import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  
  const nocookieMatch = url.match(/youtube-nocookie\.com\/embed\/([^?#&]+)/);
  if (nocookieMatch) return nocookieMatch[1];
  
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const constructYouTubeEmbedUrl = (url: string) => {
  const videoId = getYouTubeId(url);
  if (!videoId) return url;
  
  // Parse existing params if any (like si)
  const urlObj = new URL(url.includes('?') ? url : (url.includes('embed') ? url : `https://youtube.com/watch?v=${videoId}`));
  const si = urlObj.searchParams.get('si');

  const baseUrl = "https://www.youtube-nocookie.com/embed/";
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    autoplay: "1",
  });
  if (si) params.set('si', si);
  
  return `${baseUrl}${videoId}?${params.toString()}`;
};

export const getYouTubeThumbnail = (url: string) => {
  const videoId = getYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "";
};
