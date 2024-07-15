import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import  EmailTemplate from "../../emails/emailTemplate";

export async function sendVerificationEmail(
    email:string,
    otp:string,
    username:string,   
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'MrIndia Verification Code',
            react: VerificationEmail({username,otp}),
        });

        return {success:true,message:"Send Verification Email Successfully"}
        
    } catch (error) {
        console.log("Error sending while Verification Email",error);
        return {success:false,message:"Failed to Send Verification Email"}
    }
}