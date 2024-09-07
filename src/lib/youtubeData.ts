import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

function generateEnhancedQuery(interest: string): string {
  // Remove any special characters and trim whitespace
  const cleanInterest = interest.replace(/[^\w\s]/gi, '').trim();
  
  // Split the interest into words
  const words = cleanInterest.split(/\s+/);
  
  // Generate different variations of the query
  const variations = [
    `${cleanInterest} explained`,
    `${cleanInterest} in depth`,
    `${cleanInterest} tutorial`,
    `understanding ${cleanInterest}`,
    `${cleanInterest} for beginners`,
    `${cleanInterest} advanced topics`,
    `latest in ${cleanInterest}`,
    `${cleanInterest} trends`,
    `${cleanInterest} analysis`,
    `${cleanInterest} expert guide`
  ];

  // If the interest is multi-word, add some variations with quotes
  if (words.length > 1) {
    variations.push(`"${cleanInterest}"`);
    variations.push(`"${cleanInterest}" overview`);
  }

  // Add some general quality indicators
  const qualityIndicators = [
    'high quality',
    'in-depth',
    'comprehensive',
    'professional',
    'educational'
  ];

  // Combine everything into one query
  const enhancedQuery = [
    cleanInterest,
    ...variations.slice(0, 3), // Take first 3 variations
    qualityIndicators[Math.floor(Math.random() * qualityIndicators.length)] // Add a random quality indicator
  ].join(' OR ');

  return enhancedQuery;
}

export async function fetchVideoMetadataByInterest(interest: string, maxResults = 5, pageToken?: string) {
  try {
    const enhancedQuery = generateEnhancedQuery(interest);
    console.log(`Enhanced query for "${interest}": ${enhancedQuery}`);

    // calculate the date 10 months ago
    const tenMonthsago = new Date();
    tenMonthsago.setMonth(tenMonthsago.getMonth() - 10);
    
    const response = await youtube.search.list({
      part: ['snippet'],
      q: enhancedQuery,
      type: ['video'],
      maxResults: maxResults * 2,
      pageToken: pageToken,
      relevanceLanguage: 'en',
      safeSearch: 'moderate',
      videoDuration: 'medium',
      videoDefinition: 'high',
      order: 'relevance',
      videoEmbeddable: 'true',
      publishedAfter: tenMonthsago.toISOString()
    });

    
    if (!response.data.items) {
      console.log('No videos found for interest:', interest);
      return {videos: [], nextPageToken: null};
    }
    

    console.log(response.data.items);

    const filteredVideos = response.data.items
    .filter((item) => item.id?.videoId && item.snippet?.thumbnails?.medium)
    .map((item) => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
      channelTitle: item.snippet?.channelTitle,
      publishedTime: item.snippet?.publishedAt
    }));

  return { 
    videos: filteredVideos,
    nextPageToken: response.data.nextPageToken || null
  };
  } catch (error) {
    console.error('Error fetching video metadata by interest:', error);
    return {
      videos: [],
      nextPageToken: null
    };
  }
}

export async function fetchVideoDetails(videoId: string) {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'status'],
      id: [videoId]
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.log('No video details found for id:', videoId);
      return  { videos: [], nextPageToken: null };
    }

    const videoDetails = response.data.items[0];
    return {
      id: videoId,
      title: videoDetails.snippet?.title,
      description: videoDetails.snippet?.description,
      duration: videoDetails.contentDetails?.duration,
      embedUrl: `https://www.youtube.com/embed/${videoId}`
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}
export default youtube;