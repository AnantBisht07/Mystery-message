// msg de denge pr check knge logged in ho nahi ho 

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { User } from 'next-auth'
import mongoose from 'mongoose'

export async function GET() {
    await dbConnect()

    const session = await getServerSession(authOptions)
    console.log("Session:", session);

    const user: User = session?.user
    console.log("User from session:", user);

    if(!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated'
            },
            { status: 401 }
        )
    }

    if (!user._id) {
        return Response.json(
            { success: false, message: "User ID is missing from session!" },
            { status: 400 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id) // string mai tha to ab objectid mai krdia convert kyuki aggregation pipeline m objectid se hi work hoga
    try {
        const user = await UserModel.aggregate([
            { $match: {_id: userId } }, // Step 1: Match the specific user by their ID and filter it by id.
            { $unwind: '$messages' }, // Step 2: Unwind the 'messages' array. Expands the messages array into separate documents (one document per message).
            { $sort: {'messages.createdAt': -1 }},  // Step 3: Sort messages in descending order based on 'createdAt', (newest first)
            { $group: {_id: '$_id', messages: {$push: '$messages'} }}, // Step 4: Group back into a single document per user, collecting sorted messages, Reconstructs the messages array after sorting, so the final result has a sorted messages array for each user.
        ])
        if(!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found!'
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages // aggregation pipeline se arry return milta hai 
            },
            { status: 200 }
        )
    } catch (error) {
        console.log('Failed to update user status to accept messages!', error)
        return Response.json(
            {
                success: false,
                message: 'Something get wrong while fetching messages!'
            },
            { status: 500 }
        )
    }

}