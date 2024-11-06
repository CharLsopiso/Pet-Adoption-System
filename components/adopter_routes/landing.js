"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';
import {
  UserIcon,
} from "@heroicons/react/24/solid";
import PetsModule from "@/components/adopter_routes/pets";

const Navigation = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { name: "Home" },
    { name: "Pets" },
    { name: "Contact Us" },
    { name: "Logout" },
  ];

  // Check if user data exists in localStorage
  const userData = localStorage.getItem("user");

  return (
    <header className="bg-white drop-shadow-sm">
      <nav className="flex justify-between items-center w-full mx-auto px-4 py-1">
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            height={56}
            width={56}
            alt="Pet Adoption logo"
            className="h-12 w-fit me-4"
          />
          <h1 className="text-xl font-bold">Pet Adoption</h1>
        </div>
        <div className={`nav-links duration-500 md:static absolute bg-white md:min-h-fit min-h-[60vh] left-0 md:w-auto w-full flex items-center px-5`}>
          <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  className="w-full flex items-center py-2"
                  onClick={() => setActiveItem(item.name)}
                >
                  <p
                    className={`text-base ${activeItem === item.name ? "bg-lime-400 text-white px-3 py-2 rounded-full drop-shadow-md" : "text-slate-800 hover:bg-lime-300 hover:text-white px-3 py-2 rounded-full hover:drop-shadow-lg"}`}
                  >
                    {item.name}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-6">
          {userData ? (
            // Display user icon if user data exists
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center drop-shadow-md">
            <UserIcon className="h-6 w-6 text-gray-600" />
          </div>
          ) : (
            // Display Sign in button if no user data
            <button className="bg-lime-500 text-white px-5 py-2 rounded-lg hover:bg-lime-400 drop-shadow-sm">Sign in</button>
          )}
          {/* Add toggle menu functionality here if needed */}
        </div>
      </nav>
    </header>
  );
};

const Home = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const data = localStorage.getItem("user");

    const checkData = async () => {
      if (data) {
        const parsedData = JSON.parse(data);
        setCurrentUser(parsedData);
        setLoading(false);
      }
      setLoading(false);
    };
    checkData();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    router.push("/login"); 
  };

  const renderActiveComponent = () => {
    switch (activeItem) {
      case "Home":
        return <div>This is home page</div>;
      case "Pets":
        return <PetsModule/>;
      case "Logout":
        handleLogOut(); // Call the logout handler
        return null; // Prevents rendering any component after logging out
      default:
        return <h3 className="text-xl font-semibold">Welcome to Pet Adoption App</h3>;
    }
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : currentUser ? (
        <div className="flex bg-[#F0F8FF] min-h-screen">
          <main className="flex-1 overflow-y-auto">
          <Navigation activeItem={activeItem} setActiveItem={setActiveItem} />
            {renderActiveComponent()}
          </main>
        </div>
      ) : (
        <div>Loading...</div> 
      )}
    </>
  );
};

export default Home;
