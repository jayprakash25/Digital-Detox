import dbConnection from "@/lib/db";
import { InterestModel, UserModel } from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

const MAX_INTERESTS = 3;

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

  const userId = user.id;

  try {
    const user = await UserModel.findOne({ googleId: userId }).populate(
      "interests"
    );

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    console.log(user.interests);

    return Response.json(
      {
        success: true,
        interests: user.interests,
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

  const userId = user.id;
  console.log(userId);

  const { interests, replaceExisting } = await request.json();

  if (
    !Array.isArray(interests) ||
    interests.length === 0 ||
    interests.length > MAX_INTERESTS
  ) {
    return Response.json(
      {
        success: false,
        message: `Please provide 1 to ${MAX_INTERESTS} interests.`,
      },
      { status: 400 }
    );
  }

  try {
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
      return Response.json(
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
    console.log(updateUser.interests);
    return Response.json(
      {
        success: true,
        message: "Updated interests",
        interests: updateUser.interests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update interests", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update interests",
      },
      { status: 500 }
    );
  }
}
