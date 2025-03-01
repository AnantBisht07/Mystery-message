"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Message } from "@/models/User";

// props that the MessageCard component will receive.
type MessageCardProps = {
  message: Message; // type msg object, contain details
  onMessageDelete: (messageId: string) => void; //Function that takes a message ID and deletes it
};

// we are destructuring the props inside the function parameter itself.
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDelete = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast(response.data.message);
    onMessageDelete(message?._id as string); //informs the parent component that this specific message should be removed from the UI.
  };

  return (
    <div>
      <Card className="bg-[#34255c] text-gray-200 transition duration-200 hover:shadow-[0_0_20px_5px_rgba(59,130,246,0.6)] rounded-2xl w-[340px] md:w-[270px] md:h-[320px] flex flex-col">
        <CardHeader className="p-4">
          <CardTitle>Anonymous message</CardTitle>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-[#6547B0] hover:bg-[#4f398a]">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button>Subscribe</Button>
          <CardDescription>Subscribe to know name</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-800">
          {/* <p>Card Content</p> */}
          <p className="text-2xl font-bold text-yellow-400">{message.content}</p>
        </CardContent>
        <CardFooter>{/* <p>Card Footer</p> */}</CardFooter>
      </Card>
    </div>
  );
};

export default MessageCard;
