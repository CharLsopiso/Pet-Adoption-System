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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PetTypesModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const FormSchema = z.object({
    petType: z.string().min(1, "Specie is required"),
  });

  const methods = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      petType: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { isSubmitting } = formState;

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("operation", selectedEvent ? "updateType" : "addType");
    formData.append(
      "json",
      JSON.stringify({
        petTypeId: selectedEvent ? selectedEvent.pet_type_id : undefined,
        type: data.petType,
      })
    );

    try {
      const response = await axios.post(url, formData);
      if (response.data.success) {
        alert(`Specie ${selectedEvent ? "updated" : "added"} successfully`);
        setIsModalOpen(false);
        getTypes();
      } else {
        alert("Failed to submit");
      }
    } catch (error) {
      alert("Error: " + error.message);
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

      if (response.status === 200 && response.data.success) {
        setTypes(response.data.success);
      } else {
        setTypes([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleAddPetType = () => {
    reset({ petType: "" });
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditType = (type) => {
    reset({ petType: type.pet_type_name });
    setSelectedEvent(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getTypes();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-2 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Specie</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddPetType} variant="lime">
            <PlusIcon className="w-6 h-6 me-2" />
            <span>Add specie</span>
          </Button>
        </div>
      </div>

      <div class="container">
      <table className="cust-table">
        <thead className="cust-thead">
          <tr>
            <th className="th-show">
              Specie
            </th>
            <th className="th-show">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="cust-tbody">
          {types.length > 0 ? (
            types.map((type) => (
              <tr key={type.pet_type_id}>
                <td className="td-show">{type.pet_type_name}</td>
                <td className="td-show">
                  <Button
                    variant="ghost"
                    onClick={() => handleEditType(type)}
                    className="mr-2"
                  >
                    <PencilSquareIcon className="h-5 w-5 text-emerald-500" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
                className="no-record"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

    
     

      {/* Dialog for Add/Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Pet Specie" : "Add Pet Specie"}
            </DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="petType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specie</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pet specie" {...field} />
                    </FormControl>
                    {formState.errors.petType && (
                      <FormMessage>
                        {formState.errors.petType.message}
                      </FormMessage>
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
                  {isSubmitting
                    ? "Submitting..."
                    : selectedEvent
                    ? "Save Changes"
                    : "Add Specie"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetTypesModule;
