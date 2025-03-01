import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";



export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()

        const decodeUsername = decodeURIComponent(username)// yeh proper url form mai decode krke deta hai, like space '_' ko %20 bna deta hai
        const user = await UserModel.findOne({username: decodeUsername})

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: 'User not found!'
                },
                { status: 404 }
            )
        }

        // Check if the code is correct and not expired
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: 'Account verified successfully!'
                },
                { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            // code expired
            return Response.json(
                {
                    success: false,
                    message: 'Verification code expired, Please signup again for new code!'
                },
                { status: 400 }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: 'Incorrect verification code!'
                },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Error while verifying user!', error)
        return Response.json(
            {
                success: false,
                message: 'Error while verifying user!'
            },
            { status: 500 }
        )
    }
}