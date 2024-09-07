import dbConnection from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/models/User";
import { fetchVideoMetadataByInterest } from "@/lib/youtubeData";
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const MAX_VIDEOS = 20;
const VIDEOS_PER_INTEREST = 5;
const CACHE_TTL = 3600; // 1 hour in seconds

interface VideoMetadata {
  id: string | null | undefined;
  title: string | null | undefined;
  thumbnail: string | null | undefined;
  channelTitle: string | null | undefined;
  publishedTime: string | null | undefined;
}

interface FetchVideoMetadataResult {
  videos: VideoMetadata[];
  nextPageToken: string | null;
}

function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

async function getCachedOrFetchVideos(interests: { name: string }[], pageToken?: string): Promise<FetchVideoMetadataResult> {
  const cacheKey = `feed:${interests.map(i => i.name).join(',')}:${pageToken || 'initial'}`;
  
  const cachedVideos = await kv.get<FetchVideoMetadataResult>(cacheKey);
  if (cachedVideos) return cachedVideos;

  const videoPromises = interests.map(interest => 
    fetchVideoMetadataByInterest(interest.name, VIDEOS_PER_INTEREST, pageToken)
  );

  const videoResults = await Promise.allSettled(videoPromises);
  const fulfilledResults = videoResults.filter(isFulfilled);

  const allVideos = fulfilledResults.flatMap(result => result.value.videos);
  const nextPageToken = fulfilledResults.find(result => result.value.nextPageToken)?.value.nextPageToken || null;

  const uniqueVideos = Array.from(new Set(allVideos.map(v => v.id)))
    .map(id => allVideos.find(v => v.id === id))
    .filter((v): v is VideoMetadata => v !== undefined);

  const shuffledVideos = uniqueVideos
    .sort(() => 0.5 - Math.random())
    .slice(0, MAX_VIDEOS);

  const result = { videos: shuffledVideos, nextPageToken };

  await kv.set(cacheKey, JSON.stringify(result), { ex: CACHE_TTL });

  return result;
}

export async function GET(request: NextRequest) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get('pageToken') || undefined;

  try {
    const userWithInterests = await UserModel.findOne({ googleId: session.user.id }).populate("interests");

    if (!userWithInterests?.interests.length) {
      return NextResponse.json({ success: false, message: "User has no interests" }, { status: 404 });
    }

    const videos = await getCachedOrFetchVideos(userWithInterests.interests, pageToken);

    return NextResponse.json({ success: true, ...videos }, { status: 200 });
  } catch (error) {
    console.error('Error in curated feed route:', error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}