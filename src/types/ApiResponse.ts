// this file means jab bhi hum response bhejenge yeh guidelines ko follow krna chahiye response
// kis type se humara response dikhna chahiye wo hoga

import { Message } from '@/models/User';

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: string;
    messages?: Array<Message>   // dashboard mai hume sare msgs chahiye honge to uske lie optional
    users?: { username: string; email: string }[]; 
}  