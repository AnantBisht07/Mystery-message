import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";


// checking object/variables 
// this schema means jo username hai wo fulfill krna chhaiye usernameValidation mai jo criteria dia hai ukso
const UsernameQuerySchema = z.object({
    username: usernameValidation
}) 

// get method for koi bhi username bheje to check krke bta du valid hai ya nhi
export async function GET(request: Request) {
    // check req type  --> nextjs14 < allowed this code 
    // if(request.method !== 'GET') {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: 'This method is not allowed!'
    //         },
    //         { status: 405})
    // }
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url) // poori url aajyegi frontend wali
        const queryParam = {
            username: searchParams.get('username')  // extracting username from search params
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        
        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || [] // mrko srf username ke hi errors chahiye(poore zod ke nahi)
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
                },
                { status: 400})
        }

        const { username } = result.data  //contains only valid and sanitized data. Use result.data when accessing parsed values after successful validation.

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})

        if(existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken!'
                }, { status: 400})
        }

        return Response.json(
            {
                success: true,
                message: 'Username is avaliable!'
            }, { status: 200 }
        )
    } catch (error) {
        console.error('Error while checking your username!', error)
        return Response.json(
            {

                success: false,
                message: 'Error while checking the username!'
            },
            { status: 500 }
        )
    }
}