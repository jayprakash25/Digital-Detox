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

async function getCachedOrFetchVideos(interests: { name: string }[]) {
  const cacheKey = `feed:${interests.map(i => i.name).join(',')}`;
  
  let cachedVideos = await kv.get(cacheKey);
  if (cachedVideos) {
    return cachedVideos;
  }

  const videoPromises = interests.map((interest) =>
    fetchVideoMetadataByInterest(interest.name, VIDEOS_PER_INTEREST)
  );

  const videoArrays = await Promise.allSettled(videoPromises);

  const allVideos = videoArrays
    .filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled')
    .flatMap(result => result.value);

  const uniqueVideos = allVideos.filter((video, index, self) =>
    index === self.findIndex((t) => t.id === video.id)
  );

  const shuffledVideos = uniqueVideos.sort(() => 0.5 - Math.random()).slice(0, MAX_VIDEOS);

  await kv.set(cacheKey, JSON.stringify(shuffledVideos), { ex: CACHE_TTL });

  return shuffledVideos;
}

export async function GET(request: NextRequest) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const user: User = session.user;

  try {
    const userWithInterests = await UserModel.findOne({googleId: user.id}).populate("interests");

    if (!userWithInterests || !userWithInterests.interests.length) {
      return NextResponse.json(
        { success: false, message: "User has no interests" },
        { status: 404 }
      );
    }

    const videos = await getCachedOrFetchVideos(userWithInterests.interests);

    return NextResponse.json({ success: true, videos }, { status: 200 });
  } catch (error) {
    console.error('Error in curated feed route:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}