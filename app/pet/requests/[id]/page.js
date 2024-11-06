"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const PetAdoption = () => {
  const { id } = useParams();
  const router = useRouter();
  const url = "http://localhost/pet-adoption-api/main.php";
  const [requestedPet, setRequestedPet] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user data from localStorage
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

  // Fetch requested pet info based on the request ID
  useEffect(() => {
    if (!id) return;
    const selectedPetInfo = async () => {
      try {
        const formData = new FormData();
        formData.append("operation", "getRequestedPet");
        formData.append(
          "json",
          JSON.stringify({
            requestId: id,
          })
        );

        const response = await axios.post(url, formData);
        console.log(response);

        if (response.status !== 200) {
          alert("Status Error: " + response.statusText);
          return;
        }

        if (response.data.success) {
          setRequestedPet(response.data.success);
        } else {
          setRequestedPet({});
          alert("No records found");
        }
      } catch (error) {
        alert(error);
      }
    };
    selectedPetInfo();
  }, [id]);

  const phaseMapping = {
    Review: 1,
    Interview: 2,
    Adoption_completion: 3,
    Cancelled: 4,
  };

  const phaseLabels = [
    { name: 'Request', key: requestedPet.request_status, completedKey: requestedPet.review_completed_at },
    { name: 'Interview', key: requestedPet.interview_status, completedKey: requestedPet.interview_scheduled_at },
    { name: 'Adoption completion', key: requestedPet.pickup_date, completedKey: requestedPet.pickup_date },
    { name: 'Cancelled', key: null, completedKey: null },
  ];

  const phaseIndex = phaseMapping[requestedPet.current_phase] || 1;

  return (
    <>
      <div className="flex justify-center py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-[80%]">
          {/* IMAGE CONTAINER */}
          <div className="col-span-1">
            <div className="flex justify-center p-6">
              <div className="h-72 w-72">
                <img
                  src={`${
                    requestedPet?.pet_image
                      ? `http://localhost/pet-adoption-api/upload/${requestedPet.pet_image}`
                      : ""
                  }`}
                  alt="Selected pet image"
                  className="object-cover md:object-scale-down w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col px-3 bg-white rounded-lg shadow-md">
              <div className="space-y-8 w-full">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">{requestedPet.pet_name} adoption Process</h2>
                  <div className="relative">
                    <div className="flex flex-col relative z-10">
                      {/* Request Approval Phase */}
                      <div className="flex items-start relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center z-10 relative ${
                              phaseIndex >= 1 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            {phaseIndex >= 1 ? "✓" : ""}
                          </div>
                          {phaseIndex >= 1 && (
                            <div className={`w-1 h-12 ${phaseIndex >= 1 ? "bg-green-500" : "bg-gray-300"}`}></div>
                          )}
                        </div>
                        <div className="ml-6">
                          <p className="font-medium">{phaseLabels[0].name}</p>
                          <p className="text-sm text-gray-500">
                            Status: {requestedPet.request_status || "Under Review"}
                          </p>
                          {requestedPet.review_completed_at && (
                            <p className="text-xs text-gray-400">Completed at: {requestedPet.review_completed_at}</p>
                          )}
                        </div>
                      </div>

                      {/* Interview Phase */}
                      <div className="flex items-start relative">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center z-10 relative ${
                              phaseIndex >= 2 ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            {phaseIndex >= 2 ? "✓" : ""}
                          </div>
                          {phaseIndex >= 2 && (
                            <div className={`w-1 h-12 ${phaseIndex >= 2 ? "bg-green-500" : "bg-gray-300"}`}></div>
                          )}
                        </div>
                        <div className="ml-6">
                          <p className="font-medium">{phaseLabels[1].name}</p>
                          <p className="text-sm text-gray-500">
                            Status: {requestedPet.interview_status || "Pending"}
                          </p>
                          {requestedPet.interview_scheduled_at && (
                            <p className="text-xs text-gray-400">Scheduled at: {requestedPet.interview_scheduled_at}</p>
                          )}
                        </div>
                      </div>

                      {/* Adoption Finalized Phase */}
                      {requestedPet.pickup_date && (
                        <div className="flex items-start relative">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center z-10 relative ${
                                phaseIndex >= 3 ? "bg-green-500" : "bg-gray-300"
                              }`}
                            >
                              {phaseIndex >= 3 ? "✓" : ""}
                            </div>
                          </div>
                          <div className="ml-6">
                            <p className="font-medium">{phaseLabels[2].name}</p>
                            <p className="text-sm text-gray-500">Pick up date at: {requestedPet.pickup_date}</p>
                          </div>
                        </div>
                      )}

                      {/* Cancelled Phase */}
                      {requestedPet.current_phase === "Cancelled" && (
                        <div className="flex items-start relative">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center z-10 relative bg-gray-300">
                              ✖️
                            </div>
                          </div>
                          <div className="ml-6">
                            <p className="font-medium">{phaseLabels[3].name}</p>
                            <p className="text-sm text-gray-500">Status: Cancelled</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* FORM CONTAINER */}
          <div className="col-span-1 p-6 flex flex-col gap-8">
            <h1 className="text-3xl font-bold xl:text-5xl text-lime-500">
              {requestedPet.pet_name}
            </h1>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Gender
              </p>
              <p className="text-2xl">{requestedPet.gender}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Breed
              </p>
              <p className="text-2xl">{requestedPet.breed_name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Type
              </p>
              <p className="text-2xl">{requestedPet.pet_type_name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Age
              </p>
              <p className="text-2xl">{requestedPet.age}</p>
            </div>
            <div className="flex flex-col gap-1 mb-2">
              <p className="text-sm font-semibold uppercase text-lime-500">
                Adoption fee
              </p>
              <p className="text-2xl">₱ {requestedPet.adoption_fee}</p>
            </div>

              {/* Navigate Back Button */}
              <div className="flex justify-end">
              <Button
                onClick={() => router.back()}
                variant="lime"
              >
                Go Back ?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetAdoption;
