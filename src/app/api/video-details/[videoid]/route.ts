import { fetchVideoDetails } from "@/lib/youtubeData";
import {  NextResponse } from "next/server";

export  async function GET(
  request: Request,
  { params }: { params: { videoid: string } }
) {
  const id = params.videoid;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid video id" },
      { status: 400 }
    );
  }

  try {
    const videoDetails = await fetchVideoDetails(id);
    if (videoDetails) {
      return NextResponse.json(
        { success: true, video: videoDetails },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching video details:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
