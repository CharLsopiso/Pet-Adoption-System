"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  TableHead,
} from "@/components/ui/table";

const HistoryModule = () => {
  const url = "http://localhost/pet-adoption-api/main.php";
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  //const [selectedEvent, setSelectedEvent] = useState(null);

  const getAdoptionHistory = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          operation: "getAdoptionHistory",
          json: "",
        },
      });

      if (response.status === 200 && response.data.success) {
        setHistory(response.data.success);
      } else {
        setHistory([]);
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    getAdoptionHistory();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-2 pt-3">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Adoption history</h2>
      </div>

      <table className="cust-table">
        <thead className="cust-thead">
          <tr>
            <th className="th-show">
              Pet name
            </th>
            <th className="th-hide">
              Image
            </th>
            <th className="th-hide">
              Breed
            </th>
            <th className="th-hide">
              Type
            </th>
            <th className="th-show">
              New owner fullname
            </th>
            <th className="th-hide">
              Email
            </th>
            <th className="th-hide">
              Contact number
            </th>
            <th className="th-hide">
              Adoption date
            </th>
            <th className="th-hide">
              Pickup date
            </th>
            <th className="th-show">
              Created at
            </th>
          </tr>
        </thead>
        <tbody className="cust-tbody">
          {history.length > 0 ? (
            history.map((list) => (
              <tr key={list.adoption_id}>
                <td className="td-show">{list.pet_name}</td>
                <td className="td-hide">
                  <Image
                    src={`${
                      list?.pet_image
                        ? `http://localhost/pet-adoption-api/upload/${list.pet_image}`
                        : ""
                    }`}
                    alt="Pet image"
                    className="rounded"
                    width={72}
                    height={72}
                  />
                </td>
                <td className="td-hide">
                  {list.breed_name}
                </td>
                <td className="td-hide">
                  {list.pet_type_name}
                </td>
                <td className="td-show">
                  {list.first_name} {list.last_name}
                </td>
                <td className="td-hide">{list.email}</td>
                <td className="td-hide">
                  {list.contact_number}
                </td>
                <td className="td-hide">
                  {list.adoption_date}
                </td>
                <td className="td-hide">
                  {list.pickup_date}
                </td>
                <td className="td-show">{list.created_at}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
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

export default HistoryModule;
