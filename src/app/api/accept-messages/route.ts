import { getServerSession } from 'next-auth'
import {authOptions} from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { User } from 'next-auth'

// we are retrieveing the user data from session
// Update isAcceptingMessages field for the logged-in user.
export async function POST(_request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated'
            },
            { status: 401 }
        )
    }

    const userId = user._id
    const { acceptMessages } = await _request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages},
            {new: true}
        )
        if(!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Failed to update user status to accept messages!'
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: 'Message accpetance status updated successfully!',
                updatedUser
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Failed to update user status to accept messages!', error)
        return Response.json(
            {
                success: false,
                message: 'Failed to update user status to accept messages!'
            },
            { status: 500 }
        )
    }
}

// db se query krkre status bhjdenge
// Retrieve the isAcceptingMessages status from the database.
export async function GET(request: Request) {
    dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated'
            },
            { status: 401 }
        )
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
    if(!foundUser) {
        return Response.json(
            {
                success: false,
                message: 'User not found!'
            },
            { status: 404 }
        )
    }

    return Response.json(
        {
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessage,
        },
        { status: 200 }
    )
    } catch (error) {
        console.log('Failed to update user status to accept messages!', error)
        return Response.json(
            {
                success: false,
                message: 'Error is getting message acceptsnce status!'
            },
            { status: 500 }
        )
    }
}