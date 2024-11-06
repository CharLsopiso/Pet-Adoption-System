"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

const PetProfile = () => {
  const { id } = useParams();
  const router = useRouter();
  const url = "http://localhost/pet-adoption-api/main.php";
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPet, setSelectedPet] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const checkData = async () => {
      if (data) {
        const parsedData = JSON.parse(data);
        setCurrentUser(parsedData);
      }
    };
    checkData();
  }, []);

  useEffect(() => {
    const selectedPetInfo = async () => {
      try {
        const formData = new FormData();
        formData.append("operation", "petProfile");
        formData.append(
          "json",
          JSON.stringify({
            petId: id,
          })
        );

        const response = await axios.post(url, formData);
        console.log(response);

        if (response.status !== 200) {
          alert("Status Error: " + response.statusText);
          return;
        }

        if (response.data.success) {
          setSelectedPet(response.data.success);
        } else {
          setSelectedPet([]);
          alert("No records found");
        }
      } catch (error) {
        alert(error);
      }
    };
    selectedPetInfo();
  }, []);

  const confirmAdoption = async () => {
    try {
      if (!currentUser) {
        alert("Please login or signup to adopt.");
      }
      const formData = new FormData();
      formData.append("operation", "adoptionRequest");
      formData.append(
        "json",
        JSON.stringify({
          petId: id,
          adopterId: currentUser.adopter_id,
        })
      );
      const response = await axios.post(url, formData);

      console.log(response);
      if (response.data.success) {
        alert(`${response.data.success}`);
        router.push("/pet/adoption");
      } else {
        alert(response.data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex justify-center py-6">
        {/* BOX CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-[80%]">
          {/* IMAGE CONTAINER */}
          <div className="col-span-1">
            <div className="flex justify-center p-6">
              <div className="h-72 w-72">
                <img
                  src={`${
                    selectedPet?.pet_image
                      ? `http://localhost/pet-adoption-api/upload/${selectedPet.pet_image}`
                      : ""
                  }`}
                  alt="Selected pet image"
                  className="object-cover md:object-scale-down w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 px-6">
              <p className="text-lg font-semibold uppercase text-lime-500">
                About {selectedPet.pet_name}
              </p>
              <p className="text-xl">{selectedPet.description}</p>
            </div>
          </div>
          {/* FORM CONTAINER */}
          <div className="col-span-1 p-6 flex flex-col gap-8">
            <h1 className="text-3xl font-bold xl:text-5xl text-lime-500">
              {selectedPet.pet_name}
            </h1>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Gender
              </p>
              <p className="text-2xl">{selectedPet.gender}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Breed
              </p>
              <p className="text-2xl">{selectedPet.breed_name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Type
              </p>
              <p className="text-2xl">{selectedPet.pet_type_name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Age
              </p>
              <p className="text-2xl">{selectedPet.age}</p>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Adoption fee
              </p>
              <p className="text-2xl">₱ {selectedPet.adoption_fee}</p>
            </div>
            {selectedPet.adoption_status === "Available" ? (
              <>
                <div className="md:border-2 md:border-slate-100"></div>
                <div className="flex space-x-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/pet/adoption">Go back?</Link>
                  </Button>
                  <Button
                    onClick={() => confirmAdoption()}
                    variant="aroma"
                    className="w-full"
                  >
                    Adopt now
                  </Button>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PetProfile;
