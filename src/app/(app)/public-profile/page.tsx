"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { User, Mail } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";




const PublicProfile = () => {
  const [users, setUsers] = useState<{ username: string; email: string }[]>([]);

  const [username, setUsername] = useState(""); // Store recipient username
  const [message, setMessage] = useState(""); // Store message


  // const acceptMessages = searchParams.get("acceptMessages") === "true";

  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Simulate a short loading delay
      const timer = setTimeout(() => setLoading(false), 1000); //The setTimeout function simulates a small delay (1 second) before setting loading to false. 
      return () => clearTimeout(timer); // Cleanup
    }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get<ApiResponse>("/api/all-users");
        console.log("all users: ", response);
        if (response.data.users) { // Ensure users exist before setting state
          setUsers(response.data.users);
        } else {
          setUsers([]); // Fallback to empty array if no users are returned
        }
        toast.success(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to feth users!"
        );
      }
    };
    fetchAllUsers();
  }, []);

  const handleSendMessage = async () => {
    if (!username && !message) {
      toast.error("Please enter a username and a message!", {
      });
      return;
    }

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: message,
      });
      console.log("all users: ", response);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to send message!"
      );
    } finally {
      setUsername("");
      setMessage("");
    }
  };


  // Show loader while page is loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#150F26]">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  return (
   <>
  {/* Back Button */}
  <div className="mx-4 mt-40 md:mt-[120px]">
    <Link href="/dashboard">
      <Button className="text-white bg-red-500 px-4 py-2 text-lg rounded-lg">
        Back
      </Button>
    </Link>
  </div>

  {/* Page Title */}
  <div className="text-center px-4">
    <h1 className="font-bold text-3xl sm:text-5xl text-white">
      Public Profile Link
    </h1>
    <h4 className="text-gray-400 text-sm sm:text-lg">
      Send anonymous message to anyone
    </h4>
  </div>

  {/* Input Fields */}
  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mx-auto w-full sm:w-3/4 lg:w-1/2 px-4 mt-6 text-gray-200">
    <Input
      type="text"
      placeholder="Recipient's username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="h-12 text-base sm:text-lg p-2 rounded-md w-full"
    />

    <Input
      type="text"
      placeholder="Write your anonymous message here"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="h-12 text-base sm:text-lg p-2 rounded-md w-full"
    />
  </div>

  {/* Send Button */}
  <div className="text-center mt-8">
    <Button
      className="relative h-12 w-48 sm:w-56 text-yellow-400 font-bold text-base sm:text-lg bg-transparent border border-purple-400 rounded-lg transition-all duration-300 hover:bg-[#1b2541] hover:shadow-[0_0_15px_#facc15] hover:text-white focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 active:scale-95"
      onClick={handleSendMessage}
    >
      Send
      <span className="absolute inset-0 rounded-lg opacity-40 bg-purple-400 blur-lg transition-opacity duration-300 hover:opacity-80"></span>
    </Button>
  </div>

  {/* Display All Users */}
  <div className="mt-10 p-6 border border-purple-700 rounded-xl w-full max-w-3xl mx-auto bg-[#150F26] shadow-2xl shadow-purple-900 transition-all duration-500 hover:shadow-purple-600">
    {/* Title */}
    <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-gray-100 tracking-wider">
      🌟 All Users
    </h2>

    {users.length > 0 ? (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        {users.map((user, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-4 sm:p-5 rounded-xl bg-gradient-to-br from-purple-800 to-gray-900 shadow-lg border border-transparent hover:border-purple-500 transition-transform duration-300 hover:scale-105 hover:shadow-purple-500 w-full max-w-md mx-auto"
          >
            {/* User Info */}
            <div className="flex items-center space-x-4 w-full">
              <div className="bg-gray-700 p-3 rounded-full flex justify-center items-center">
                <User className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="w-full">
                <p className="text-lg font-semibold text-gray-200 text-center sm:text-left">
                  {user.username}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-2 w-full">
  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
  <span className="truncate overflow-hidden w-[150px] sm:w-[200px] md:w-[250px] lg:w-full">
    {user.email}
  </span>
</p>

              </div>
            </div>

            {/* Action Button */}
            <Button
              className="mt-4 px-4 sm:px-5 py-2 text-sm sm:text-lg font-bold text-black bg-yellow-400 rounded-lg shadow-md transition-all duration-300 hover:bg-yellow-500 hover:scale-105 hover:shadow-yellow-500"
              onClick={() => setUsername(user.username)}
            >
              Select User
            </Button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 text-center text-lg font-medium animate-pulse">
        🚀 No users found.
      </p>
    )}
  </div>
</>
  );
};

export default PublicProfile;
