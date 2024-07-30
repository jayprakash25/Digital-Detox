import dbConnection from "@/lib/db";
import { InterestModel, UserModel } from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession, User } from "next-auth";

export async function POST(request: Request) {
  await dbConnection();

  //   const session = await getServerSession(authOptions);
  //   const user: User = session?.user;

  //   if (!session || !session.user) {
  //     return Response.json(
  //       {
  //         success: false,
  //         message: "Not authenticated",
  //       },
  //       { status: 401 }
  //     );
  //   }

  //   const userId = user.id;
  const userId = "66a8465c82a973709d1d4e3e";
  const { name } = await request.json();
  try {
    let interest = await InterestModel.findOne({ name });

    if (!interest) {
      interest = new InterestModel({ name });
      await interest.save();
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { interests: interest._id } },
      { new: true }
    );

    console.log(updateUser);

    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "failed to save interests",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "updated interests",
        updateUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update interests", error);
    return Response.json(
      {
        success: false,
        message: "failed to update interests",
      },
      {
        status: 500,
      }
    );
  }
}
