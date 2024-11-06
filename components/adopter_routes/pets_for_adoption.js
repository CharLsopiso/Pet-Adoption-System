"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import Link from "next/link";

const PetsForAdoption = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [types, setTypes] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const getPets = async () => {
      try {
        let jsonData = {};

        if (selectedType && selectedType !== "all") {
          jsonData.petType = selectedType;
        }

        const formData = new FormData();
        formData.append("operation", "filterAvailablePets");
        formData.append("json", JSON.stringify(jsonData));

        const response = await axios.post(url, formData);
        setPets(
          response.status === 200 && response.data.success
            ? response.data.success
            : []
        );
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };

    getPets();
  }, [selectedType]);

  const handleTypeChangeForTable = (value) => {
    setSelectedType(value);
  };

  useEffect(() => {
    getPetTypes();
  }, []);

  const getSelectedTypeName = () => {
    if (selectedType === "all") return "All";
    const selectedTypeObj = types.find(
      (type) => type.pet_type_id === selectedType
    );
    return selectedTypeObj ? selectedTypeObj.pet_type_name : "Select a Type";
  };

  return (
    <>
      <div className="flex-1 space-y-6 p-10">
        <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Find Your Perfect Companion Here!</h2>
        <Select
          value={selectedType}
          onValueChange={(value) => handleTypeChangeForTable(value)}
          className="ms-"
        >
          <SelectTrigger className="w-[180px]">
            <span>{getSelectedTypeName()}</span> {/* Display type name */}
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {types.length > 0 ? (
              types.map((type) => (
                <SelectItem key={type.pet_type_id} value={type.pet_type_id}>
                  {type.pet_type_name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-options">No options available</SelectItem>
            )}
          </SelectContent>
        </Select>
        </div>
        <div className="flex flex-col items-center justify-center ">
          {loading ? (
          <div>Loading...</div>
        ) : pets.length === 0 ? (
            <p>No pets available for the selected type.</p>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
              {pets.map((pet) => (
                <div
                  key={pet.pet_id}
                  className="bg-white w-72 min-h-[10rem] shadow-md rounded-xl overflow-hidden flex flex-col p-3 gap-3 transition duration-300 hover:scale-105"
                >
                  <img
                    src={`${
                      pet?.pet_image
                        ? `http://localhost/pet-adoption-api/upload/${pet.pet_image}`
                        : ""
                    }`}
                    alt="Pet image"
                    className="object-contain h-48 w-full"
                  />
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-xl xl:text-2xl 2xl:text-3xl text-slate-900">
                        {pet.pet_name}
                      </h3>
                      <p className="text-sm">
                        {pet.gender} {pet.breed_name} {pet.pet_type_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{pet.description}</p>
                    </div>
                      <Button asChild variant="aroma" className="w-full">
                        <Link href={`/pet/adoption/${pet.pet_id}`}>
                        <span>Show interest</span>
                        <HeartIcon className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PetsForAdoption;
