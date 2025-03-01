"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";



const Home = () => {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Simulate a short loading delay
      const timer = setTimeout(() => setLoading(false), 1000); //The setTimeout function simulates a small delay (1 second) before setting loading to false. 
      return () => clearTimeout(timer); // Cleanup
    }, []);


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
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 mt-20 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-8xl font-extrabold leading-tight text-center text-yellow-400 drop-shadow-lg">
            Dive into the world of <br className="hidden md:block" />
            <span className="text-purple-400">Anonymous Conversations</span>
          </h1>

          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Mystery Message - WHERE YOUR IDENTITY REMAINS A SECRET
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-xs"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="bg-yellow-400 border-yellow-400 font-bold">
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-2xl font-semibold">
                        {message.content}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <Button className="bg-purple-500 ml-20 mt-2" 
          onClick={() => router.push('/public-profile')}>Start Messaging</Button>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6 text-white">
        &copy; 2025 Mystery Message. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
