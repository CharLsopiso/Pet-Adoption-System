"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import axios from "axios";

const RequestsModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [adopterId, setAdopterId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const checkData = async () => {
      if (data) {
        const parsedData = JSON.parse(data);
        setAdopterId(parsedData.adopter_id);
        await adoptionRequests(parsedData.adopter_id);
        setLoading(false);
      }
      setLoading(false);
    };
    checkData();
  }, []);

  const adoptionRequests = async (adopterId) => {
    try {
      const requestData = new FormData();
      requestData.append("operation", "getAdopterRequests");
      requestData.append("json", JSON.stringify({ adopterId: adopterId }));

      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);

      response.status === 200 && response.data.success
        ? setRequests(response.data.success)
        : [];
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelRequest = async (request) => {
    try {
      const jsonData = {
        adopterId: request.adopter_id,
        requestId: request.adoption_request_id,
        petId: request.pet_id,
      };

      const requestData = new FormData();
      requestData.append("operation", "cancelAdoptionRequest");
      requestData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert(`${response.data.success}`);
        adoptionRequests(adopterId);
        setOpenDialog(null);
      } else {
        alert("Failed to cancel request");
      }
    } catch (error) {
      alert(error);
    }
  };

  const renderCurrentPhase = (status) => {
    if (status === "Adoption_completion") {
      return (
        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          Adoption Finalized
        </span>
      );
    } else if (status === "Cancelled") {
      return (
        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          Process Cancelled
        </span>
      );
    } else if (status === "Request") {
      return (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Application Submitted
        </span>
      );
    } else if (status === "Interview") {
      return (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Scheduled for interview
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          Unknown
        </span>
      );
    }
  };

  return (
    <>
      <div className="flex justify-center">
        {/* BOX CONTAINER */}
        <div className="w-full lg:w-[50%]">
          {/* FORM CONTAINER */}
          <div className="col-span-1 p-6 flex flex-col gap-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Pet requests
            </h2>

            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                This is where you can track your pet adoption requests
              </p>
              <p className="text-muted-foreground">
                Friendly Reminder: You can only submit up to 5 pet adoption
                requests per day.
              </p>
            </div>
            <div className="md:border-2 md:border-slate-100"></div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div>Loading...</div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.request_id}
                  className="grid p-6 bg-white rounded-lg shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={`${
                          request?.pet_image
                            ? `http://localhost/pet-adoption-api/upload/${request.pet_image}`
                            : ""
                        }`}
                        alt="Requested pet image"
                        className="object-cover"
                        width={72}
                        height={72}
                      />
                      <div className="flex flex-col gap-3 items-start">
                        <p className="text-sm font-medium leading-none">
                          {request.pet_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.gender} {request.breed_name}{" "}
                          {request.pet_type_name}
                        </p>
                        <p className="text-sm font-medium leading-none">
                          Adoption status:
                        </p>
                        {renderCurrentPhase(request.current_phase)}
                      </div>
                    </div>

                    <div>
                      {request.current_phase === "Request" &&
                      request.request_status !== "Rejected" ? (
                        <>
                          <Dialog
                            open={openDialog === request.request_id}
                            onOpenChange={() =>
                              setOpenDialog(request.request_id)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost">Cancel request</Button>
                            </DialogTrigger>

                            {/* Dialog Content */}
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Cancel Request</DialogTitle>
                              </DialogHeader>
                              <p>
                                Are you sure you want to cancel the adoption
                                request for <strong>{request.pet_name}</strong>?
                              </p>
                              <p className="text-red-600 font-semibold">
                                Please note: If you cancel your adoption request
                                three times, you will be banned from making
                                further requests for a period of 5 days. We urge
                                you to be cautious when considering a
                                cancellation.
                              </p>
                              <DialogFooter>
                                <Button
                                  variant="secondary"
                                  onClick={() => setOpenDialog(null)}
                                >
                                  Close
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleCancelRequest(request)}
                                >
                                  Cancel Request
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </>
                      ) : (
                        ""
                      )}
                      <Button asChild variant="lime" className="ml-2">
                        <Link
                          href={`/pet/requests/${request.adoption_request_id}`}
                        >
                          View details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestsModule;
