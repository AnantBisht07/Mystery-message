import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';


// next js mai direct ase hota hai kyuki already route hadnled hain file ke name se
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json()
        // Check if username is already taken by a verified user
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true // tbhi dena jb yeh true ho 
        })

        if(existingUserVerifiedByUsername){
            return new Response(JSON.stringify({
                success: false,
                message: 'Username is already taken, Please try different!'
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });            
        }


        // Check if email already exists
        const existingUserByEmail = await UserModel.findOne({
            email
        });
        // Generate verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedPassword = await bcrypt.hash(password, 10);

        if(existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return new Response(JSON.stringify({
                    success: false,
                    message: 'User already exists with this email!'
                }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            } else {
                // Update existing unverified user
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
            
        } else {
            // Create new user
            const expiryDate = new Date() // date ek obj h or obj ke piche let const kch bhi lga lo, wo change ho skta h kkyuki obj memory ke andr ek reference point h or uske andr values change hoti h
            expiryDate.setHours(expiryDate.getHours() + 1) // 1 hour 

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success){
            return new Response(JSON.stringify({
                success: false,
                message: emailResponse?.message || 'Failed to send verification email',
            }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        
        return new Response(JSON.stringify({
            success: true,
            message: 'User registered successfully!'
        }), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error while registering user', error)
        return new Response(JSON.stringify({
            success: false,
            message: 'Error while registering user'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}


// SIGNUP FLOW -->
// We search for an existing user in the database with the same username and isVerified: true.
// If a user with the same username already exists and is verified, we return an error:

// If the username is available, we move forward.
// If the username is already taken, we return a 400 error response.

// We check if there is any existing user with the same email.
// If a user is found, we handle two cases

// Case 1 --> If the email is already registered and verified, we return a 400 error response.The user exists and is verified()

// Case2 -->  We update the user's password and generate a new verification code.( The user exists but is NOT verified)
// We save the updated user data to the database.
// If the email is already verified, return an error.
// If the email exists but is not verified, update the existing record.

// We create a new user document and save it in MongoDB.
// We send an email to the user with the verifyCode to confirm their email.

// If everything works perfectly, we send a success response.
// The frontend receives this response and can show a success message to the user.