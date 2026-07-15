'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

// Facade pattern: only the thumbnail <img> loads at first paint, the actual
// iframe (and YouTube's own JS) is deferred until the reader clicks play —
// keeps embedded videos from hurting LCP/CWV on article pages.
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export default function YouTubeEmbed({ url, caption }: { url: string; caption?: string }) {
  const [playing, setPlaying] = useState(false);
  const id = extractYouTubeId(url);
  if (!id) return null;

  return (
    <figure className="my-6 not-prose">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            title={caption || 'YouTube video'}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full cursor-pointer"
            aria-label={caption || 'Play video'}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt={caption || 'YouTube video thumbnail'}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <span className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 group-hover:scale-110 transition-transform">
                <Play size={26} className="text-white ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && <figcaption className="text-xs text-muted text-center mt-2">{caption}</figcaption>}
    </figure>
  );
}
