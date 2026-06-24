const BASE = 'https://www.googleapis.com/youtube/v3/search';

const QUERIES = [
  'crypto investing 2025',
  'bitcoin analysis interview',
  'ethereum DeFi explained',
];

export interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
    description: string;
  };
}

interface FetchVideosOptions {
  limit?: number;
  query?: string;
}

export async function fetchVideos({ limit = 6, query }: FetchVideosOptions = {}): Promise<VideoItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const searchQuery = query || QUERIES[Math.floor(Math.random() * QUERIES.length)];

  const params = new URLSearchParams({
    part: 'snippet',
    q: searchQuery,
    maxResults: String(limit),
    order: 'date',
    type: 'video',
    videoDuration: 'medium',
    key: apiKey,
  });

  try {
    const res = await fetch(`${BASE}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).filter((v: VideoItem) => v.id?.videoId);
  } catch {
    return [];
  }
}
