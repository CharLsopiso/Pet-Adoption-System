"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BreedModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);


  const FormSchema = z.object({
    petType: z.string().min(1, 'Pet type is required'),
    breedName: z.string().min(1, "Breed is required"),
  });


  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      petType: "", 
      breedName: "", 
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { isSubmitting } = formState; 


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("operation", selectedEvent ? "updateBreed" : "addBreed");
    formData.append(
      "json",
      JSON.stringify({
        id: selectedEvent ? selectedEvent.breed_id : undefined,
        type: data.petType,
        name: data.breedName,
      })
    );

    try {
      const response = await axios.post(url, formData);
      if (response.data.success) {
        alert(`Breed ${selectedEvent ? "updated" : "added"} successfully`);
        setIsModalOpen(false);
        getBreeds();
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const getBreeds = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          operation: "getBreeds",
          json: "",
        },
      });

      if (response.status === 200 && response.data.success) {
        setBreeds(response.data.success);
      } else {
        setBreeds([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const getTypes = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          operation: "getPetTypes",
          json: "",
        },
      });

      console.log(response);

      if (response.status === 200 && response.data.success) {
        setTypes(response.data.success);
      } else {
        setTypes([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleAddBreed= () => {
    reset({ petType: "", breedName: "" });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditBreed = (type) => {
    reset({ petType: type.pet_type_id, breedName: type.breed_name });
    setSelectedEvent(type);
    setIsModalOpen(true); 
  };

  useEffect(() => {
    getBreeds();
    getTypes();
  }, []);
  

  return (
    <div className="flex-1 space-y-4 p-2 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Breeds</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddBreed} variant="lime">
            <PlusIcon className="w-6 h-6 me-2" />
            <span>Add breed</span>
          </Button>
        </div>
      </div>

      <table className="cust-table">
    <thead className="cust-thead">
          <tr>
            <th className="th-hide">Type</th>
            <th className="th-show">Breed</th>
            <th className="th-show">Actions</th>
          </tr>
        </thead>
        <tbody className="cust-tbody">
          {breeds.length > 0 ? (
            breeds.map((breed) => (
              <tr key={breed.breed_id}>
                <td  className="td-hide">{breed.pet_type_name}</td>
                <td  className="td-show">{breed.breed_name}</td>
                <td  className="td-show">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditBreed(breed)}
                    className="mr-2"
                  >
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
              <td colSpan="3" className="no-record">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Dialog for Add/Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Pet Breed" : "Add Pet Breed"}</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  <FormField
                    name="petType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet type</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {types.map((type) => (
                                <SelectItem key={type.pet_type_id} value={type.pet_type_id}>
                                  {type.pet_type_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {formState.errors.petType && (
                      <FormMessage>{formState.errors.petType.message}</FormMessage>
                    )}
                      </FormItem>
                    )}
                  />

              <FormField
                name="breedName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter breed name"
                        {...field} 
                      />
                    </FormControl>
                    {formState.errors.breedName && (
                      <FormMessage>{formState.errors.breedName.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
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
                  {isSubmitting ? "Submitting..." : selectedEvent ? "Save Changes" : "Add breed"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BreedModule;
