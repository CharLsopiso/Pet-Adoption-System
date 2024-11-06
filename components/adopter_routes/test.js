"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Validation schema
const FormSchema = z.object({
  livingSituation: z.string().min(1, "This is required"),
  petExp: z.string().min(1, "This is required"),
  otherPets: z.string().min(1, "This is required"),
});

const PetsModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [pets, setPets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const getPets = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          operation: "getPets",
          json: "",
        },
      });

      if (response.status === 200 && response.data.success) {
        setPets(response.data.success);
      } else {
        setPets([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleAdoptPet = (pet) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
  };

  const handleConfirmAdopt = () => {
    setIsModalOpen(false);
    setIsAdoptModalOpen(true);
  };

  const handleCloseAdoptModal = () => {
    setIsAdoptModalOpen(false);
  };

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      livingSituation: "",
      petExp: "",
      otherPets: "",
    },
  });

  const { handleSubmit, control, reset, formState } = methods;
  const { errors } = formState;


  const checkData = async () => {
    const data = localStorage.getItem("user");
    if (data) {
      const parsedData = JSON.parse(data);
      setCurrentUser(parsedData);
    }
  };

  useEffect(() => {
    getPets();
    checkData();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("operation", "adoptionRequest");
    formData.append(
      "json",
      JSON.stringify({
        petId: selectedPet.pet_id,
        adopterId: currentUser.adopter_id,
        livingSituation: data.livingSituation,
        petExp: data.petExp,
        otherPets: data.otherPets,
      })
    );

    try {
      const response = await axios.post(url, formData);
      console.log(response);
      if (response.data.success) {
        alert("Adoption request is successful");
        setIsAdoptModalOpen(false);
        getPets();
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-12">
      {pets.length > 0 ? (
        pets.map((pet, index) => (
          <div
            key={index}
            className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-slate-800 shadow-md"
          >
            <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl">
              {pet?.pet_image ? (
                <Image
                  src={`http://localhost/pet-adoption-api/upload/${pet.pet_image}`}
                  alt={pet.pet_name}
                  fill
                  className="object-scale-down"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  No Image
                </div>
              )}
            </div>

            <div className="p-6">
              <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                {pet.pet_name}
              </h5>
              <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                {pet.description}
              </p>
            </div>

            <div className="p-6 pt-0">
              <div className="items-center">
                <Button
                  onClick={() => handleAdoptPet(pet)}
                  className="w-full mb-3 bg-pink-400 shadow-lg shadow-pink-400/40 hover:bg-pink-300 drop-shadow-sm"
                >
                  <span>Show interest</span>
                  <HeartIcon className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No pets available.</div>
      )}

      {/* First Modal */}
      {isModalOpen && selectedPet && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="event-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-3xl leading-6 font-medium text-slate-800 text-center">
                {selectedPet.pet_name}
              </h3>
              <div className="mt-2 px-7 py-3">
                <div className="relative mx-auto h-40 overflow-hidden rounded-xl my-4">
                  {selectedPet.pet_image ? (
                    <Image
                      src={`http://localhost/pet-adoption-api/upload/${selectedPet.pet_image}`}
                      alt={selectedPet.pet_name}
                      fill
                      className="object-scale-down rounded-xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                  )}
                </div>
                <p className="border-b-2 border-slate-100 p-2">
                  <span className="text-zinc-400 mr-2">Type:</span>
                  {selectedPet.pet_type_name}
                </p>
                <p className="border-b-2 border-slate-100 p-2">
                  <span className="text-zinc-400 mr-2">Gender:</span>
                  {selectedPet.gender}
                </p>
                <p className="border-b-2 border-slate-100 p-2">
                  <span className="text-zinc-400 mr-2">Age:</span>
                  {selectedPet.age}
                </p>
                <p className="border-b-2 border-slate-100 p-2">
                  <span className="text-zinc-400 mr-2">About me:</span>
                  {selectedPet.description}
                </p>
              </div>
              <div className="flex mt-4 space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full drop-shadow-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-pink-400 hover:bg-pink-300 text-white drop-shadow-md"
                  onClick={handleConfirmAdopt}
                >
                  Adopt pet
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdoptModalOpen && selectedPet && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-2xl font-bold text-center mb-4">Confirm Adoption</h3>
            <p className="mb-4">Please fill out this form to continue your adoption</p>
            <div className="mt-2 px-7 py-3">
              <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
                <FormField
                      control={control}
                      name="livingSituation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Living situation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                      control={control}
                      name="petExp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pet experience</FormLabel>
                          <FormControl>
                            <Input {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <FormField
                      control={control}
                      name="otherPets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other pets</FormLabel>
                          <FormControl>
                            <Input {...field}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <div className="flex mt-4 space-x-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      onClick={handleCloseAdoptModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-pink-400 text-white hover:bg-pink-300"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsModule;
