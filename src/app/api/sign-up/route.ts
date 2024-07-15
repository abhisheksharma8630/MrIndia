import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {

    const { username, email, password } = await request.json();
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exits!",
        },
        { status: 400 }
      );
    }

    const existingUserNotVerified = await UserModel.findOne({
      email,
    });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (existingUserNotVerified) {
        if(existingUserNotVerified.isVerified){
            return Response.json({
                success:false,
                message:"User with this email already exits"
            },{status:500})
        }else{
             existingUserNotVerified.password = hashPassword;
             existingUserNotVerified.verifyCode = verifyCode;
             existingUserNotVerified.verifyCodeExpiry = expiryDate;
             await existingUserNotVerified.save();
             
        }
    } else { 
      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(email,verifyCode,username);
    if(!emailResponse.success){
        return Response.json({
            success:false,
            message: emailResponse.message
        },{status:500})
    }

    return Response.json({
        success:true,
        message: "User Registerd Successfully. Please Verify your email !"
    },{status:201})


  } catch (error) {
    console.error("Error while registering the User", error);
    return Response.json(
      {
        success: false,
        message: "Error while registering",
      },
      {
        status: 500,
      }
    );
  }
}
