'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";



const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>(); // mrko srf username chyye string trpe ka

   const [loading, setLoading] = useState(true);

    useEffect(() => {
         // Simulate a short loading delay
         const timer = setTimeout(() => setLoading(false), 1000); //The setTimeout function simulates a small delay (1 second) before setting loading to false. 
         return () => clearTimeout(timer); // Cleanup
       }, []);
 

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  // data mil jyegaa zod se
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      // username or code bhj denge
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code, // form bnega usme se
      });
      
      toast.success(response.data.message)
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error while signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      // toast({
      //   title: "Signup failed",
      //   description: axiosError.response?.data.message,
      //   variant: "destructive",
      // });
      toast.error(axiosError.response?.data.message)
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
    <div className="flex justify-center items-center min-h-screen bg-[#150F26]">
      <div className="w-ful max-w-md p-8 space-x-8 bg-[#150F26] rounded-lg text-white border-2 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="bg-purple-600 hover:bg-[#150F26]" type="submit">Submit</Button>
      </form>
    </Form>

      </div>
    </div>
  );
};

export default VerifyAccount;
