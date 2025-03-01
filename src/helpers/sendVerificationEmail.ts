// import {resend} from '@/lib/resend';
// import VerificationEmail from '../../emails/VerificationEmail';
// import { ApiResponse } from '@/types/ApiResponse';


// export async function sendVerificationEmail(
//     email: string,
//     username: string,
//     verifyCode: string
// ): Promise<ApiResponse>{
//     try {
//         const { data, error } = await resend.emails.send({
//             from: 'onboarding@resend.dev',
//             to: email,
//             subject: 'Mystery message | Verification code',
//             react: VerificationEmail({ username, otp: verifyCode }),
//           });

//     if (error) {
//         console.log('Resend API Error:', error);
//         return { success: false, message: `Email sending failed: ${error.message}` };
//     }
//         return { success: true, message: 'Verification email sent successfully!'}
//     } catch (error) {
//         console.log('Error sending verification email!', error);
//         return { success: false, message: 'Failed to send verification email'} // promise hai islie return dena hi hoga
//     }
// }
// // return type promise, yeh function --> api response ko return krega as a promise, it means wo chize jo declare ki hai (api response) mai wo honi hi honi chahiye


import nodemailer from 'nodemailer';
import React from 'react';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        if (!email || !verifyCode) {
            throw new Error('Invalid email or verification code');
        }

        // ✅ Dynamically import 'react-dom/server' inside function
        const ReactDOMServer = await import('react-dom/server');

        // ✅ Dynamically import the component (avoids Next.js import error)
        const { default: VerificationEmail } = await import('@/emails/VerificationEmail');

        // ✅ Render email content as HTML (use React.createElement instead of calling the component)
        const emailHtml = ReactDOMServer.renderToStaticMarkup(
            React.createElement(VerificationEmail, { username, otp: verifyCode })
        );

        // ✅ Setup Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        // ✅ Send email
        const info = await transporter.sendMail({
            from: `"Mystery Message" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Mystery Message | Verification Code',
            html: emailHtml,
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, message: 'Verification email sent successfully!' };
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        return { success: false, message: 'Failed to send verification email' };
    }
}
