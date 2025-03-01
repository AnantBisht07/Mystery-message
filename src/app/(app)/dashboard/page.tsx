"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Dashboard = () => {
  // Get user session
  const { data: session, status } = useSession();

  // Hook form with Zod validation
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const [baseUrl, setBaseUrl] = useState("");

  // console.log(session);


  // Construct user profile URL
  // const username = session?.user?.username;
  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  

useEffect(() => {
  setBaseUrl(`${window.location.protocol}//${window.location.host}`);
}, []);
const username = session?.user?.name; // Adjust according to your user object
const profileUrl = username ? `${baseUrl}/u/${username}` : "";


  // Fetch accept message state
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message setting!"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch all messages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      console.log("Fetched Messages:", response.data.messages);
      setMessages(response.data.messages || []);

      if (refresh) {
        toast.success("New Messages Loaded!");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch messages!"
      );
    } finally {
      setLoading(false);
    }
  }, []);


  // Fetch messages & message settings on mount
  useEffect(() => {
    if (status === "loading") return; // Ensure session is fully loaded
  if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [status,session, fetchMessages, fetchAcceptMessage]);

  // Handle switch toggle (Optimistic UI)
  const handleSwitchChange = async () => {
    const newAcceptMessages = !acceptMessages;
    setValue("acceptMessages", newAcceptMessages); // Optimistic update

    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: newAcceptMessages,
      });
      toast.success(response.data.message);
    } catch (error) {
      setValue("acceptMessages", !newAcceptMessages); // Revert on failure
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to update message setting!"
      );
    }
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied successfully");
  };

  // Handle loading & authentication states
  if (status === "loading") {
    return <p className="text-4xl text-center">Loading...</p>;
  }

  if (!session || !session.user) {
    return <div className="text-2xl text-center mt-32 text-white animate-pulse duration-600">Please Login to access this!</div>;
  }

  return (
    <div className="my-6 md:mx-8 lg:mx-auto p-8 rounded w-full max-w-6xl text-white mt-[100px]">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Left Section - Heading */}
        <div className="md:w-1/2">
          <h2 className="relative text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-100 tracking-wide px-8 py-6 rounded-xl bg-[#120A25] shadow-2xl overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15)_0%,_transparent_80%)] before:blur-md">
            {/* Glowing Username */}
            <h1 className="animate-pulse duration-400 text-transparent bg-clip-text text-7xl bg-gradient-to-r from-yellow-300 to-purple-400 drop-shadow-lg mb-1">
              Hi, {username}
            </h1>

            {/* <br /> */}

            {/* Mystery Message Branding */}
            <span className="text-pink-500 drop-shadow-xl tracking-widest uppercase">
              Welcome to Mystery Message!
            </span>

            <br />

            {/* Description with subtle fade-in animation */}
            <span className="text-gray-300 text-lg sm:text-xl md:text-2xl block mt-3 animate-fade-in">
              A fun and anonymous way to send secret messages!
            </span>

            <br />

            {/* Engaging Subtext */}
            <span className="text-lg sm:text-xl text-gray-400 italic block mt-3 opacity-80 transition-all duration-300 hover:opacity-100">
              Surprise your friends, send a hidden confession, or drop a playful
              mystery.
            </span>

            <br />

          </h2>
        </div>

       {/* Right Section - Image */}
<div className="relative w-full md:w-1/2 flex justify-center items-center overflow-hidden">
  
  {/* Glowing Border Wrapper */}
  <div className="relative w-full md:w-4/5 max-h-[500px] rounded-2xl overflow-hidden border-2 border-transparent bg[#150F26] p-1 shadow-lg shadow-purple-900 hover:shadow-purple-500 transition-all duration-500">
    
    {/* Gif */}
    <video
      src="/hii.gif"
      className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 hover:scale-110"
    />
    
    {/* Glowing Overlay Effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 rounded-2xl opacity-80 hover:opacity-100 transition-opacity duration-500"></div>
  </div>
</div>

      </div>

      {/* Copy Profile Link Section */}
      <div className="mb-8">
        <h2 className="textxl font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 bg-[#4F398A] mr-2"
          />
          <Button
            className="bg-[#6547B0] h-auto w-16 hover:bg-[#4f398a]"
            onClick={copyToClipboard}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="flex items-center space-x-2 ">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="bg-purple-600 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-purple-500 transition-colors duration-300"
        />

        <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>

      <Separator className="mt-2" />

      {/* Refresh Messages Button */}
      <Button
        className="mt-4 mb-4 bg-[#4F398A] hover:bg-[#4F398A]"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="space-x-4">
        <Link href="/public-profile">
          <Button className="bg-[#6547B0] hover:bg-[#4f398a]">
            Public Profile
          </Button>
        </Link>
        <Button className="mt-6 bg-[#6547B0] hover:bg-[#4f398a]">
          Subscribe
        </Button>
      </div>

      {/* Messages List */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-[24px] place-items-center md:place-items-start">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="font-semibold text-3xl text-center">
            No messages found to display...
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
