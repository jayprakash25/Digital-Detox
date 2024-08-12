import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function fetchVideoMetadataByInterest(interest: string, maxResults = 5) {
  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      q: interest,
      type: ['video'],
      maxResults: maxResults * 2,
      relevanceLanguage: 'en',
      safeSearch: 'moderate',
      videoDuration: 'medium',
      videoDefinition: 'high',
      order: 'relevance',
      videoEmbeddable: 'true'
    });

    if (!response.data.items) {
      console.log('No videos found for interest:', interest);
      return [];
    }

    console.log(response.data.items);

    const filteredVideos = response.data.items
      .filter((item) => item.id?.videoId && item.snippet?.thumbnails?.medium)
      .map((item) => ({
        id: item.id?.videoId,
        title: item.snippet?.title,
        thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,        channelTitle: item.snippet?.channelTitle,
        publishedTime: item.snippet?.publishedAt
      }));

    return filteredVideos.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching video metadata by interest:', error);
    return [];
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
      return null;
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