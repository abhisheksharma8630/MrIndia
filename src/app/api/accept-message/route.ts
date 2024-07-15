import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  const { isAcceptingMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: isAcceptingMessage,
      },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          status: false,
          message: "Failed to update user status to accept message status",
        },
        {
          status: 401,
        }
      );
    }

    return Response.json(
      {
        status: true,
        message: "Message status was successfully updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update user status to accept message status");
    return Response.json(
      {
        status: false,
        message: "Failed to update user status to accept message status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        status: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      { success: true, isAcceptingMessage: foundUser.isAcceptingMessage },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {success:false,message:"Error Occured while find User"},
      {status:500}
    )
  }
}
