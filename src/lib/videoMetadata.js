const axios = require('axios');

/**
 * Extract video ID from YouTube URL
 */
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract video ID from Twitch URL
 */
function extractTwitchId(url) {
  const patterns = [
    /twitch\.tv\/videos\/(\d+)/,
    /twitch\.tv\/[^\/]+\/v\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Fetch YouTube video metadata using oembed (no API key required)
 */
async function fetchYouTubeMetadata(videoId) {
  try {
    // Use YouTube oEmbed API (no auth required)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await axios.get(oembedUrl);

    if (response.data) {
      return {
        title: response.data.title,
        thumbnail: response.data.thumbnail_url,
        // oEmbed doesn't provide publish date or duration, use placeholder
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: null,
      };
    }
  } catch (error) {
    console.error('Failed to fetch YouTube metadata:', error.message);
    throw new Error('Failed to fetch video metadata from YouTube');
  }
}

/**
 * Fetch Twitch video metadata using oembed (no API key required)
 */
async function fetchTwitchMetadata(videoId) {
  try {
    // Use Twitch oEmbed API (no auth required)
    const oembedUrl = `https://api.twitch.tv/v5/oembed?url=https://www.twitch.tv/videos/${videoId}`;
    const response = await axios.get(oembedUrl);

    if (response.data) {
      return {
        title: response.data.title,
        thumbnail: response.data.thumbnail_url,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: null,
      };
    }
  } catch (error) {
    console.error('Failed to fetch Twitch metadata:', error.message);
    throw new Error('Failed to fetch video metadata from Twitch');
  }
}

/**
 * Main function to fetch video metadata from URL
 */
async function fetchVideoMetadata(url) {
  // Try YouTube first
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return await fetchYouTubeMetadata(youtubeId);
  }

  // Try Twitch
  const twitchId = extractTwitchId(url);
  if (twitchId) {
    return await fetchTwitchMetadata(twitchId);
  }

  throw new Error('Unsupported video URL. Please use YouTube or Twitch links.');
}

module.exports = { fetchVideoMetadata };
