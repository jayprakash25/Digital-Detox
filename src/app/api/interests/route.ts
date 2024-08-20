import dbConnection from "@/lib/db";
import { InterestModel, UserModel } from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const MAX_INTERESTS = 3;
const CACHE_TTL = 3600

async function getUserInterests(userId: string){
  const cacheKey = `user:${userId}:interests`;

  let cachedInterests = await kv.get(cacheKey);

  if(cachedInterests){
    return cachedInterests;
  }

  await dbConnection();
  const user = await UserModel.findOne({ googleId: userId }).populate("interests");

  if(!user){
    return null;
  }

  const interests = user.interests;
  await kv.set(cacheKey, JSON.stringify(interests), { ex: CACHE_TTL });

  return interests;
}

export async function GET(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    console.log("Not authenticated");
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId: string = user?.id ?? '';

  try {
   const interests = await getUserInterests(userId);

    if(!interests){
      return Response.json(
        {
          success: false,
          message: "Failed to get interests",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        interests: interests,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "Failed to get interests",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User | undefined = session?.user;

  if (!session || !user) {
    console.log("Not authenticated");
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user.id;
  const { interests, replaceExisting } = await request.json();

  if (
    !Array.isArray(interests) ||
    interests.length === 0 ||
    interests.length > MAX_INTERESTS
  ) {
    return NextResponse.json(
      {
        success: false,
        message: `Please provide 1 to ${MAX_INTERESTS} interests.`,
      },
      { status: 400 }
    );
  }

  try {
    await dbConnection();
    const interestIds = [];
    for (const interestName of interests) {
      let interest = await InterestModel.findOne({ name: interestName });
      if (!interest) {
        interest = new InterestModel({ name: interestName });
        await interest.save();
      }
      interestIds.push(interest._id);
    }

    let updateOperation;
    if (replaceExisting) {
      updateOperation = { $set: { interests: interestIds } };
    } else {
      updateOperation = { $addToSet: { interests: { $each: interestIds } } };
    }

    const updateUser = await UserModel.findOneAndUpdate(
      { googleId: userId },
      updateOperation,
      { new: true }
    ).populate("interests");

    if (!updateUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update interests",
        },
        { status: 404 }
      );
    }

    // Ensure we don't exceed MAX_INTERESTS
    if (updateUser.interests.length > MAX_INTERESTS) {
      updateUser.interests = updateUser.interests.slice(-MAX_INTERESTS);
      await updateUser.save();
    }

    // Update cache
    const cacheKey = `user:${userId}:interests`;
    await kv.set(cacheKey, JSON.stringify(updateUser.interests), { ex: CACHE_TTL });

    return NextResponse.json(
      {
        success: true,
        message: "Updated interests",
        interests: updateUser.interests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update interests", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update interests",
      },
      { status: 500 }
    );
  }
}