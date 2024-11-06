"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const Dashboard = () => {
  const [data, setData] = useState({ types: [], pets: [], approval: [], users: [] });
  const url = "http://localhost/pet-adoption-api/main.php";

    const getCardsData = async () => {
      try {
        const response = await axios.get(url, {
          params: {
            operation: "getCardsData",
            json: "",
          },
        });

        if (response.status !== 200) {
          alert("Status Error: " + response.statusText);
          return;
        }

        if (response.data.success) {
          setData(response.data.success);
        } else {
          setData([]);
          alert("No records found");
        }
      } catch (error) {
        alert(error);
      }
    };

    useEffect(() => {
      getCardsData();
    }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-2 pt-3">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Pet Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.types}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.pets}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-lime-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Pet request approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.approval}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.users}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
