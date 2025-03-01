import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { NextResponse } from 'next/server'


export async function GET() {
   try {
    await dbConnect()
    const users = await UserModel.find({}, "username email");

    return NextResponse.json({
        success: true,
        users,
    })
   } catch (error) {
    return NextResponse.json({
        success: false,
        message: "Failed to fetch users!", error,
      }, { status: 500 });
    }
}