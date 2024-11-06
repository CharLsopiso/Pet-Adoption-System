"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  householdSize: z.string().min(1, "Household size name is required"),
  homeType: z.string().min(1, "Home type name is required"),
  salary: z.string().min(1, "Salary is required"),
  liveWith: z.string().min(1, "Who you live with is required"),
  availabilityToCare: z.string().min(1, "Description about availability to take care is required"),
  otherPets: z.string().min(1, "Description about your other pets is required"),
  petExperiences: z.string().min(1, "Description about your pet experiences is required"),
});

const BackgroundModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [adopterId, setAdopterId] = useState(null);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      householdSize: "",
      homeType: "",
      salary: "",
      liveWith: "",
      availabilityToCare: "",
      otherPets: "",
      petExperiences: "",
    },
  });

  const { reset, formState } = form;
  const { isSubmitting } = formState; 

  useEffect(() => {
    const data = localStorage.getItem("user");

    const checkData = async () => {
      if (data) {
        const parsedData = JSON.parse(data);
        setAdopterId(parsedData.adopter_id);
        await adopterProfile(parsedData.adopter_id);
      }
    };

    checkData();
  }, []);

  const adopterProfile = async (adopterId) => {
    try {
      const requestData = new FormData();
      requestData.append("operation", "getAdopterProfile");
      requestData.append("json", JSON.stringify({ adopterId: adopterId }));

      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const adopterBackground =
        response.status === 200 && response.data.success
          ? response.data.success
          : [];

      reset({
        householdSize: adopterBackground.household_size || "",
        homeType: adopterBackground.home_type || "",
        salary: adopterBackground.salary || "",
        liveWith: adopterBackground.live_with || "",
        availabilityToCare: adopterBackground.availability_to_care || "",
        otherPets: adopterBackground.other_pets || "",
        petExperiences: adopterBackground.pet_experiences || "",
      });

    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data) => {
    try {
      const jsonData = { ...data };
      jsonData.adopterId = adopterId;

      const requestData = new FormData();
      requestData.append("operation", "updateProfile");
      requestData.append("json", JSON.stringify(jsonData));

      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert(`Adopter profile is successfully updated`);
        adopterProfile(adopterId);
      } else {
        alert('Failed to submit');
      }

    } catch (error) {
      alert(error);
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
              Adopter background
            </h2>
            <p className="text-sm text-muted-foreground">
              This is how the adoption team will view your request when
              reviewing your application for adopting a pet..
            </p>
            <div className="md:border-2 md:border-slate-100"></div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="space-y-2">
                  <FormField
                    name="householdSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Household Size</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter house hold size"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="homeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home type</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter home type eg.Apartment"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your monthly salary"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="liveWith"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Household members</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter other persons living with you"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="availabilityToCare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability for Pet Care</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter availability to take care of pet"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="otherPets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other pets</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter other pets you have"
                            rows={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="petExperiences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet experiences</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter your experiences with other pets"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button variant="lime" className="mb-3" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Update background"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BackgroundModule;
