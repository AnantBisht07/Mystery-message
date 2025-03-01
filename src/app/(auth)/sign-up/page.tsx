"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Simulate a short loading delay
      const timer = setTimeout(() => setLoading(false), 1000); //The setTimeout function simulates a small delay (1 second) before setting loading to false. 
      return () => clearTimeout(timer); // Cleanup
    }, []);

  // jab username set krunga tb ek req fire ho backend mai, but mai nahi chahta har ek word ke bad req jaye to uske lie we do debouncing from react-usehooks-ts
  // to ab is variable ke though chiz check hongi
  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  // zod implementation for react-forms
  // zod resolver needs schema and we can define the tpe of this schema (optional)
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // jb jb debounceUsername ki value change hogi humare backend api mai checkusername wala jo hai usko hit krke check krega
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        //loader
        setIsCheckingUsername(true);
        setUsernameMessage(""); // todo why we add this?
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          ); // nextjs mai port/domain already pre added hota hai..
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>; // defining the type for axios error, as apiresponse humne define kia tha
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error while checking username"
          ); //?? only checks null or undefined
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  // hume data milta hai iske andr react-form ke submithandler ke through
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      console.log("Signup data:", data);
      toast.success(response.data.message);
      // redirect on signup
      // yeh ek dynamic data hai isko lene k lie hum ek folder bnynge [] bracket se
      console.log("Redirecting to:", `/verify/${data.username}`);
      router.push(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error while signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>; 
      toast.error(axiosError.response?.data.message);
      setIsSubmitting(false);
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
    
    <div className="flex justify-center items-center min-h-screen bg-[#150F26] text-white">
      <div className="w-ful max-w-md p-8 space-x-8 border-2 border-[#28213d] rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {" "}
            {/*  by default hota hai yeh onSubmit handle submit ke andr  */}
            {/* field is usually an object provided by react-hook-form's useForm() hook. It typically contains properties like name, value, onBlur, onChange, etc. */}
            {/* handling value using React Hook Form. */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {/* jb tk username check ho rha hai tb tk mai loader chla du / */}
                  { isCheckingUsername && <Loader2 className='animate-spin' />}
                  <p className={`text-sm ${usernameMessage === "Username is avaliable!" ? 'text-green-500' : 'text-red-500' }`}>{usernameMessage}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* idhr onChange ki zrurat nahi h kyuki default handle hojata hai, upr username mai hcnaged h islie kia udhr  */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*  isSubmitting - false hai tb disbaled  */}
            <Button className='w-full' type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-3">
          <p className="text-gray-400 text-xs">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
