"use client";

import '../../../public/css/card.css';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  RectangleGroupIcon,
  ListBulletIcon,
  InboxIcon,
  ClockIcon,
  UsersIcon,
  ArrowLeftStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import PetTypesModule from '@/components/admin_routes/types';
import PetsModule from '@/components/admin_routes/pets';
import ApprovalModule from '@/components/admin_routes/approval';
import AdoptionModule from '@/components/admin_routes/adoption_record';
import UsersModule from '@/components/admin_routes/users';
import axios from "axios";

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { name: "Dashboard", icon: RectangleGroupIcon },
    { name: "Pet Type", icon: ListBulletIcon },
    { name: "Pets", icon: ListBulletIcon },
    { name: "Adoption Request", icon: InboxIcon },
    { name: "Adoption Records", icon: ClockIcon },
    { name: "Users", icon: UsersIcon },
    { name: "Logout", icon: ArrowLeftStartOnRectangleIcon },
  ];

  return (
    <aside className="w-64 bg-[#F0F8FF] p-6 space-y-6 border-r-2 border-slate-100">
      <div className="flex items-center mb-4">
        <Image
          src="/images/logo.png"
          height={56}
          width={56}
          alt="Pet Adoption logo"
          className="h-12 w-fit me-4"
        />
        <h1 className="text-xl font-bold">Pet Adoption</h1>
      </div>
      <nav>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                className="w-full flex items-center text-left py-2 px-4 rounded"
                onClick={() => setActiveItem(item.name)}
              >
                <item.icon
                  className={`h-8 w-8 p-2 rounded-md ${
                    activeItem === item.name
                      ? "bg-white bg-opacity-80 text-lime-500 drop-shadow-md"
                      : "bg-white bg-opacity-80 text-slate-800 drop-shadow-md"
                  }`}
                />
                <small
                  className={`ml-2 text-sm ${
                    activeItem === item.name ? "text-lime-500" : "text-slate-800"
                  }`}
                >
                  {item.name}
                </small>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const InfoCards = ({ data }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
     <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 shadow-lg text-white">
        <h2 class="text-xl font-semibold mb-2">Pet types</h2>
        <h5 class="text-gray-200 text-xl">{data.types}</h5>
      </div>

      <div class="bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg p-6 shadow-lg text-white">
        <h2 class="text-xl font-semibold mb-2">Pets</h2>
        <h5 class="text-gray-200 text-xl">{data.pets}</h5>
      </div>

      <div class="bg-gradient-to-r from-green-500 to-lime-500 rounded-lg p-6 shadow-lg text-white">
        <h2 class="text-xl font-semibold mb-2">Adoption approval</h2>
        <h5 class="text-gray-200 text-xl">{data.approval}</h5>
      </div>

      <div class="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg p-6 shadow-lg text-white">
        <h2 class="text-xl font-semibold mb-2">Users</h2>
        <h5 class="text-gray-200 text-xl">{data.users}</h5>
      </div>
    </div>
  );
};

const Testpage = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [data, setData] = useState({ types: [], pets: [], approval: [], users: [] });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const url = "http://localhost/pet-adoption-api/main.php";

  useEffect(() => {
    const data = localStorage.getItem("admin");

    const checkData = async () => {
      if (!data) {
        router.push("/admin");
      } else {
        const parsedData = JSON.parse(data);
        setCurrentUser(parsedData);
        await getCardsData(); 
        setLoading(false); 
      }
    };
    checkData();
  }, []);

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

  const handleLogOut = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin";
  };

  const renderActiveComponent = () => {
    switch (activeItem) {
      case "Pet Type":
        return <PetTypesModule/>;
      case "Pets":
        return <PetsModule/>;
      case "Adoption Request":
        return <ApprovalModule/>;
      case "Adoption Records":
        return <AdoptionModule/>;
      case "Users":
        return <UsersModule/>;
      case "Dashboard":
        return (
          <div>
            <InfoCards data={data}/>
          </div>
        );
      case "Logout":
        return handleLogOut();
      default:
        return (
          <h3 className="text-xl font-semibold">
            Welcome to Pet Adoption Manager
          </h3>
        );
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div> // Show loading message or spinner
      ) : currentUser ? (
        <div className="flex bg-[#F0F8FF] min-h-screen">
          <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
          <main className="flex-1 p-6 overflow-y-auto">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{activeItem}</h2>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center drop-shadow-md">
                  <UserIcon className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </header>

            {renderActiveComponent()}
          </main>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Testpage;
