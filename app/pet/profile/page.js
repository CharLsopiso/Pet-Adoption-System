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

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  contactNum: z.string().min(1, "Contact number is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  username: z.string().min(1, "Username is required"),
});

const ProfileModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [adopterId, setAdopterId] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmittingBtn, setSubmittingBtn] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNum: "",
      email: "",
      address: "",
      username: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    const data = localStorage.getItem("user");

    const checkData = async () => {
      if (data) {
        const parsedData = JSON.parse(data);
        await adopterBasicInfo(parsedData.adopter_id);
        setAdopterId(parsedData.adopter_id);
      }
    };

    checkData();
  }, []);

  const adopterBasicInfo = async (adopterId) => {
    try {
      const requestData = new FormData();
      requestData.append("operation", "getAdopterBasicInfo");
      requestData.append("json", JSON.stringify({ adopterId: adopterId }));

      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);

      const adopterData =
        response.status === 200 && response.data.success
          ? response.data.success
          : [];
      setImagePreview(adopterData.avatar);

      reset({
        firstName: adopterData.first_name || "",
        lastName: adopterData.last_name || "",
        contactNum: adopterData.contact_number || "",
        email: adopterData.email || "",
        address: adopterData.address || "",
        username: adopterData.username || "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data) => {
    try {
      const jsonData = { ...data };

      const response = await axios.get(url, {
        params: { json: JSON.stringify(jsonData), operation: "" },
      });

      // Handle response if necessary
    } catch (error) {
      alert(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateAvatar = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
  
    try {
      setSubmittingBtn(true);
      const formData = new FormData();
      formData.append("operation", "updateAvatar");
      formData.append("json", JSON.stringify({
        adopterId: adopterId
      }));
      formData.append("image", selectedImage);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data.success) {
        setSubmittingBtn(false);
        alert("Avatar updated successfully!");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setSubmittingBtn(false);
      alert("Failed to update avatar.");
    }
  };

  return (
    <>
      <div className="flex justify-center py-6">
        {/* BOX CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-[75%]">
          {/* IMAGE CONTAINER */}
          <div className="col-span-1 flex justify-center">
            <div className="p-6 flex flex-col gap-6">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Avatar</h2>
              <div className="h-64 w-56 ">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="flex items-center justify-center h-full w-full border border-dashed border-gray-400 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                >
                  {imagePreview ? (
                    <img
                      src={selectedImage ? imagePreview : `http://localhost/pet-adoption-api/avatar/${imagePreview}`}
                      alt="Selected avatar"
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <span className="text-gray-500">Select Image</span>
                  )}
                </label>
              </div>
              <div className="flex justify-center">
                  <Button variant="lime" onClick={()=> updateAvatar()} disabled={isSubmittingBtn}>
                  {isSubmittingBtn ? "Submitting..." : "Update avatar"}
                  </Button>
              </div>
            </div>
          </div>
          {/* FORM CONTAINER */}
          <div className="col-span-1 p-6 flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Profile</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-8"
              >
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="contactNum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button variant="lime" className="mb-3" type="submit">
                    Update profile
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

export default ProfileModule;
