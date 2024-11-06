"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const data = [
  {
    id: 1,
    title: "Welcome to Pet Adoption Shelter – Find Your Perfect Companion",
    image: "/images/L1.png",
  },
  {
    id: 2,
    title: "We believe that each animal deserves a loving home, and we are here to make that connection easier than ever.",
    image: "/images/Portrait_2.png",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1)),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:flex-row bg-[#f9f9f9]">

      <div className="flex-1 flex items-center justify-center flex-col gap-8 text-slate-900 font-bold">
        <h1 className="text-3xl text-left p-4 md:p-10 md:text-4xl xl:text-5xl">
          {data[currentSlide].title}
        </h1>
      </div>

      <div className="w-full flex-1 relative">
        <Image
          src={data[currentSlide].image}
          alt=""
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default HeroSection;