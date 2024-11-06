"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const FeaturedPets = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const getPets = async () => {
      try {
        const response = await axios.get(url, {
          params: { operation: "filterAvailablePets", json: "" },
        });
        console.log(response);
        setPets(
          response.status === 200 && response.data.success
            ? response.data.success
            : []
        );
      } catch (e) {
        console.error(e);
      }
    };
    getPets();
  }, []);

  return (
    <>
      {pets.map((pet) => (
        <div
          key={pet.pet_id}
          className="w-screen h-[60vh] flex flex-col items-center justify-around p-4 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
        >
          {/* IMAGE CONTAINER */}
          {pet.pet_image && (
            <div className="relative flex-1 w-full transition-all duration-500">
              <Image
                src={`${
                  pet?.pet_image
                    ? `http://localhost/pet-adoption-api/upload/${pet.pet_image}`
                    : ""
                }`}
                alt="Pet image"
                fill
                className="object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
          )}
          {/* TEXT CONTAINER */}
          <div className=" flex-1 flex flex-col items-center justify-center text-center gap-8">
            <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">
              {pet.pet_name}
            </h1>
            <span className="text-xl text-muted-foreground">{pet.gender} {pet.breed_name} {pet.pet_type_name}</span>
            <div className="items-center">
              <Button asChild variant="aroma">
                <Link href={`/pet/adoption/${pet.pet_id}`}>
                <span>Show interest</span>
                <HeartIcon className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FeaturedPets;
