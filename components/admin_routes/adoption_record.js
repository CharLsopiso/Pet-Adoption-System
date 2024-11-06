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

const AdoptionModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adoptionList, setAdoptionList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const getAdoptionList = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          operation: "getAdoptionHistory",
          json: "",
        },
      });

      if (response.status === 200 && response.data.success) {
        setAdoptionList(response.data.success);
      } else {
        setAdoptionList([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getAdoptionList();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-4">
        <Button
          //onClick={handleAddPetType}
          className="bg-lime-500 hover:bg-lime-400 text-white font-semibold rounded-md flex items-center space-x-2 drop-shadow-md"
        >
          <PlusIcon className="w-6 h-6" />
          <span>Add adoption record</span>
        </Button>
      </div>

      <table className="cust-table">
        <thead className="cust-thead">
          <tr>
            <th className="th-show">
              Pet name
            </th>
            <th className="th-show">
              New owner
            </th>
            <th className="th-show">
              adoption date
            </th>
            <th className="th-show">
              Pick up date
            </th>
            <th className="th-show">
              Created at
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {adoptionList.length > 0 ? (
            adoptionList.map((list) => (
              <tr key={list.pet_id}>
                <td className="td-show">{list.pet_name}</td>
                <td className="td-show">{list.first_name} {list.last_name}</td>
                <td className="td-show">
                  {list.adoption_date}
                </td>
                <td className="td-show">
                  {list.pickup_date}
                </td>
                <td className="td-show">
                  {list.created_at}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="no-record"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdoptionModule;
