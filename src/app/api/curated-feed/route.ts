import dbConnection from "@/lib/db";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/models/User";


export async function GET(request: Request){
    await dbConnection();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    const userOfInterests = await UserModel.findById(user?.id).populate("interests");

    const interests = userOfInterests?.interests;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    return Response.json(
        {
            success: true,
            interests
        },
        {
            status: 200
        }
    );
}