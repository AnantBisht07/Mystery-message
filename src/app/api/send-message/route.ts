import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
    await dbConnect()
    // koi bhi msg bhj skta hai 
    // zruri nahi ki logged in ho

    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found!'
                }, 
                { status: 404 }
            )
        }

        // is user accepting the message
        if(!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: 'User is not accepting the messages!'
                }, 
                { status: 403 }
            )
        }

        const newMessage = { content, createdAt: new Date()}
        user.messages.push(newMessage as Message) // if we dont give -->  as Message then it will raise an error, assign nhi kr skte, to hum isko assert krwa lenge kyuki model mai humne strictly type define kia hua hai ki hum isko srf message ka hi bhjnge 
        await user.save()

        return Response.json(
            {
                success: true,
                message: 'Message sent successfully!'
            }, 
            { status: 200 }
        )
    } catch (error) {
        console.log('An unexpected error!', error)
        return Response.json(
            {
                success: false,
                message: 'Something get wrong while fetching messages!'
            },
            { status: 500 }
        )
    }
}