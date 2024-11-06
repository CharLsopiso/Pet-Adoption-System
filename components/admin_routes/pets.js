"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  PlusIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/solid";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petType: z.string().min(1, "Pet type is required"),
  breed: z.string().min(1, "Breed is required"),
  description: z.string().min(1, "Description is required"),
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  adoptionFee: z.string().min(1, "Adoption fee is required"),
  status: z.string().min(1, "Status is required"),
  image: z.any().optional(),
});

const PetsModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [types, setTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      petName: "",
      petType: "",
      breed: "",
      description: "",
      age: "",
      gender: "",
      adoptionFee: "",
      status: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { isSubmitting } = formState;

  useEffect(() => {
    getPetTypes();
    getPets();
  }, []);

  const getPets = async () => {
    try {
      const response = await axios.get(url, {
        params: { operation: "getPets", json: "" },
      });
      setPets(
        response.status === 200 && response.data.success
          ? response.data.success
          : []
      );
    } catch (e) {
      console.error(e);
    }
  };

  const getPetTypes = async () => {
    try {
      const response = await axios.get(url, {
        params: { operation: "getPetTypes", json: "" },
      });
      setTypes(
        response.status === 200 && response.data.success
          ? response.data.success
          : []
      );
    } catch (e) {
      console.error(e);
    }
  };

  const getTypeBreeds = async (typeId) => {
    try {
      const requestData = new FormData();
      requestData.append("operation", "getTypeBreeds");
      requestData.append("json", JSON.stringify({ pet_type_id: typeId }));

      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response);
      setBreeds(
        response.status === 200 && response.data.success
          ? response.data.success
          : []
      );
    } catch (e) {
      console.error(e);
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

  useEffect(() => {
    if (selectedTypeId) {
      getTypeBreeds(selectedTypeId);
    }
  }, [selectedTypeId]);

  const handleTypeChange = (typeId) => {
    setSelectedTypeId(typeId);
  };

  const handleAddPet = () => {
    reset();
    setImagePreview(null);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('operation', selectedEvent ? 'updatePet' : 'addPet');
    formData.append(
      'json',
      JSON.stringify({
        petId: selectedEvent ? selectedEvent.pet_id : undefined,
        name: data.petName,
        type: data.petType,
        breed: data.breed,
        description: data.description,
        age: data.age,
        gender: data.gender,
        adoptionFee: data.adoptionFee,
        status: data.status,
      })
    );

    if (selectedImage) {
      formData.append('image', selectedImage); 
    }

    try {
      const response = await axios.post(url, formData);

      console.log(response);

      if (response.data.success) {
        alert(`Pet ${selectedEvent ? 'updated' : 'added'} successfully`);
        setIsModalOpen(false);
        getPets();
      } else {
        alert('Failed to submit');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const renderAdoptionStatus = (status) => {
    if (status === 'Adopted') {
      return <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Adopted</span>;
    } else if (status === 'Pending') {
      return <span class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Pending</span>;
    } else {
      return <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Available</span>;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-2 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pets</h2>
        <Button onClick={handleAddPet} variant="lime">
          <PlusIcon className="w-6 h-6 me-2" />
          <span>Add pet</span>
        </Button>
      </div>

      <table className="cust-table">
        <thead className="cust-thead">
          <tr>
            <th className="th-show">Name</th>
            <th className="th-hide">Image</th>
            <th className="th-hide">Type</th>
            <th className="th-hide">Breed</th>
            <th className="th-show">Status</th>
            <th className="th-show">Created at</th>
            <th className="th-show">Actions</th>
          </tr>
        </thead>
        <tbody className="cust-tbody">
          {pets.length > 0 ? (
            pets.map((pet) => (
              <tr key={pet.pet_id}>
                <td className="td-show">{pet.pet_name}</td>
                <td className="td-hide">
                  <Image
                    src={`${
                      pet?.pet_image
                        ? `http://localhost/pet-adoption-api/upload/${pet.pet_image}`
                        : ""
                    }`}
                    alt="Pet image"
                    className="rounded"
                    width={72}
                    height={72}
                  />
                </td>
                <td className="td-hide">
                  {pet.pet_type_name}
                </td>
                <td className="td-hide">
                  {pet.breed_name}
                </td>
                <td className="td-show">{renderAdoptionStatus(pet.adoption_status)}</td>
                <td className="td-show">
                  {pet.created_at}
                </td>
                <td className="td-show">
                  <Button variant="ghost" className="mr-2">
                    <PencilSquareIcon className="h-5 w-5 text-emerald-500" />
                  </Button>
                  {/* <Button variant="ghost">
                    <ArchiveBoxIcon className="h-5 w-5 text-red-500" />
                  </Button> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-record">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-3xl max-h-[98%] overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Pet" : "Add Pet"}</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}
            >
                 <div className="flex-1 sidebar">
                 <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="col-span-1 md:border-r-2 md:border-gray-100">
                  <FormField
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <>
                            <input
                              type="file"
                              onChange={handleImageChange}
                              className="hidden"
                              id="imageUpload"
                            />
                            <div className="flex items-center justify-center">
                              <label
                                htmlFor="imageUpload"
                                className="flex items-center justify-center w-52 h-52 border border-dashed border-gray-400 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                              >
                                {imagePreview ? (
                                  <img
                                    src={imagePreview}
                                    alt="Selected"
                                    className="object-scale-down h-full w-full rounded"
                                  />
                                ) : (
                                  <span className="text-gray-500">
                                    Select Image
                                  </span>
                                )}
                              </label>
                            </div>
                          </>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-1 space-y-3 px-2">
                  <FormField
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pet name" {...field} />
                        </FormControl>
                        {formState.errors.petName && (
                          <FormMessage>
                            {formState.errors.petName.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="petType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              handleTypeChange(value);
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select pet type" />
                            </SelectTrigger>
                            <SelectContent>
                              {types.length > 0 ? (
                                types.map((type) => (
                                  <SelectItem
                                    key={type.pet_type_id}
                                    value={type.pet_type_id}
                                  >
                                    {type.pet_type_name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-options">
                                  No options available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {formState.errors.petType && (
                          <FormMessage>
                            {formState.errors.petType.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select breed" />
                            </SelectTrigger>
                            <SelectContent>
                              {breeds.length > 0 ? (
                                breeds.map((breed) => (
                                  <SelectItem
                                    key={breed.breed_id}
                                    value={breed.breed_id}
                                  >
                                    {breed.breed_name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-options" disabled>
                                  No options available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {formState.errors.breed && (
                          <FormMessage>
                            {formState.errors.breed.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter description"
                            rows={4}
                          />
                        </FormControl>
                        {formState.errors.description && (
                          <FormMessage>
                            {formState.errors.description.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter pet age"
                          />
                        </FormControl>
                        {formState.errors.age && (
                          <FormMessage>
                            {formState.errors.age.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {formState.errors.gender && (
                          <FormMessage>
                            {formState.errors.gender.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                    <FormField
                    name="adoptionFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adoption fee</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter adoption fee" {...field} />
                        </FormControl>
                        {formState.errors.adoptionFee && (
                          <FormMessage>
                            {formState.errors.adoptionFee.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">
                                Available
                              </SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Adopted">Adopted</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {formState.errors.status && (
                          <FormMessage>
                            {formState.errors.status.message}
                          </FormMessage>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
                 </div>
             

              {/* Buttons */}
              <div className="flex justify-end mt-8 space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : selectedEvent
                    ? "Save Changes"
                    : "Add Pet"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetsModule;
